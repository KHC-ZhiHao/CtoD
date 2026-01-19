import { json } from 'power-helper'
import { GoogleCtodService } from './index.js'

/**
 *  if data:
 *  data: base64 string,
 *  mimeType: image/jpeg,
 */

type Part = {
    text: string
} | {
    inlineData: {
        data: string
        mimeType: string
    }
}

export type GoogleMessage = {
    role: 'model' | 'user'
    parts: Part[]
}

export type Config = {
    /**
     * @zh 選擇運行的模型。
     * @en What model to use.
     */
    model: string
    maxTokens: number
    temperature: number
    enableGoogleSearch: boolean
    thinkingConfig: {
        enabled: boolean
        level: 'THINKING_LEVEL_UNSPECIFIED' | 'LOW' | 'HIGH'
    }
}

export class GoogleChat {
    google: GoogleCtodService
    config: Config = {
        model: 'gemini-3-flash-preview',
        maxTokens: 1024,
        temperature: 0.7,
        enableGoogleSearch: false,
        thinkingConfig: {
            enabled: false,
            level: 'THINKING_LEVEL_UNSPECIFIED'
        }
    }

    constructor(google: GoogleCtodService) {
        this.google = google
    }

    /**
     * @zh 改變對話的一些設定
     * @en Change some settings of the conversation
     */

    setConfig(options: Partial<Config>) {
        Object.assign(this.config, options)
    }

    static getThinkingConfig(config?: Config['thinkingConfig']) {
        if (!config) {
            return undefined
        }
        return !config.enabled
            ? undefined
            : {
                includeThoughts: true,
                thinkingLevel: config.level as any
            }
    }

    /**
     * @zh 進行對話
     * @en Talk to the AI
     */

    async talk(params: {
        system?: string
        messages: GoogleMessage[]
    }) {
        const newMessages = json.jpjs(params.messages)
        const response = await this.google.googleGenAI.models.generateContent({
            model: this.config.model,
            contents: newMessages,
            config: {
                temperature: this.config.temperature,
                maxOutputTokens: this.config.maxTokens,
                systemInstruction: params.system || undefined,
                thinkingConfig: GoogleChat.getThinkingConfig(this.config.thinkingConfig),
                tools: !this.config.enableGoogleSearch
                    ? []
                    : [
                        {
                            googleSearch: {}
                        }
                    ]
            }
        })
        const text = response.text
        return {
            text,
            newMessages: [
                ...newMessages,
                {
                    role: 'model',
                    parts: [
                        {
                            text
                        }
                    ]
                }
            ]
        }
    }

    /**
     * @zh 進行對話，並且以串流的方式輸出
     * @en Talk to the AI and output in a streaming way
     */

    talkStream(params: {
        system?: string
        messages: GoogleMessage[]
        onMessage: (_message: string) => void
        onEnd: () => void
        onThinking?: (_thinking: string) => void
        onError: (_error: any) => void
    }) {
        const state = {
            controller: new AbortController()
        }
        const model = this.google.googleGenAI.models.generateContentStream({
            model: this.config.model,
            contents: params.messages,
            config: {
                abortSignal: state.controller.signal,
                temperature: this.config.temperature,
                maxOutputTokens: this.config.maxTokens,
                systemInstruction: params.system || undefined,
                thinkingConfig: GoogleChat.getThinkingConfig(this.config.thinkingConfig),
                tools: !this.config.enableGoogleSearch
                    ? []
                    : [
                        {
                            googleSearch: {}
                        }
                    ]
            }
        })
        model.then(async(stream) => {
            try {
                for await (const chunk of stream) {
                    const parts = chunk.candidates?.[0].content?.parts || []
                    for (let part of parts) {
                        if (part.text) {
                            if (part.thought) {
                                params.onThinking?.(part.text)
                            } else {
                                params.onMessage(part.text)
                            }
                        }
                    }
                }
                params.onEnd()
            } catch (error) {
                if (state.controller.signal.aborted) {
                    params.onEnd()
                } else {
                    throw error
                }
            }
        })
            .catch((error) => {
                params.onError(error)
            })
        return {
            cancel: () => {
                state.controller.abort()
            }
        }
    }
}

export type GoogleChatTalkResponse = Awaited<ReturnType<GoogleChat['talk']>>
