import axios, { AxiosInstance } from 'axios'
import { json } from 'power-helper'
import { PromiseResponseType } from '../types'

export type ChatGPT35Message = {
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

type Config = {
    /**
     * @zh 一次回應數量
     * @en How many chat completion choices to generate for each input message.
     */
    n: number
    /**
     * @zh 最長回應長度，最大值為 4096。
     * @en The token count of your prompt plus max_tokens cannot exceed the model's context length. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
     * @see https://platform.openai.com/tokenizer
     */
    maxTokens: number
    /**
     * @zh 冒險指數，數值由 0 ~ 2 之間。
     * @en What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.
     */
    temperature: number
}

export class ChatGPT35 {
    private axios = axios.create()
    private apiKey = ''
    private config: Config = {
        n: 1,
        maxTokens: 2048,
        temperature: 1
    }

    /**
     * @zh 如果你有需要特別設定 axios，請使用這方法
     * @en If you need to set axios, use this method
     */

    setAxios(axios: AxiosInstance) {
        this.axios = axios
    }

    /**
     * @zh 設定 api key
     * @en Set api key
     */

    setConfiguration(apiKey: string) {
        this.apiKey = apiKey
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

    async talk(messages: ChatGPT35Message[] = []) {
        const newMessages = json.jpjs(messages)
        const result = await this.axios.post<ApiResponse>('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo',
            n: this.config.n,
            messages: newMessages,
            max_tokens: this.config.maxTokens,
            temperature: this.config.temperature
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
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
            isDone: choices[0]?.finish_reason === 'stop',
            newMessages,
            apiReseponse: result.data
        }
    }

    /**
     * @zh 開啟持續性對話
     */

    async chat(prompt: string | string[], oldMessages: ChatGPT35Message[] = []) {
        const result = await this.talk([
            ...oldMessages,
            {
                role: 'user',
                content: Array.isArray(prompt) ? prompt.join('\n') : prompt
            }
        ])
        return {
            result,
            nextTalk: (prompt: string | string[]) => this.chat(prompt, result.newMessages)
        }
    }
}

export type ChatGPT35TalkResponse = PromiseResponseType<ChatGPT35['talk']>
