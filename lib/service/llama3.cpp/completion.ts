import { Llama3Cpp } from './index'
import { tify, sify } from 'chinese-conv'

type Message = {
    role: string
    content: string
}

export type Config = {
    baseUrl: string
    headers: Record<string, string>
    autoConvertTraditionalChinese: boolean
}

type Stream = {
    onMessage: (string: any) => void
    onEnd: () => void
    onWarn: (error: any) => void
    onError: (error: any) => void
}

class Requester {
    streamAbortController = new AbortController()
    isCalled = false
    core: Llama3CppCompletion
    constructor(core: Llama3CppCompletion) {
        this.core = core
    }

    async stream(params: {
        path: string
        data: any
        onMessage: (data: any) => void
        onEnd: () => void
        onWarn: (error: any) => void
        onError: (error: any) => void
    }) {
        if (this.isCalled) {
            throw new Error('Requester is already called')
        }
        this.isCalled = true
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
                params.onEnd()
            } else {
                params.onError(new Error('Body not found.'))
            }
        }
        fetch(`${this.core.config.baseUrl}/${params.path}`, {
            method: 'POST',
            body: JSON.stringify(params.data),
            signal: this.streamAbortController.signal,
            headers: {
                'Content-Type': 'application/json',
                ...this.core.config.headers
            }
        }).then(reader).catch(error => {
            if (error instanceof Error && error.message.includes('The user aborted a request')) {
                params.onEnd()
            } else {
                params.onError(error)
            }
        })
    }

    async fetch(params: {
        path: string
        data: any
    }) {
        if (this.isCalled) {
            throw new Error('Requester is already called')
        }
        this.isCalled = true
        const result = await this.core.core._axios.post(`${this.core.config.baseUrl}/${params.path}`, params.data, {
            signal: this.streamAbortController.signal,
            headers: {
                'Content-Type': 'application/json',
                ...this.core.config.headers
            }
        })
        return {
            data: result.data
        }
    }

    cancel() {
        if (this.isCalled === true) {
            this.streamAbortController.abort()
        }
    }

    export() {
        return {
            cancel: this.cancel.bind(this)
        }
    }
}

export class Llama3CppCompletion {
    core: Llama3Cpp
    config: Config = {
        baseUrl: '',
        headers: {},
        autoConvertTraditionalChinese: true
    }

    constructor(core: Llama3Cpp) {
        this.core = core
    }

    setConfig(config: Partial<Config>) {
        this.config = {
            ...this.config,
            ...config
        }
    }

    completion(params: {
        messages: Message[]
    }) {
        const prompts: string[] = []
        for (let { role, content } of params.messages) {
            if (role === 'system') {
                prompts.push(`<|start_header_id|>system<|end_header_id|>\n\n${content}\n\n`)
            }
            if (role === 'user') {
                prompts.push(`<|start_header_id|>user<|end_header_id|>\n\n${content?.replaceAll('\n', '\\n') ?? ''}`)
            }
            if (role === 'assistant') {
                prompts.push('<|start_header_id|>assistant<|end_header_id|>\n\n' + content)
            }
        }
        const requester = new Requester(this)
        const promise = requester.fetch({
            path: 'completion',
            data: {
                prompt: sify(prompts.join('\n'))
            }
        })
        return {
            ...requester.export(),
            promise: async() => {
                const result = await promise
                return this.config.autoConvertTraditionalChinese ? tify(result.data.content) : result.data.content
            }
        }
    }

    completionStream(params: Stream & {
        messages: Message[]
    }) {
        const prompts: string[] = []
        for (let { role, content } of params.messages) {
            if (role === 'system') {
                prompts.push(`<|start_header_id|>system<|end_header_id|>\n\n${content}\n\n`)
            }
            if (role === 'user') {
                prompts.push(`<|start_header_id|>user<|end_header_id|>\n\n${content?.replaceAll('\n', '\\n') ?? ''}`)
            }
            if (role === 'assistant') {
                prompts.push('<|start_header_id|>assistant<|end_header_id|>\n\n' + content)
            }
        }
        const requester = new Requester(this)
        requester.stream({
            path: 'completion',
            onEnd: params.onEnd,
            onMessage: e => {
                params.onMessage(this.config.autoConvertTraditionalChinese ? tify(e.content) : e.content)
            },
            onWarn: params.onWarn,
            onError: params.onError,
            data: {
                prompt: sify(prompts.join('\n'))
            }
        })
        return requester.export()
    }

    talk(params: {
        messages: Message[]
        response_format?: {
            type: 'json_object',
            schema: any
        }
    }) {
        const requester = new Requester(this)
        const promise = requester.fetch({
            path: 'v1/chat/completions',
            data: {
                response_format: params.response_format,
                messages: params.messages.map(e => {
                    return {
                        role: e.role,
                        content: sify(e.content)
                    }
                })
            }
        })
        return {
            ...requester.export(),
            promise: async() => {
                const result = await promise
                const content = result.data.choices[0].message.content
                return this.config.autoConvertTraditionalChinese ? tify(content) : content
            }
        }
    }

    talkStream(params: Stream & {
        messages: Message[]
    }) {
        const requester = new Requester(this)
        requester.stream({
            path: 'v1/chat/completions',
            onEnd: params.onEnd,
            onMessage: e => {
                const content = e.data.choices[0].message.content
                params.onMessage(this.config.autoConvertTraditionalChinese ? tify(content) : content)
            },
            onWarn: params.onWarn,
            onError: params.onError,
            data: {
                messages: params.messages.map(e => {
                    return {
                        role: e.role,
                        content: sify(e.content)
                    }
                })
            }
        })
        return requester.export()
    }
}
