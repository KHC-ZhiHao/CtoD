import { AnthropicCtodService } from './index'
import { PromiseResponseType } from '../../types'

type AnthropicSdk = AnthropicCtodService['anthropicSdk']

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
    temperature: number
}

export class AnthropicChatDataGenerator {
    private config: () => Config
    constructor(config: () => Config) {
        this.config = config
    }

    /**
     * 移除 system 訊息
     */

    private translateMessages(messages: any[]) {
        return {
            system: messages.find(e => e.role === 'system')?.content,
            messages: messages.filter(e => e.role !== 'system')
        }
    }

    createChatAndStructureBody(messages: Message[], jsonSchema: any): Parameters<AnthropicSdk['messages']['create']>[0] {
        const config = this.config()
        const translateMessages = this.translateMessages(messages)
        return {
            model: config.model,
            max_tokens: config.maxTokens,
            temperature: config.temperature,
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
        }
    }

    parseChatAndStructureResult(result: Awaited<ReturnType<AnthropicSdk['messages']['create']>>): string {
        let toolUseContent: any = 'content' in result ? result.content.find(e => e.type === 'tool_use') : null
        let response = toolUseContent?.input || null
        if (response == null) {
            return 'null'
        }
        return JSON.stringify(response)
    }

    createTalkBody(messages: Message[]): Parameters<AnthropicSdk['messages']['create']>[0] {
        const config = this.config()
        const newMessages = this.translateMessages(messages)
        return {
            model: config.model,
            max_tokens: config.maxTokens,
            temperature: config.temperature,
            system: newMessages.system,
            messages: newMessages.messages
        }
    }

    parseTalkResult(result: Awaited<ReturnType<AnthropicSdk['messages']['create']>>): string {
        let output = ''
        let textContent: any = 'content' in result ? result.content.find(e => e.type === 'text') : null
        if (textContent) {
            output = textContent.text
        }
        return output
    }

    createTalkStreamBody(messages: Message[]): Parameters<AnthropicSdk['messages']['create']>[0] {
        const config = this.config()
        const newMessages = this.translateMessages(messages)
        return {
            model: config.model,
            max_tokens: config.maxTokens,
            temperature: config.temperature,
            system: newMessages.system,
            stream: true,
            messages: newMessages.messages
        }
    }
}

export class AnthropicChat {
    anthropic: AnthropicCtodService
    dataGenerator = new AnthropicChatDataGenerator(() => this.config)
    config: Config = {
        model: 'claude-3-5-haiku-latest',
        maxTokens: 8192,
        temperature: 0.7
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
     * @zh 進行對話，並且以結構化的方式輸出
     * @en Talk to the AI and output in a structured way
     */

    async chatAndStructure(messages: Message[], jsonSchema: any, options?: { abortController?: AbortController }) {
        const anthropic = this.anthropic.anthropicSdk
        const body = this.dataGenerator.createChatAndStructureBody(messages, jsonSchema)
        const msg = await anthropic.messages.create(body, {
            signal: options?.abortController?.signal
        })
        return this.dataGenerator.parseChatAndStructureResult(msg)
    }

    /**
     * @zh 進行對話
     * @en Talk to the AI
     */

    async talk(messages: Message[] = []) {
        const anthropic = this.anthropic.anthropicSdk
        const body = this.dataGenerator.createTalkBody(messages)
        const msg = await anthropic.messages.create(body)
        return this.dataGenerator.parseTalkResult(msg)
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
        let stream: Extract<Awaited<ReturnType<typeof anthropic.messages.create>>, { controller: any }> | null = null
        const anthropic = this.anthropic.anthropicSdk
        const { onMessage, onEnd, onError } = params
        const body = this.dataGenerator.createTalkStreamBody(params.messages)
        const performStreamedChat = async () => {
            try {
                let result = await anthropic.messages.create(body)
                if (result != null && 'controller' in result) {
                    stream = result
                    for await (const messageStream of stream) {
                        if (messageStream.type === 'content_block_delta') {
                            const deltaText = 'text' in messageStream.delta ? messageStream.delta.text : ''
                            onMessage(deltaText)
                        }
                    }
                }
                onEnd()
            } catch (error) {
                onError(error)
            }
        }
        performStreamedChat()
        return {
            cancel: () => {
                const int = setInterval(() => {
                    if (stream && stream.controller) {
                        stream.controller.abort()
                        clearInterval(int)
                    }
                }, 10)
            }
        }
    }
}

export type AnthropicChatTalkResponse = PromiseResponseType<AnthropicChat['talk']>
