import { validateToJsonSchema } from '../../utils/validate'
import { Config, AnthropicChat } from './chat'
import type { Anthropic } from '@anthropic-ai/sdk'

export class AnthropicCtodService {
    anthropicSdk: Anthropic

    constructor(anthropicSdk: Anthropic) {
        this.anthropicSdk = anthropicSdk
    }

    static createChatRequestWithJsonSchema(params: {
        anthropicSdk: Anthropic
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
