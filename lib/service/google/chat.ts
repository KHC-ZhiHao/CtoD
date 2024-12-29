import { json } from 'power-helper'
import { GoogleCtodService } from './index'
import { PromiseResponseType } from '../../types'

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
}

export class GoogleChat {
    google: GoogleCtodService
    config: Config = {
        model: 'gemini-1.5-flash'
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
        const model = this.google.generativeAI.getGenerativeModel({
            model: this.config.model
        })
        const result = await model.generateContent({
            contents: newMessages
        })
        const text = result.response.text()
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
        const model = this.google.generativeAI.getGenerativeModel({
            model: this.config.model
        })
        const context = {
            contents: params.messages
        }
        model
            .generateContentStream(context)
            .then(async({ stream }) => {
                for await (const chunk of stream) {
                    const chunkText = chunk.text()
                    params.onMessage(chunkText)
                }
                params.onEnd()
            })
            .catch((error) => {
                params.onError(error)
            })
    }
}

export type GoogleChatTalkResponse = PromiseResponseType<GoogleChat['talk']>
