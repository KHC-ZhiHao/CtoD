import { GoogleCtodService } from './index.js';
type Config = {
    model: string;
    size: string;
    aspectRatio: string;
};
export declare class GoogleImagesGeneration {
    private google;
    private config;
    constructor(google: GoogleCtodService);
    /**
     * @zh 改變對話的一些設定
     * @en Change some settings of the conversation
     */
    setConfig(options: Partial<Config>): void;
    /**
     * @zh 產生圖片
     * @en Generate image
     */
    create(prompt: string): Promise<{
        images: {
            url: string;
            mimeType: string;
        }[];
    }>;
}
export {};
