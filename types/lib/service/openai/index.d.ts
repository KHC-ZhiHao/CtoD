import { OpenAIVision } from './vision';
import { OpenAICompletion } from './completion';
import { OpenAIChat, Config } from './chat';
import { OpenAIImagesGeneration } from './images-generation';
import { AxiosInstance } from 'axios';
export declare class OpenAI {
    _axios: AxiosInstance;
    _apiKey: string;
    static createChatRequest(apiKey: string, config?: Partial<Config>): (messages: any[]) => Promise<string>;
    constructor(apiKey?: string);
    /**
     * @zh 如果你有需要特別設定 axios，請使用這方法。
     * @en If you need to set axios, please use this method.
     */
    setAxios(axios: AxiosInstance): void;
    /**
     * @zh 設定 api key。
     * @en Set api key.
     */
    setConfiguration(apiKey: string): void;
    createChat(): OpenAIChat;
    createVision(): OpenAIVision;
    createCompletion(): OpenAICompletion;
    createImagesGeneration(): OpenAIImagesGeneration;
}
