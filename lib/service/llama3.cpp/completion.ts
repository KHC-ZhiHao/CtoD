import { Llama3CppCtodService } from './index'
import { flow, Once } from 'power-helper'
import { tify, sify } from 'chinese-conv/dist'
import { Template } from '@huggingface/jinja'

type Message = {
    role: string
    content: string
}

type Options = any

export type Config = {
    baseUrl: string
    headers: Record<string, string>
    autoConvertTraditionalChinese: boolean
}

type Stream = {
    onMessage: (message: string) => void
    onEnd?: () => void
    onWarn?: (error: any) => void
    onError?: (error: any) => void
}

class Requester {
    private core: Llama3CppCompletion
    private streamAbortControllers: {
        id: string
        controller: AbortController
    }[] = []

    constructor(core: Llama3CppCompletion) {
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
        this.streamAbortControllers.forEach(e => e.controller.abort())
        this.streamAbortControllers = []
    }

    export() {
        return {
            cancel: this.cancel.bind(this)
        }
    }
}

export class Llama3CppCompletion {
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

    core: Llama3CppCtodService
    config: Config = {
        baseUrl: '',
        headers: {},
        autoConvertTraditionalChinese: true
    }

    constructor(core: Llama3CppCtodService) {
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
                        prompt: this.config.autoConvertTraditionalChinese ? sify(prompt) : prompt
                    }
                })
                const message = this.config.autoConvertTraditionalChinese ? tify(result.data.content) : result.data.content
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
            onEnd: params.onEnd || (() => null),
            onMessage: e => {
                const message = this.config.autoConvertTraditionalChinese ? tify(e.content) : e.content
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
                    prompt: this.config.autoConvertTraditionalChinese ? sify(prompt) : prompt,
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
                            return {
                                role: e.role,
                                content: this.config.autoConvertTraditionalChinese ? sify(e.content) : e.content
                            }
                        })
                    }
                })
                const content = result.data.choices[0].message.content || ''
                return {
                    message: this.config.autoConvertTraditionalChinese ? tify(content) : content
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
            onEnd: params.onEnd || (() => null),
            onMessage: e => {
                let content = e.choices[0].delta.content
                if (content) {
                    const message = this.config.autoConvertTraditionalChinese ? tify(content) : content
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
                        content: this.config.autoConvertTraditionalChinese ? sify(e.content) : e.content
                    }
                })
            }
        })
        return requester.export()
    }
}
