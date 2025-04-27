import { validateToJsonSchema } from '../../utils/validate'
import { Config, AnthropicChat } from './chat'
import type { Anthropic } from '@anthropic-ai/sdk'

type GPTContent = {
    type: 'image_url' | 'text'
    text?: string
    image_url?: {
        url: string
        detail?: string
    }
}

type GPTMessage = {
    role: string
    content: string | GPTContent[]
}
export class AnthropicCtodService {
    anthropicSdk: Anthropic

    constructor(anthropicSdk: any) {
        this.anthropicSdk = anthropicSdk
    }

    static chatGPTMessageToAnthropicChatMessage(messages: GPTMessage[]): any[] {
        const newMessage = messages.map(e => {
            return {
                role: e.role,
                content: typeof e.content === 'string'
                    ? e.content
                    : e.content.map((content) => {
                        if (content.type === 'image_url') {
                            const url = content.image_url?.url || ''
                            return {
                                type: 'image',
                                source: {
                                    type: 'base64',
                                    media_type: url.slice(5).split(';')[0],
                                    data: url.split(',')[1]
                                }
                            }
                        }
                        return {
                            type: 'text',
                            text: content.text
                        }
                    })
            }
        })
        return newMessage
    }

    static createChatRequestWithJsonSchema(params: {
        anthropicSdk: any
        config?: Partial<Config>
    }) {
        const anthropic = new AnthropicCtodService(params.anthropicSdk)
        const chat = anthropic.createChat()
        chat.setConfig(params.config || {})
        return async (messages: any[], { schema }: any) => {
            const jsonSchema = validateToJsonSchema(schema.output)
            const content = await chat.chatAndStructure(messages, jsonSchema)
            return content
        }
    }

    createChat() {
        return new AnthropicChat(this)
    }
}
