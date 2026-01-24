import { json } from 'power-helper'
import { parseJSONStream } from '../../utils/json.js'
import { OpenAICtodService } from './index.js'
import { PolymorphicMessage } from '../../broker/chat.js'

export type ChatGPTMessage = {
    role: 'system' | 'user' | 'assistant' | string
    name?: string
    content?: string
    contents?: PolymorphicMessage[]
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

export class OpenAIChat {
    openai: OpenAICtodService
    config: Config = {
        model: 'gpt-5',
        temperature: 1,
        maxTokens: undefined
    }

    constructor(openai: OpenAICtodService) {
        this.openai = openai
    }

    static toApiMessages(messages: ChatGPTMessage[]) {
        return messages.map(message => {
            const output = []
            if (message.content) {
                output.push({
                    type: 'input_text',
                    text: message.content
                })
            }
            if (message.contents) {
                for (const item of message.contents) {
                    if (item.type === 'text') {
                        output.push({
                            type: 'input_text',
                            text: item.content
                        })
                    } else if (item.type === 'image') {
                        const url = item.content || ''
                        output.push({
                            type: 'input_image',
                            image_url: url
                        })
                    }
                }
            }
            return {
                role: message.role,
                name: message.name,
                content: output
            }
        })
    }

    /**
     * @zh 改變對話的一些設定
     * @en Change some settings of the conversation
     */

    setConfig(options: Partial<Config>) {
        Object.assign(this.config, options)
    }

    /**
     * @zh 檢視內容是否符合 OpenAI 的審查
     * @en View content for OpenAI moderation
     */

    async moderations(input: string) {
        const result = await this.openai._axios.post<any>(`${this.openai._baseUrl}/v1/moderations`, {
            input: input
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.openai._apiKey}`
            }
        })
        return {
            isSafe: result.data.results?.[0]?.flagged === false,
            result: result.data
        }
    }

    /**
     * @zh 進行對話
     * @en Talk to the AI
     */

    async talk(messages: ChatGPTMessage[] = [], options?: {
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
        const result = await this.openai._axios.post<ApiResponse>(`${this.openai._baseUrl}/v1/responses`, {
            model: this.config.model,
            input: OpenAIChat.toApiMessages(newMessages),
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
                'Authorization': `Bearer ${this.openai._apiKey}`
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
        onEnd: (_params: { isManualCancelled: boolean }) => void
        onError: (_error: any) => void
        onWarn?: (_warn: any) => void
        onThinking?: (_message: string) => void
    }) {
        let endFlag = false
        let isManualCancelled = false
        const controller = new AbortController()
        const end = () => {
            if (endFlag) return
            endFlag = true
            params.onEnd({
                isManualCancelled
            })
        }
        fetch(`${this.openai._baseUrl}/v1/responses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.openai._apiKey}`
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
                    end()
                    break
                }
                let dataList: string[] = value.split('\n').map(e => {
                    if (e.startsWith('data:')) {
                        return e.slice(5).trim()
                    }
                    if (lastChunk && !e.startsWith('event:')) {
                        return lastChunk + e.trim()
                    }
                    return ''
                })
                for (let data of dataList) {
                    if (!data) continue
                    const response = parseJSONStream<StreamResponse>(data)
                    for (const item of response.items) {
                        if (item.type === 'response.reasoning_summary_text.delta' && params.onThinking) {
                            params.onThinking(item.delta || '')
                        }
                        if (item.type === 'response.output_text.delta') {
                            params.onMessage(item.delta || '')
                        }
                        if (item.type === 'response.completed') {
                            end()
                        }
                    }
                    lastChunk = response.lastChunk
                }
            }
        }).catch(error => {
            if (error.name === 'AbortError') {
                end()
            } else {
                params.onError(error)
            }
        })
        return {
            isManualCancelled: () => isManualCancelled,
            cancel: () => {
                isManualCancelled = true
                controller.abort()
            }
        }
    }

    /**
     * @zh 開啟持續性對話
     */

    async keepTalk(prompt: string | string[], oldMessages: ChatGPTMessage[] = []) {
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

export type OpenAIChatTalkResponse = Awaited<ReturnType<OpenAIChat['talk']>>
