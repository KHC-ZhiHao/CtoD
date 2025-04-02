import { AnthropicCtodService } from './index'
import { PromiseResponseType } from '../../types'

export type Message = {
    role: string
    content: string
}

export type Config = {
    /**
     * @zh 選擇運行的模型。
     * @en What model to use.
     */
    model: string
    maxTokens: number
}

export class AnthropicChat {
    anthropic: AnthropicCtodService
    config: Config = {
        model: 'claude-3-5-haiku-latest',
        maxTokens: 8192
    }

    constructor(anthropic: AnthropicCtodService) {
        this.anthropic = anthropic
    }

    /**
     * @zh 改變對話的一些設定
     * @en Change some settings of the conversation
     */

    setConfig(options: Partial<Config>) {
        Object.assign(this.config, options)
    }

    /**
     * 移除 system 訊息
     */

    private translateMessages(messages: any[]) {
        return {
            system: messages.find(e => e.role === 'system')?.content[0].text,
            messages: messages.filter(e => e.role !== 'system')
        }
    }

    /**
     * @zh 進行對話，並且以結構化的方式輸出
     * @en Talk to the AI and output in a structured way
     */

    async chatAndStructure(messages: Message[], jsonSchema: any) {
        const anthropic = this.anthropic.anthropicSdk
        const translateMessages = this.translateMessages(messages)
        const msg = await anthropic.messages.create({
            model: this.config.model,
            max_tokens: this.config.maxTokens,
            system: translateMessages.system,
            messages: translateMessages.messages,
            tools: [
                {
                    name: 'data',
                    description: 'Response Data',
                    input_schema: jsonSchema
                }
            ],
            tool_choice: {
                type: 'tool',
                name: 'data'
            }
        })
        let toolUseContent: any = msg.content.find(e => e.type === 'tool_use')
        let response = toolUseContent?.input || null
        if (response == null) {
            return 'null'
        }
        return JSON.stringify(response)
    }

    /**
     * @zh 進行對話
     * @en Talk to the AI
     */

    async talk(messages: Message[] = []) {
        const anthropic = this.anthropic.anthropicSdk
        const newMessages = this.translateMessages(messages)
        const msg = await anthropic.messages.create({
            model: this.config.model,
            max_tokens: this.config.maxTokens,
            system: newMessages.system,
            messages: newMessages.messages
        })
        let output = ''
        let textContent: any = msg.content.find(e => e.type === 'text')
        if (textContent) {
            output = textContent.text
        }
        return output
    }

    /**
     * @zh 進行對話，並且以串流的方式輸出
     * @en Talk to the AI and output in a streaming way
     */

    talkStream(params: {
        messages: Message[]
        onMessage: (_message: string) => void
        onEnd: () => void
        onWarn: (_warn: any) => void
        onError: (_error: any) => void
    }) {
        const anthropic = this.anthropic.anthropicSdk
        const { onMessage, onEnd, onError } = params
        const { messages, system } = this.translateMessages(params.messages)
        const performStreamedChat = async () => {
            try {
                const stream = await anthropic.messages.create({
                    model: this.config.model,
                    max_tokens: this.config.maxTokens,
                    system: system,
                    stream: true,
                    messages
                })
                for await (const messageStream of stream) {
                    if (messageStream.type === 'content_block_delta') {
                        const deltaText = 'text' in messageStream.delta ? messageStream.delta.text : ''
                        onMessage(deltaText)
                    }
                }
                onEnd()
            } catch (error) {
                onError(error)
            }
        }
        performStreamedChat()
        return {
            cancel: () => null
        }
    }
}

export type AnthropicChatTalkResponse = PromiseResponseType<AnthropicChat['talk']>
