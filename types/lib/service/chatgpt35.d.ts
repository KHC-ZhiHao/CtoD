import { AxiosInstance } from 'axios';
import { PromiseResponseType } from '../types';
export declare type ChatGPT35Message = {
    role: 'system' | 'user' | 'assistant';
    name?: string;
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
declare type Config = {
    /**
     * @zh 一次回應數量
     * @en How many chat completion choices to generate for each input message.
     */
    n: number;
    /**
     * @zh 最長回應長度，最大值為 16,384。
     * @en The token count of your prompt plus max_tokens cannot exceed the model's context length. Most models have a context length of 2048 tokens (except for the newest models, which support 16,384).
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
    private axios;
    private apiKey;
    private config;
    /**
     * @zh 如果你有需要特別設定 axios，請使用這方法
     * @en If you need to set axios, use this method
     */
    setAxios(axios: AxiosInstance): void;
    /**
     * @zh 設定 api key
     * @en Set api key
     */
    setConfiguration(apiKey: string): void;
    /**
     * @zh 改變對話的一些設定
     * @en Change some settings of the conversation
     */
    setConfig(options: Partial<Config>): void;
    /**
     * @zh 進行對話
     * @en Talk to the AI
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
