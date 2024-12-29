import { OpenAICtodService } from './index';
type ApiResponse = {
    created: string;
    data: {
        b64_json: string;
    }[];
};
type Config = {
    /**
     * @zh 模型，支援 dall-e-2 和 dall-e-3
     * @en Model, support dall-e-2 and dall-e-3
     */
    model: 'dall-e-2' | 'dall-e-3';
    /**
     * @zh 解析度，例如 1024x1024
     * @en Resolution, for example 1024x1024
     */
    size: `${number}x${number}`;
};
export declare class OpenAIImagesGeneration {
    private openai;
    private config;
    constructor(openai: OpenAICtodService);
    /**
     * @zh 改變對話的一些設定
     * @en Change some settings of the conversation
     */
    setConfig(options: Partial<Config>): void;
    /**
     * @zh 產生圖片
     * @en Generate image
     */
    create(prompt: string): Promise<ApiResponse>;
}
export {};
