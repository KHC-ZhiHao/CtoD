import { OpenAICtodService } from './index'
import { PromiseResponseType } from '../../types'

type ImageContent = {
    type: 'image_url' | 'text'
    text?: string
    image_url?: {
        url: string
        detail?: string
    }
}

export type VisionMessage = {
    role: 'system' | 'user' | 'assistant'
    name?: string
    content: string | ImageContent[]
}

type ApiResponse = {
    id: string
    object: string
    created: number
    model: string
    usage: {
        prompt_tokens: number
        completion_tokens: number
        total_tokens: number
    }
    choices: Array<{
        message: {
            role: string
            content: string
        }
        finish_details: {
            type: string
        }
        index: number
    }>
}

export type Config = {
    /**
     * @zh 選擇運行的模型。
     * @en How many chat completion choices to generate for each input message.
     */
    model: 'gpt-4-vision-preview'
    /**
     * @zh 冒險指數，數值由 0 ~ 2 之間。
     * @en What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.
     */
    temperature: number
    /**
     * @zh 每次對話最多產生幾個 tokens。
     * @en How many tokens to complete to.
     */
    maxTokens?: number
}

export class OpenAIVision {
    openai: OpenAICtodService
    config: Config = {
        model: 'gpt-4-vision-preview',
        maxTokens: undefined,
        temperature: 1
    }

    constructor(openai: OpenAICtodService) {
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
     * @zh 辨識圖片
     * @en Recognize images
     */

    async view(messages: VisionMessage[]) {
        const result = await this.openai._axios.post<ApiResponse>(`${this.openai._baseUrl}/v1/chat/completions`, {
            model: this.config.model,
            n: 1,
            messages,
            max_tokens: this.config.maxTokens,
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
        return {
            id: result?.data.id as string,
            text: message.content as string,
            apiResponse: result.data
        }
    }
}

export type OpenAIChatVisionResponse = PromiseResponseType<OpenAIVision['view']>
