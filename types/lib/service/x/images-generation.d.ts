import { XCtodService } from './index';
type ApiResponse = {
    created: string;
    data: {
        b64_json: string;
    }[];
};
type Config = {
    /**
     * @zh 模型，支援 grok-2-image
     * @en Model, support grok-2-image
     */
    model: 'grok-2-image';
};
export declare class XImagesGeneration {
    private xAi;
    private config;
    constructor(xAi: XCtodService);
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
