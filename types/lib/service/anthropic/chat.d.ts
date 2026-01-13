import { AnthropicCtodService } from './index.js';
type AnthropicSdk = AnthropicCtodService['anthropicSdk'];
export type Message = {
    role: string;
    content: string;
};
export type Config = {
    /**
     * @zh 選擇運行的模型。
     * @en What model to use.
     */
    model: string;
    maxTokens: number;
    temperature: number;
    thinking: boolean;
};
export declare class AnthropicChatDataGenerator {
    private config;
    constructor(config: () => Config);
    /**
     * 移除 system 訊息
     */
    private translateMessages;
    getThinkingParams(): {
        readonly budget_tokens: number;
        readonly type: "enabled";
    } | undefined;
    createChatAndStructureBody(messages: Message[], jsonSchema: any): Parameters<AnthropicSdk['messages']['create']>[0];
    parseChatAndStructureResult(result: Awaited<ReturnType<AnthropicSdk['messages']['create']>>): string;
    createTalkBody(messages: Message[]): Parameters<AnthropicSdk['messages']['create']>[0];
    parseTalkResult(result: Awaited<ReturnType<AnthropicSdk['messages']['create']>>): string;
    parseTalkThingsResult(result: Awaited<ReturnType<AnthropicSdk['messages']['create']>>): string[];
    createTalkStreamBody(messages: Message[]): Parameters<AnthropicSdk['messages']['create']>[0];
}
export declare class AnthropicChat {
    anthropic: AnthropicCtodService;
    dataGenerator: AnthropicChatDataGenerator;
    config: Config;
    constructor(anthropic: AnthropicCtodService);
    /**
     * @zh 改變對話的一些設定
     * @en Change some settings of the conversation
     */
    setConfig(options: Partial<Config>): void;
    /**
     * @zh 進行對話，並且以結構化的方式輸出
     * @en Talk to the AI and output in a structured way
     */
    chatAndStructure(messages: Message[], jsonSchema: any, options?: {
        abortController?: AbortController;
    }): Promise<string>;
    chatAndStructureWithDetails(messages: Message[], jsonSchema: any, options?: {
        abortController?: AbortController;
    }): Promise<{
        data: string;
        thinking: string[];
    }>;
    /**
     * @zh 進行對話
     * @en Talk to the AI
     */
    talk(messages?: Message[]): Promise<string>;
    /**
     * @zh 進行對話，並且回傳詳細內容
     * @en Talk to the AI and return detailed content
     */
    talkAndDetails(messages?: Message[]): Promise<{
        text: string;
        thinking: string[];
    }>;
    /**
     * @zh 進行對話，並且以串流的方式輸出
     * @en Talk to the AI and output in a streaming way
     */
    talkStream(params: {
        messages: Message[];
        onMessage: (_message: string) => void;
        onThinking?: (_thinking: string) => void;
        onEnd: () => void;
        onError: (_error: any) => void;
    }): {
        cancel: () => void;
    };
}
export type AnthropicChatTalkResponse = Awaited<ReturnType<AnthropicChat['talk']>>;
export {};
