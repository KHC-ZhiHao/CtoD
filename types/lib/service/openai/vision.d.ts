import { OpenAI } from './index';
import { PromiseResponseType } from '../../types';
declare type ImageContent = {
    type: 'image_url' | 'text';
    text?: string;
    image_url?: {
        url: string;
        detail?: string;
    };
};
declare type VisionMessage = {
    role: 'system' | 'user' | 'assistant';
    name?: string;
    content: string | ImageContent[];
};
declare type ApiResponse = {
    id: string;
    object: string;
    created: number;
    model: string;
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
    choices: Array<{
        message: {
            role: string;
            content: string;
        };
        finish_details: {
            type: string;
        };
        index: number;
    }>;
};
export declare type Config = {
    /**
     * @zh 選擇運行的模型。
     * @en How many chat completion choices to generate for each input message.
     */
    model: 'gpt-4-vision-preview';
    /**
     * @zh 冒險指數，數值由 0 ~ 2 之間。
     * @en What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.
     */
    temperature: number;
    /**
     * @zh 每次對話最多產生幾個 tokens。
     * @en How many tokens to complete to.
     */
    maxTokens?: number;
};
export declare class OpenAIVision {
    openai: OpenAI;
    config: Config;
    constructor(openai: OpenAI);
    /**
     * @zh 改變對話的一些設定
     * @en Change some settings of the conversation
     */
    setConfig(options: Partial<Config>): void;
    /**
     * @zh 辨識圖片
     * @en Recognize images
     */
    view(messages: VisionMessage[]): Promise<{
        id: string;
        text: string;
        apiReseponse: ApiResponse;
    }>;
}
export declare type OpenAIChatVisionResponse = PromiseResponseType<OpenAIVision['view']>;
export {};
