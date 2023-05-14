import { AxiosInstance } from 'axios';
declare type ApiResponse = {
    created: string;
    data: {
        b64_json: string;
    }[];
};
declare type Config = {
    /**
     * @zh 一次圖片回應數量
     * @en Number of image responses at a time
     */
    n: number;
    /**
     * @zh 解析度，例如 1024x1024
     * @en Resolution, for example 1024x1024
     */
    size: `${number}x${number}`;
};
export declare class ImagesGenerations {
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
     * @zh 產生圖片
     * @en Generate image
     */
    create(prompt: string): Promise<ApiResponse>;
}
export {};
