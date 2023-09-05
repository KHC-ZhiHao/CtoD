import { OpenAI } from './index';
import { PromiseResponseType } from '../../types';
declare type ChatGPTMessage = {
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
     * @zh 選擇運行的模型，16k意味著能處理長度為 16,384 的文本，32k意味著能處理長度為 32768 的文本。
     * @en How many chat completion choices to generate for each input message.
     */
    model: 'gpt-4' | 'gpt-4-32k' | 'gpt-3.5-turbo' | 'gpt-3.5-turbo-16k';
    /**
     * @zh 冒險指數，數值由 0 ~ 2 之間。
     * @en What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.
     */
    temperature: number;
};
export declare class OpenAIChat {
    openai: OpenAI;
    config: Config;
    constructor(openai: OpenAI);
    /**
     * @zh 改變對話的一些設定
     * @en Change some settings of the conversation
     */
    setConfig(options: Partial<Config>): void;
    /**
     * @zh 進行對話
     * @en Talk to the AI
     */
    talk(messages?: ChatGPTMessage[]): Promise<{
        id: string;
        text: string;
        newMessages: ChatGPTMessage[];
        isDone: boolean;
        apiReseponse: ApiResponse;
    }>;
    /**
     * @zh 開啟持續性對話
     */
    keepTalk(prompt: string | string[], oldMessages?: ChatGPTMessage[]): Promise<{
        result: {
            id: string;
            text: string;
            newMessages: ChatGPTMessage[];
            isDone: boolean;
            apiReseponse: ApiResponse;
        };
        nextTalk: (prompt: string | string[]) => Promise<any>;
    }>;
}
export declare type OpenAIChatTalkResponse = PromiseResponseType<OpenAIChat['talk']>;
export {};
