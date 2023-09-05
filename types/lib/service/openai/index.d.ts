import { OpenAIChat } from './chat';
import { OpenAICompletion } from './completion';
import { OpenAIImagesGeneration } from './images-generation';
import { AxiosInstance } from 'axios';
export declare class OpenAI {
    _axios: AxiosInstance;
    _apiKey: string;
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
    createCompletion(): OpenAICompletion;
    createImagesGeneration(): OpenAIImagesGeneration;
}
