import { LlamaCppCtodService } from './index.js'
import { flow, Once } from 'power-helper'
import { s2t, t2s } from '../../utils/chinese-conv.js'
import { Template } from '@huggingface/jinja'
import { PolymorphicMessage } from '../../broker/chat.js'

type Message = {
    role: string
    content: string
    contents: PolymorphicMessage[]
}

type Options = any

export type Config = {
    baseUrl: string
    headers: Record<string, string>
    autoConvertTraditionalChinese: boolean
}

type Stream = {
    onMessage: (message: string) => void
    onEnd?: (params: { isManualCancelled: boolean }) => void
    onWarn?: (error: any) => void
    onError?: (error: any) => void
}

class Requester {
    isManualCancelled = false
    private core: LlamaCppCompletion
    private streamAbortControllers: {
        id: string
        controller: AbortController
    }[] = []

    constructor(core: LlamaCppCompletion) {
        this.core = core
    }

    private createAbortController() {
        const streamAbortController = new AbortController()
        const streamAbortControllerId = flow.createUuid()
        this.streamAbortControllers.push({
            id: streamAbortControllerId,
            controller: streamAbortController
        })
        return {
            signal: streamAbortController.signal,
            controllerId: streamAbortControllerId
        }
    }

    private removeAbortController(streamAbortControllerId: string) {
        this.streamAbortControllers = this.streamAbortControllers.filter(e => e.id !== streamAbortControllerId)
    }

    async stream(params: {
        path: string
        data: Record<string, any> | (() => Promise<any>)
        onMessage: (data: any) => void
        onEnd: () => void
        onWarn: (error: any) => void
        onError: (error: any) => void
    }) {
        const { signal, controllerId } = this.createAbortController()
        const end = () => {
            this.removeAbortController(controllerId)
            params.onEnd()
        }
        const reader = async(response: Response) => {
            if (response.body) {
                let reader = response.body.getReader()
                let done = false
                let chunk = ''
                while (!done) {
                    const { value, done: readerDone } = await reader.read()
                    if (value) {
                        chunk += new TextDecoder('utf-8').decode(value)
                        const payloads = chunk.split('\n\n')
                        chunk = payloads.pop() || ''
                        payloads.forEach(payload => {
                            if (payload.includes('[DONE]')) {
                                done = true
                            }
                            if (payload.startsWith('data:')) {
                                try {
                                    const data = JSON.parse(payload.replace('data: ', ''))
                                    params.onMessage(data)
                                } catch (error) {
                                    params.onWarn(error)
                                }
                            }
                        })
                    }
                    if (readerDone) {
                        done = true
                    }
                }
                end()
            } else {
                params.onError(new Error('Body not found.'))
            }
        }
        fetch(`${this.core.config.baseUrl}/${params.path}`, {
            method: 'POST',
            body: JSON.stringify(typeof params.data === 'function' ? (await params.data()) : params.data),
            signal,
            headers: {
                'Content-Type': 'application/json',
                ...this.core.config.headers
            }
        })
            .then(reader)
            .catch(error => {
                if (error instanceof Error && error.message.includes('The user aborted a request')) {
                    end()
                } else {
                    params.onError(error)
                }
            })
    }

    async fetch(params: {
        path: string
        data: any
    }) {
        const { signal, controllerId } = this.createAbortController()
        try {
            const result = await this.core.core._axios.post(`${this.core.config.baseUrl}/${params.path}`, params.data, {
                signal,
                headers: {
                    'Content-Type': 'application/json',
                    ...this.core.config.headers
                }
            })
            return {
                data: result.data
            }
        } finally {
            this.removeAbortController(controllerId)
        }
    }

    cancel() {
        this.isManualCancelled = true
        this.streamAbortControllers.forEach(e => e.controller.abort())
        this.streamAbortControllers = []
    }

    export() {
        return {
            cancel: this.cancel.bind(this)
        }
    }
}

export class LlamaCppCompletion {
    private getProp = new Once({
        handler: async() => {
            const url = `${this.config.baseUrl}/props`
            const { data: props } = await this.core._axios.get<{
                chat_template: string
                bos_token: string
                eos_token: string
            }>(url, {})
            return props
        }
    })

