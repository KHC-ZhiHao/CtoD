import { OpenAICtodService } from './index.js';
export type ChatGPTMessage = {
    role: 'system' | 'user' | 'assistant';
    name?: string;
    content: string;
};
type ApiResponse = {
    id: string;
    object: string;
    created: number;
    choices: Array<{
        index: number;
        finish_reason: string;
        message: {
            role: 'system' | 'user' | 'assistant';
            name?: string;
            content: string;
        };
    }>;
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
};
export type Config = {
    /**
     * @zh 一次回應數量
     * @en How many chat completion choices to generate for each input message.
     */
    n: number;
    /**
     * @zh 選擇運行的模型'
     * @en The model to use for this chat completion.
     */
    model: string;
    /**
     * @zh 冒險指數，數值由 0 ~ 2 之間，越低回應越穩定。
     * @en What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.
     */
    temperature: number;
    /**
     * @zh 每次對話最多產生幾個 tokens。
     * @en How many tokens to complete to.
     */
    maxTokens?: number;
};
export declare class OpenAIChat {
    openai: OpenAICtodService;
    config: Config;
    constructor(openai: OpenAICtodService);
    /**
     * @zh 改變對話的一些設定
     * @en Change some settings of the conversation
     */
    setConfig(options: Partial<Config>): void;
    /**
     * @zh 檢視內容是否符合 OpenAI 的審查
     * @en View content for OpenAI moderation
     */
    moderations(input: string): Promise<{
        isSafe: boolean;
        result: any;
    }>;
    /**
     * @zh 進行對話
     * @en Talk to the AI
     */
    talk(messages?: ChatGPTMessage[], options?: {
        jsonSchema?: any;
        abortController?: AbortController;
    }): Promise<{
        id: string;
        text: string;
        newMessages: ChatGPTMessage[];
        isDone: boolean;
        apiResponse: ApiResponse;
    }>;
    talkStream(params: {
        messages: any[];
        onMessage: (_message: string) => void;
        onEnd: () => void;
        onWarn: (_warn: any) => void;
        onError: (_error: any) => void;
    }): {
        cancel: () => void;
    };
    /**
     * @zh 開啟持續性對話
     */
    keepTalk(prompt: string | string[], oldMessages?: ChatGPTMessage[]): Promise<{
        result: {
            id: string;
            text: string;
            newMessages: ChatGPTMessage[];
            isDone: boolean;
            apiResponse: ApiResponse;
        };
        nextTalk: (prompt: string | string[]) => Promise</*elided*/ any>;
    }>;
}
export type OpenAIChatTalkResponse = Awaited<ReturnType<OpenAIChat['talk']>>;
export {};
