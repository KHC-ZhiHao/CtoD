import { PromiseResponseType } from 'power-helper/types/pick';
export declare type ChatGPT35Message = {
    role: 'system' | 'user' | 'assistant';
    content: string;
};
declare type Config = {
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
    static getJailbrokenMessages(): Array<ChatGPT35Message>;
    setConfiguration(apiKey: string): void;
    setConfig(options: Partial<Config>): void;
    talk(messages?: ChatGPT35Message[]): Promise<{
        id: string;
        text: string;
        isDone: boolean;
        newMessages: ChatGPT35Message[];
    }>;
}
export declare type ChatGPT35TalkResponse = PromiseResponseType<ChatGPT35['talk']>;
export {};
