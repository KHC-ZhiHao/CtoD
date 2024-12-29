import { validateToJsonSchema } from '../../utils/validate'
import { GoogleMessage, GoogleChat } from './chat'
import type { GoogleGenerativeAI } from '@google/generative-ai'

type GPTContent = {
    type: 'image_url' | 'text'
    text?: string
    image_url?: {
        url: string
        detail?: string
    }
}

type GPTMessage = {
    role: 'system' | 'user' | 'assistant'
    content: string | GPTContent[]
}

export class GoogleCtodService {
    generativeAI: GoogleGenerativeAI

    constructor(generativeAI: GoogleGenerativeAI) {
        this.generativeAI = generativeAI
    }

    static chatGPTMessageToGoogleChatMessage(messages: GPTMessage[]): GoogleMessage[] {
        const contentToParts = (content: string | GPTMessage['content']): GoogleMessage['parts'] => {
            if (typeof content === 'string') {
                return [
                    {
                        text: content
                    }
                ]
            } else if (Array.isArray(content)) {
                return content.map(({ type, image_url, text }): GoogleMessage['parts'][number] => {
                    if (type === 'image_url') {
                        // base64
                        const url = image_url?.url || ''
                        const mimeType = url.includes('data:image/png') ? 'image/png' : 'image/jpeg'
                        return {
                            inlineData: {
                                data: url.split('base64,')[1] || '',
                                mimeType
                            }
                        }
                    } else {
                        return {
                            text: text || ''
                        }
                    }
                })
            }
            return []
        }
        return messages.map((message) => {
            if (message.role === 'user' || message.role === 'system') {
                return {
                    role: 'user',
                    parts: contentToParts(message.content)
                }
            } else {
                return {
                    role: 'model',
                    parts: contentToParts(message.content)
                }
            }
        })
    }

    static createChatRequestWithJsonSchema(params: {
        googleGenerativeAI: GoogleGenerativeAI
        model: string
    }) {
        const removeAdditionalProperties = (schema: any) => {
            if (schema.type === 'object') {
                delete schema.additionalProperties
                Object.keys(schema.properties).forEach((key) => {
                    removeAdditionalProperties(schema.properties[key])
                })
            } else if (schema.type === 'array') {
                removeAdditionalProperties(schema.items)
            }
            return schema
        }
        return async (messages: any[], { schema }: any) => {
            const responseSchema = removeAdditionalProperties(validateToJsonSchema(schema.output))
            const model = params.googleGenerativeAI.getGenerativeModel({
                model: params.model,
                generationConfig: {
                    responseMimeType: 'application/json',
                    responseSchema
                }
            })
            const result = await model.generateContent({
                contents: GoogleCtodService.chatGPTMessageToGoogleChatMessage(messages)
            })
            return result.response.text()
        }
    }

    createChat() {
        return new GoogleChat(this)
    }
}
