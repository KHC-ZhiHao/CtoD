import { validateToJsonSchema } from '../../utils/validate'
import type { GoogleGenerativeAI } from '@google/generative-ai'

export class Google {
    static createChatRequest(params: {
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
                contents: messages.map((message) => {
                    if (message.role === 'user' || message.role === 'system') {
                        return {
                            role: 'user',
                            parts: [
                                {
                                    text: message.content
                                }
                            ]
                        }
                    } else {
                        return {
                            role: 'model',
                            parts: [
                                {
                                    text: message.content
                                }
                            ]
                        }
                    }
                })
            })
            return result.response.text()
        }
    }
}