    core: LlamaCppCtodService
    config: Config = {
        baseUrl: '',
        headers: {},
        autoConvertTraditionalChinese: true
    }

    constructor(core: LlamaCppCtodService) {
        this.core = core
    }

    setConfig(config: Partial<Config>) {
        this.config = {
            ...this.config,
            ...config
        }
    }

    completion(params: {
        options?: Options
        messages: Message[]
    }) {
        const lastMessage = params.messages.at(-1) || ''
        const requester = new Requester(this)
        return {
            ...requester.export(),
            run: async(): Promise<{
                message: string
                fullMessage: string
            }> => {
                const props = await this.getProp.run()
                const template = new Template(props.chat_template)
                const prompt = template.render({
                    bos_token: props.bos_token,
                    messages: params.messages
                }).slice(0, props.eos_token.length * -1 - 1)
                const result = await requester.fetch({
                    path: 'completion',
                    data: {
                        ...(params.options || {}),
                        prompt: this.config.autoConvertTraditionalChinese ? t2s(prompt) : prompt
                    }
                })
                const message = this.config.autoConvertTraditionalChinese ? s2t(result.data.content) : result.data.content
                return {
                    message,
                    fullMessage: `${lastMessage}${message}`
                }
            }
        }
    }

    completionStream(params: Stream & {
        messages: Message[]
        options?: Options
    }) {
        const requester = new Requester(this)
        requester.stream({
            path: 'completion',
            onEnd: () => {
                if (params.onEnd) {
                    params.onEnd({
                        isManualCancelled: requester.isManualCancelled
                    })
                }
            },
            onMessage: e => {
                const message = this.config.autoConvertTraditionalChinese ? s2t(e.content) : e.content
                params.onMessage(message)
            },
            onWarn: params.onWarn || (() => null),
            onError: params.onError || (() => null),
            data: async() => {
                const props = await this.getProp.run()
                const template = new Template(props.chat_template)
                const prompt = template.render({
                    bos_token: props.bos_token,
                    messages: params.messages
                }).slice(0, props.eos_token.length * -1 - 1)
                return {
                    ...(params.options || {}),
                    prompt: this.config.autoConvertTraditionalChinese ? t2s(prompt) : prompt,
                    stream: true
                }
            }
        })
        return requester.export()
    }

    talk(params: {
        options?: Options
        messages: Message[]
        response_format?: {
            type: 'json_object'
            schema: any
        }
    }) {
        const requester = new Requester(this)
        return {
            ...requester.export(),
            run: async(): Promise<{
                message: string
            }> => {
                const result = await requester.fetch({
                    path: 'v1/chat/completions',
                    data: {
                        ...(params.options || {}),
                        response_format: params.response_format,
                        messages: params.messages.map(e => {
                            const output = {
                                role: e.role,
                                content: ''
                            }
                            if (e.content) {
                                output.content = this.config.autoConvertTraditionalChinese ? t2s(e.content) : e.content
                            }
                            if (e.contents) {
                                output.content += e.contents.map(item => {
                                    if (item.type === 'text') {
                                        return item.content
                                    }
                                    return ''
                                }).join('\n')
                            }
                            return output
                        })
                    }
                })
                const content = result.data.choices[0].message.content || ''
                return {
                    message: this.config.autoConvertTraditionalChinese ? s2t(content) : content
                }
            }
        }
    }

    talkStream(params: Stream & {
        options?: Options
        messages: Message[]
    }) {
        const requester = new Requester(this)
        requester.stream({
            path: 'v1/chat/completions',
            onEnd: () => {
                if (params.onEnd) {
                    params.onEnd({
                        isManualCancelled: requester.isManualCancelled
                    })
                }
            },
            onMessage: e => {
                let content = e.choices[0].delta.content
                if (content) {
                    const message = this.config.autoConvertTraditionalChinese ? s2t(content) : content
                    params.onMessage(message)
                }
            },
            onWarn: params.onWarn || (() => null),
            onError: params.onError || (() => null),
            data: {
                ...(params.options || {}),
                stream: true,
                messages: params.messages.map(e => {
                    return {
                        role: e.role,
                        content: this.config.autoConvertTraditionalChinese ? t2s(e.content) : e.content
                    }
                })
            }
        })
        return requester.export()
    }
}
