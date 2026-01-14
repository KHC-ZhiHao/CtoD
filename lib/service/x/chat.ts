import { json } from 'power-helper'
import { XCtodService } from './index.js'
import { parseJSONStream } from '../../utils/json.js'

export type XMessage = {
    role: 'system' | 'user' | 'assistant'
    name?: string
    content: string
}

type ApiResponse = {
    id: string
    object: string
    created_at: number
    status: string
    completed_at: number
    error: any
    incomplete_details: any
    instructions: any
    max_output_tokens: any
    model: string
    output: Array<{
        type: string
        id: string
        status?: string
        role?: string
        summary?: Array<{
            text: string
            type: string
        }>
        content?: Array<{
            type: string
            text: string
            annotations: Array<any>
        }>
    }>
    parallel_tool_calls: boolean
    previous_response_id: any
    reasoning: {
        effort: any
        summary: any
    }
    store: boolean
    temperature: number
    text: {
        format: {
            type: string
        }
    }
    tool_choice: string
    tools: Array<any>
    top_p: number
    truncation: string
    usage: {
        input_tokens: number
        input_tokens_details: {
            cached_tokens: number
        }
        output_tokens: number
        output_tokens_details: {
            reasoning_tokens: number
        }
        total_tokens: number
    }
    user: any
    metadata: {}
}

type StreamResponse = {
    type: string
    item?: {
        id: string
        type: string
        summary?: Array<any>
        status?: string
        content?: Array<any>
        role?: string
    }
    output_index?: number
    sequence_number: number
    content_index?: number
    delta?: string
    item_id?: string
    logprobs?: Array<any>
    obfuscation?: string
    part?: {
        type: string
        annotations: Array<any>
        logprobs: Array<any>
        text: string
    }
    response?: {
        id: string
        object: string
        created_at: number
        status: string
        background: boolean
        completed_at: number
        error: any
        frequency_penalty: number
        incomplete_details: any
        instructions: any
        max_output_tokens: any
        max_tool_calls: any
        model: string
        output: Array<{
            id: string
            type: string
            summary?: Array<any>
            status?: string
            content?: Array<{
                type: string
                annotations: Array<any>
                logprobs: Array<any>
                text: string
            }>
            role?: string
        }>
        parallel_tool_calls: boolean
        presence_penalty: number
        previous_response_id: any
        prompt_cache_key: any
        prompt_cache_retention: any
        reasoning: {
            effort: string
            summary: any
        }
        safety_identifier: any
        service_tier: string
        store: boolean
        temperature: number
        text: {
            format: {
                type: string
            }
            verbosity: string
        }
        tool_choice: string
        tools: Array<any>
        top_logprobs: number
        top_p: number
        truncation: string
        usage: {
            input_tokens: number
            input_tokens_details: {
                cached_tokens: number
            }
            output_tokens: number
            output_tokens_details: {
                reasoning_tokens: number
            }
            total_tokens: number
        }
        user: any
        metadata: {}
    }
}

export type Config = {
    /**
     * @zh 選擇運行的模型'
     * @en The model to use for this chat completion.
     */
    model: string
    /**
     * @zh 冒險指數，數值由 0 ~ 2 之間，越低回應越穩定。
     * @en What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.
     */
    temperature: number
    /**
     * @zh 每次對話最多產生幾個 tokens。
     * @en How many tokens to complete to.
     */
    maxTokens?: number
    /**
     * @zh 是否要啟用思考。
     * @en Whether to enable reasoning.
     */
    reasoning?: {
        effort?: 'none' | 'minimal' | 'low' | 'medium' | 'high' | 'xhigh'
        summary?: 'concise' | 'detailed' | 'auto'
    }
}

export class XChat {
    xAi: XCtodService
    config: Config = {
        model: 'grok-4-1-fast-non-reasoning',
        temperature: 1,
        maxTokens: undefined
    }

