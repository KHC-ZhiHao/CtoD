import { json } from 'power-helper'
import { OpenAI } from './index'
import { PromiseResponseType } from '../../types'

export type ChatGPTMessage = {
    role: 'system' | 'user' | 'assistant'
    name?: string
    content: string
}

type ApiResponse = {
    id: string
    object: string
    created: number
    choices: Array<{
        index: number
        finish_reason: string
        message: {
            role: 'system' | 'user' | 'assistant'
            name?: string
            content: string
        }
    }>
    usage: {
        prompt_tokens: number
        completion_tokens: number
        total_tokens: number
    }
}

export type Config = {
    /**
     * @zh 一次回應數量
     * @en How many chat completion choices to generate for each input message.
     */
    n: number
    /**
     * @zh 選擇運行的模型，16k意味著能處理長度為 16,384 的文本，32k意味著能處理長度為 32768 的文本。
     * @en How many chat completion choices to generate for each input message.
     */
    model: 'gpt-4' | 'gpt-3.5-turbo' | 'gpt-4-turbo' | 'gpt-4o' | 'gpt-4o-mini' | 'o1-preview' | 'o1' | 'o1-mini'
    /**
     * @zh 冒險指數，數值由 0 ~ 2 之間，越低回應越穩定。
     * @en What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.
     */
    temperature: number
    /**
     * @zh 是否強制要回傳 JSON 格式的資料
     * @en Whether to force the return of JSON format data
     */
    forceJsonFormat: boolean
    /**
     * @zh 每次對話最多產生幾個 tokens。
     * @en How many tokens to complete to.
     */
    maxTokens?: number
}

export class OpenAIChat {
    openai: OpenAI
    config: Config = {
        n: 1,
        model: 'gpt-4o',
        temperature: 1,
        maxTokens: undefined,
        forceJsonFormat: true
    }

    constructor(openai: OpenAI) {
        this.openai = openai
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
        const result = await this.openai._axios.post<any>('https://api.openai.com/v1/moderations', {
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
        /** 要 forceJsonFormat 為 true 才會生效 */
        jsonSchema?: any
        abortController?: AbortController
    }) {
        const newMessages = json.jpjs(messages)
        const isSupportJson = [
            'gpt-4-turbo-preview',
            'gpt-4-turbo',
            'gpt-4o',
            'gpt-4o-mini',
            'gpt-3.5-turbo-1106'
        ].includes(this.config.model)
        let response_format: any = undefined
        if (isSupportJson && this.config.forceJsonFormat) {
            response_format = {
                type: 'json_object'
            }
        }
        if (isSupportJson && this.config.forceJsonFormat && options?.jsonSchema) {
            response_format = {
                type: 'json_schema',
                json_schema: options.jsonSchema
            }
        }
        const result = await this.openai._axios.post<ApiResponse>('https://api.openai.com/v1/chat/completions', {
            model: this.config.model,
            n: this.config.n,
            messages: newMessages,
            response_format,
            temperature: this.config.temperature
        }, {
            signal: options?.abortController?.signal,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.openai._apiKey}`
            }
        })
        const choices = result.data.choices || []
        const message = choices[0]?.message || {
            role: 'assistant',
            content: ''
        }
        newMessages.push(message)
        return {
            id: result?.data.id as string,
            text: message.content as string,
            newMessages,
            isDone: choices[0]?.finish_reason === 'stop',
            apiReseponse: result.data
        }
    }

    talkStream(params: {
        messages: any[]
        onMessage: (_message: string) => void
        onEnd: () => void
        onWarn: (_warn: any) => void
        onError: (_error: any) => void
    }) {
        const controller = new AbortController()
        fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.openai._apiKey}`
            },
            body: JSON.stringify({
                model: this.config.model,
                stream: true,
                messages: params.messages
            }),
            signal: controller.signal
        }).then(async response => {
            const reader = response.body?.pipeThrough(new TextDecoderStream()).getReader()
            if (!reader) {
                throw new Error('Can not get reader')
            }

            while (true) {
                const { value, done } = await reader.read()
                if (done) {
                    break
                }
                const items = value.split('\n')
                for (let item of items) {
                    if (item.length === 0) {
                        continue
                    }
                    if (item.startsWith(':')) {
                        continue
                    }
                    if (item === 'data: [DONE]') {
                        params.onEnd()
                        break
                    }
                    try {
                        const result = JSON.parse(item.substring(6))
                        const content = result.choices[0].delta.content
                        params.onMessage(content)
                    } catch (error) {
                        params.onWarn(error)
                    }
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

export type OpenAIChatTalkResponse = PromiseResponseType<OpenAIChat['talk']>
