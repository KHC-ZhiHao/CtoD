import { OpenAIVision } from './vision.js';
import { OpenAIChat, Config } from './chat.js';
import { OpenAIImagesGeneration } from './images-generation.js';
export declare class OpenAICtodService {
    _axios: import("axios").AxiosInstance;
    _apiKey: string;
    _baseUrl: string;
    static createChatRequest(apiKey: string | (() => Promise<string>), config?: Partial<Config> | (() => Promise<Partial<Config>>), options?: {
        axios?: any;
        baseUrl?: string;
    }): (messages: any[], { abortController }: any) => Promise<string>;
    static createChatRequestWithJsonSchema(params: {
        axios?: any;
        apiKey: string | (() => Promise<string>);
        config?: Partial<Pick<Config, 'model' | 'temperature'>> | (() => Promise<Partial<Pick<Config, 'model' | 'temperature'>>>);
    }): (messages: any[], { schema, onCancel }: any) => Promise<string>;
    constructor(apiKey?: string);
    /**
     * @zh 如果你有需要特別設定 axios，請使用這方法。
     * @en If you need to set axios, please use this method.
     */
    setAxios(axios: any): void;
    /**
     * @zh 如果你有需要特別設定 baseUrl，請使用這方法。
     * @en If you need to set baseUrl, please use this method.
     */
    setBaseUrl(baseUrl: string): void;
    /**
     * @zh 設定 api key。
     * @en Set api key.
     */
    setConfiguration(apiKey: string): void;
    createChat(): OpenAIChat;
    createVision(): OpenAIVision;
    createImagesGeneration(): OpenAIImagesGeneration;
}
