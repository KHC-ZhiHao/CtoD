import { AxiosInstance } from 'axios';
import { PromiseResponseType } from '../types';
declare type Config = {
    /**
     * @zh 一次回應數量
     * @en How many chat completion choices to generate for each input message.
     */
    n: number;
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
declare type ApiResponse = {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: Array<{
        text: string;
        index: number;
        logprobs: any;
        finish_reason: string;
    }>;
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
};
export declare class ChatGPT3 {
    private axios;
    private apiKey;
    private config;
    /**
     * @zh 如果你有需要特別設定 axios，請使用這方法
     */
    setAxios(axios: AxiosInstance): void;
    /**
     * @zh 設定 api key
     */
    setConfiguration(apiKey: string): void;
    /**
     * @zh 改變對話的一些設定
     */
    setConfig(options: Partial<Config>): void;
    /**
     * @zh 進行對話
     */
    talk(prompt: string | string[]): Promise<{
        id: string;
        text: string;
        isDone: boolean;
        apiReseponse: ApiResponse;
    }>;
}
export declare type ChatGPT3TalkResponse = PromiseResponseType<ChatGPT3['talk']>;
export {};
