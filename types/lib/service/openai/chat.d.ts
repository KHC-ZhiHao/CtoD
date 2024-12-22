import { OpenAI } from './index';
import { PromiseResponseType } from '../../types';
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
     * @zh 選擇運行的模型，16k意味著能處理長度為 16,384 的文本，32k意味著能處理長度為 32768 的文本。
     * @en How many chat completion choices to generate for each input message.
     */
    model: 'gpt-4' | 'gpt-3.5-turbo' | 'gpt-4-turbo' | 'gpt-4o' | 'gpt-4o-mini' | 'o1-preview' | 'o1' | 'o1-mini';
    /**
     * @zh 冒險指數，數值由 0 ~ 2 之間，越低回應越穩定。
     * @en What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.
     */
    temperature: number;
    /**
     * @zh 是否強制要回傳 JSON 格式的資料
     * @en Whether to force the return of JSON format data
     */
    forceJsonFormat: boolean;
    /**
     * @zh 每次對話最多產生幾個 tokens。
     * @en How many tokens to complete to.
     */
    maxTokens?: number;
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
        /** 要 forceJsonFormat 為 true 才會生效 */
        jsonSchema?: any;
        abortController?: AbortController;
    }): Promise<{
        id: string;
        text: string;
        newMessages: ChatGPTMessage[];
        isDone: boolean;
        apiReseponse: ApiResponse;
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
            apiReseponse: ApiResponse;
        };
        nextTalk: (prompt: string | string[]) => Promise<any>;
    }>;
}
export type OpenAIChatTalkResponse = PromiseResponseType<OpenAIChat['talk']>;
export {};
