import { validateToJsonSchema } from '../../utils/validate.js'
import { GoogleMessage, GoogleChat, Config } from './chat.js'
import { GoogleImagesGeneration } from './images-generation.js'
import type { GoogleGenAI } from '@google/genai'

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
    googleGenAI: GoogleGenAI

    constructor(googleGenAI: any) {
        this.googleGenAI = googleGenAI
    }

    static chatGPTMessageToGoogleChatMessage(messages: GPTMessage[]): {
        system: string
        messages: GoogleMessage[]
    } {
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
        let system = ''
        const outputMessages: GoogleMessage[] = messages.map((message) => {
            if (message.role === 'system') {
                system = typeof message.content === 'string' ? message.content : ''
                return {
                    role: 'user',
                    parts: []
                }
            } else if (message.role === 'user') {
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
        return {
            system,
            messages: outputMessages.filter((msg) => msg.parts.length > 0)
        }
    }

    static createChatRequestWithJsonSchema(params: {
        googleGenAI: any
        config: Partial<Omit<Config, 'model'>> | (() => Promise<Partial<Omit<Config, 'model'>>>)
        model: string
    }) {
        const googleGenAI: GoogleGenAI = params.googleGenAI
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
        return async (messages: any[], { schema, abortController }: any) => {
            const config = typeof params.config === 'function' ? await params.config() : params.config
            const context = GoogleCtodService.chatGPTMessageToGoogleChatMessage(messages)
            const response = await googleGenAI.models.generateContent({
                model: params.model,
                contents: context.messages,
                config: {
                    abortSignal: abortController.signal,
                    maxOutputTokens: config.maxTokens,
                    temperature: config.temperature,
                    systemInstruction: context.system || undefined,
                    responseMimeType: 'application/json',
                    responseJsonSchema: validateToJsonSchema(schema.output),
                    thinkingConfig: GoogleChat.getThinkingConfig(config.thinkingConfig)
                }
            })
            return response.text || ''
        }
    }

    createChat() {
        return new GoogleChat(this)
    }

    createImagesGeneration() {
        return new GoogleImagesGeneration(this)
    }
}
