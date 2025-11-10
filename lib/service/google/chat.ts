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
}

export class GoogleChat {
    google: GoogleCtodService
    config: Config = {
        model: 'gemini-2.0-flash',
        maxTokens: 1024,
        temperature: 0.7
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

    /**
     * @zh 進行對話
     * @en Talk to the AI
     */

    async talk(messages: GoogleMessage[] = []) {
        const newMessages = json.jpjs(messages)
        const response = await this.google.googleGenAI.models.generateContent({
            model: this.config.model,
            contents: newMessages,
            config: {
                temperature: this.config.temperature,
                maxOutputTokens: this.config.maxTokens
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
        messages: GoogleMessage[]
        onMessage: (_message: string) => void
        onEnd: () => void
        onWarn: (_warn: any) => void
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
            }
        })
        model.then(async(stream) => {
            try {
                for await (const chunk of stream) {
                    const chunkText = chunk.candidates?.[0].content?.parts?.[0].text || ''
                    params.onMessage(chunkText)
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
