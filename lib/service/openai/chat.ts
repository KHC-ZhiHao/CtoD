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
    model: 'gpt-4' | 'gpt-4-32k' | 'gpt-3.5-turbo' | 'gpt-3.5-turbo-16k' | 'gpt-4-1106-preview' | 'gpt-3.5-turbo-1106'
    /**
     * @zh 冒險指數，數值由 0 ~ 2 之間。
     * @en What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.
     */
    temperature: number
}

export class OpenAIChat {
    openai: OpenAI
    config: Config = {
        n: 1,
        model: 'gpt-3.5-turbo',
        temperature: 1
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
     * @zh 進行對話
     * @en Talk to the AI
     */

    async talk(messages: ChatGPTMessage[] = []) {
        const newMessages = json.jpjs(messages)
        const isSupportJson = ['gpt-4-1106-preview', 'gpt-3.5-turbo-1106'].includes(this.config.model)
        const result = await this.openai._axios.post<ApiResponse>('https://api.openai.com/v1/chat/completions', {
            model: this.config.model,
            n: this.config.n,
            messages: newMessages,
            response_format: !isSupportJson ? undefined : {
                type: 'json_object'
            },
            temperature: this.config.temperature
        }, {
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
