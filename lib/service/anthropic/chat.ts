import { AnthropicCtodService } from './index.js'
import { flow } from 'power-helper'
import { PolymorphicMessage } from '../../broker/chat.js'

type AnthropicSdk = AnthropicCtodService['anthropicSdk']

export type Message = {
    role: string
    content?: string
    contents?: PolymorphicMessage[]
}

export type Config = {
    /**
     * @zh 選擇運行的模型。
     * @en What model to use.
     */
    model: string
    maxTokens: number
    temperature: number
    thinking: boolean
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
            system: flow.run(() => {
                let systemMessage = messages.find(e => e.role === 'system')
                let output = ''
                if (systemMessage) {
                    if (systemMessage.content) {
                        output += systemMessage.content
                    }
                    if (systemMessage.contents) {
                        for (let contentBlock of systemMessage.contents) {
                            if (contentBlock.type === 'text') {
                                output += `\n${contentBlock.content}`
                            }
                        }
                    }
                }
                return output
            }),
            messages: messages.filter(e => e.role !== 'system').map(e => {
                const output: any[] = []
                if (e.content) {
                    output.push({
                        type: 'text',
                        text: e.content
                    })
                }
                if (e.contents) {
                    for (let contentBlock of e.contents) {
                        if (contentBlock.type === 'text') {
                            output.push({
                                type: 'text',
                                text: contentBlock.content
                            })
                        }
                        if (contentBlock.type === 'image') {
                            if (contentBlock.content.startsWith('http')) {
                                output.push({
                                    type: 'image',
                                    source: {
                                        type: 'url',
                                        url: contentBlock.content
                                    }
                                })
                            } else {
                                output.push({
                                    type: 'image',
                                    source: {
                                        type: 'base64',
                                        media_type: 'image/png',
                                        data: contentBlock.content.split(',')[1]
                                    }
                                })
                            }
                        }
                    }
                }
                return {
                    role: e.role,
                    content: output
                }
            })
        }
    }

    getThinkingParams() {
        const config = this.config()
        const budgetTokens = Math.floor(config.maxTokens * 0.25)
        return !config.thinking
            ? undefined
            : {
                budget_tokens: budgetTokens <= 1024 ? 1024 : (budgetTokens > 32000 ? 32000 : budgetTokens),
                type: 'enabled'
            } as const
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
            temperature: config.thinking ? 1 : config.temperature,
            system: newMessages.system,
            messages: newMessages.messages,
            thinking: this.getThinkingParams()
        }
    }

    parseTalkResult(result: Awaited<ReturnType<AnthropicSdk['messages']['create']>>): string {
        let output: string[] = []
        if ('content' in result) {
            for (let contentBlock of result.content) {
                if (contentBlock.type === 'text') {
                    output.push(contentBlock.text)
                }
            }
        }
        return output.join('\n')
    }

    parseTalkThingsResult(result: Awaited<ReturnType<AnthropicSdk['messages']['create']>>): string[] {
        let output: string[] = []
        if ('content' in result) {
            for (let contentBlock of result.content) {
                if (contentBlock.type === 'thinking') {
                    output.push(contentBlock.thinking)
                }
            }
        }
        return output
    }

    createTalkStreamBody(messages: Message[]): Parameters<AnthropicSdk['messages']['create']>[0] {
        const config = this.config()
        const newMessages = this.translateMessages(messages)
        return {
            model: config.model,
            max_tokens: config.maxTokens,
            temperature: config.thinking ? 1 : config.temperature,
            system: newMessages.system,
            stream: true,
            thinking: this.getThinkingParams(),
            messages: newMessages.messages
        }
    }
}

export class AnthropicChat {
    anthropic: AnthropicCtodService
    dataGenerator = new AnthropicChatDataGenerator(() => this.config)
    config: Config = {
        model: 'claude-3-5-haiku-latest',
        thinking: false,
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

    async chatAndStructureWithDetails(messages: Message[], jsonSchema: any, options?: { abortController?: AbortController }) {
        const anthropic = this.anthropic.anthropicSdk
        const body = this.dataGenerator.createChatAndStructureBody(messages, jsonSchema)
        const msg = await anthropic.messages.create(body, {
            signal: options?.abortController?.signal
        })
        return {
            data: this.dataGenerator.parseChatAndStructureResult(msg),
            thinking: this.dataGenerator.parseTalkThingsResult(msg)
        }
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
     * @zh 進行對話，並且回傳詳細內容
     * @en Talk to the AI and return detailed content
     */

    async talkAndDetails(messages: Message[] = []) {
        const anthropic = this.anthropic.anthropicSdk
        const body = this.dataGenerator.createTalkBody(messages)
        const msg = await anthropic.messages.create(body)
        return {
            text: this.dataGenerator.parseTalkResult(msg),
            thinking: this.dataGenerator.parseTalkThingsResult(msg)
        }
    }

    /**
     * @zh 進行對話，並且以串流的方式輸出
     * @en Talk to the AI and output in a streaming way
     */

    talkStream(params: {
        messages: Message[]
        onMessage: (_message: string) => void
        onThinking?: (_thinking: string) => void
        onEnd: (_params: { isManualCancelled: boolean }) => void
        onError: (_error: any) => void
    }) {
        let isManualCancelled = false
        let stream: Extract<Awaited<ReturnType<typeof anthropic.messages.create>>, { controller: any }> | null = null
        const { onThinking, onMessage, onEnd, onError } = params
        const anthropic = this.anthropic.anthropicSdk
        const body = this.dataGenerator.createTalkStreamBody(params.messages)
        const performStreamedChat = async () => {
            try {
                let result = await anthropic.messages.create(body)
                if (result != null && 'controller' in result) {
                    stream = result
                    for await (const messageStream of stream) {
                        if (messageStream.type === 'content_block_delta') {
                            if (messageStream.delta.type === 'thinking_delta' && onThinking) {
                                onThinking(messageStream.delta.thinking)
                            }
                            if (messageStream.delta.type === 'text_delta') {
                                onMessage(messageStream.delta.text)
                            }
                        }
                    }
                }
                onEnd({
                    isManualCancelled
                })
            } catch (error) {
                onError(error)
            }
        }
        performStreamedChat()
        return {
            isManualCancelled: () => isManualCancelled,
            cancel: () => {
                isManualCancelled = true
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

export type AnthropicChatTalkResponse = Awaited<ReturnType<AnthropicChat['talk']>>
