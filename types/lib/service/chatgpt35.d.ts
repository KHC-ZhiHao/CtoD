import { PromiseResponseType } from '../types';
export declare type ChatGPT35Message = {
    role: 'system' | 'user' | 'assistant';
    content: string;
};
declare type ApiResponse = {
    id: string;
    object: string;
    created: number;
    choices: Array<{
        index: number;
        finish_reason: string;
        message: {
            role: 'system' | 'user' | 'assistant';
            content: string;
        };
    }>;
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
};
declare type Config = {
    /**
     * @zh 一次回應數量
     * @en How many chat completion choices to generate for each input message.
     */
    n: 1;
    /**
     * @zh 最長回應長度，最大值為 4096。
     * @en The token count of your prompt plus max_tokens cannot exceed the model's context length. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
     * @see https://platform.openai.com/tokenizer
     */
    maxTokens: number;
    /**
     * @zh 冒險指數，數值由 0 ~ 2 之間。
     * @en What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.
     */
    temperature: number;
};
export declare class ChatGPT35 {
    private apiKey;
    private config;
    /**
     * @zh 獲取 DAN 指令啟用的 message
     */
    static getJailbrokenMessages(): Array<ChatGPT35Message>;
    /**
     * @zh 設定 api key
     */
    setConfiguration(apiKey: string): void;
    /**
     * @zh 設定 api key
     */
    setConfig(options: Partial<Config>): void;
    /**
     * @zh 進行對話
     */
    talk(messages?: ChatGPT35Message[]): Promise<{
        id: string;
        text: string;
        isDone: boolean;
        newMessages: ChatGPT35Message[];
        apiReseponse: ApiResponse;
    }>;
    /**
     * @zh 開啟持續性對話
     */
    chat(prompt: string | string[], oldMessages?: ChatGPT35Message[]): Promise<{
        result: {
            id: string;
            text: string;
            isDone: boolean;
            newMessages: ChatGPT35Message[];
            apiReseponse: ApiResponse;
        };
        nextTalk: (prompt: string | string[]) => Promise<any>;
    }>;
}
export declare type ChatGPT35TalkResponse = PromiseResponseType<ChatGPT35['talk']>;
export {};