    constructor(xAi: XCtodService) {
        this.xAi = xAi
    }

    /**
     * @zh 改變對話的一些設定
     * @en Change some settings of the conversation
     */

    setConfig(options: Partial<Config>) {
        Object.assign(this.config, options)
    }

    /**
     * @zh 進行對話
     * @en Talk to the AI
     */

    async talk(messages: XMessage[] = [], options?: {
        /** 要 forceJsonFormat 為 true 才會生效 */
        jsonSchema?: any
        abortController?: AbortController
    }) {
        const newMessages = json.jpjs(messages)
        let response_format: any = undefined
        if (options?.jsonSchema) {
            response_format = {
                type: 'json_schema',
                schema: options.jsonSchema.schema
            }
        }
        const result = await this.xAi._axios.post<ApiResponse>('https://api.x.ai/v1/responses', {
            model: this.config.model,
            input: newMessages,
            temperature: this.config.temperature,
            max_output_tokens: this.config.maxTokens,
            reasoning: this.config.reasoning,
            text: response_format == null
                ? undefined
                : {
                    format: {
                        ...response_format,
                        name: 'response_format'
                    }
                }
        }, {
            signal: options?.abortController?.signal,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.xAi._apiKey}`
            }
        })
        const outputText = result.data.output.find(e => e.type === 'message')?.content?.find(e => e.type === 'output_text')
        const reasoningText = result.data.output.find(e => e.type === 'reasoning')?.summary?.find(e => e.type === 'summary_text')
        const message = {
            role: 'assistant',
            content: outputText?.text || ''
        } as const
        newMessages.push(message)
        return {
            id: result?.data.id as string,
            text: message.content as string,
            newMessages,
            reasoningText: reasoningText?.text,
            apiResponse: result.data
        }
    }

    talkStream(params: {
        messages: any[]
        onMessage: (_message: string) => void
        onEnd: () => void
        onWarn?: (_warn: any) => void
        onThinking?: (_message: string) => void
        onError: (_error: any) => void
    }) {
        const controller = new AbortController()
        fetch('https://api.x.ai/v1/responses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.xAi._apiKey}`
            },
            body: JSON.stringify({
                model: this.config.model,
                stream: true,
                input: params.messages,
                max_output_tokens: this.config.maxTokens,
                reasoning: this.config.reasoning
            }),
            signal: controller.signal
        }).then(async response => {
            if (response.ok === false) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            let lastChunk = ''
            const reader = response.body?.pipeThrough(new TextDecoderStream()).getReader()
            if (!reader) {
                throw new Error('Can not get reader')
            }
            while (true) {
                const { value, done } = await reader.read()
                if (done) {
                    break
                }
                let dataList = value.split('\n').filter(v => v.startsWith('data:'))
                for (let data of dataList) {
                    const response = parseJSONStream<StreamResponse>(lastChunk + data.slice(5))
                    for (const item of response.items) {
                        if (item.type === 'response.reasoning_summary_text.delta') {
                            params.onThinking && params.onThinking(item.delta || '')
                        }
                        if (item.type === 'response.output_text.delta') {
                            params.onMessage(item.delta || '')
                        }
                        if (item.type === 'response.completed') {
                            params.onEnd()
                        }
                    }
                    lastChunk = response.lastChunk
                }
            }
        }).catch(error => {
            if (error.name === 'AbortError') {
                params.onEnd()
            } else {
                params.onError(error)
            }
        })
        return {
            cancel: () => controller.abort()
        }
    }

    /**
     * @zh 開啟持續性對話
     */

    async keepTalk(prompt: string | string[], oldMessages: XMessage[] = []) {
        const result = await this.talk([
            ...oldMessages,
            {
                role: 'user',
                content: Array.isArray(prompt) ? prompt.join('\n') : prompt
            }
        ])
        return {
            result,
            nextTalk: (prompt: string | string[]) => this.keepTalk(prompt, result.newMessages)
        }
    }
}
