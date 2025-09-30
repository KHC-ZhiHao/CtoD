import { XChat, Config } from './chat';
import { XImagesGeneration } from './images-generation';
export declare class XCtodService {
    _axios: import("axios").AxiosInstance;
    _apiKey: string;
    static createChatRequest(apiKey: string | (() => Promise<string>), config?: Partial<Config> | (() => Promise<Partial<Config>>), options?: {
        axios?: any;
    }): (messages: any[], { onCancel }: any) => Promise<string>;
    static createChatRequestWithJsonSchema(params: {
        axios?: any;
        apiKey: string | (() => Promise<string>);
        config?: Partial<Pick<Config, 'model' | 'temperature'>> | (() => Promise<Partial<Pick<Config, 'model' | 'temperature'>>>);
    }): (messages: any[], { schema, abortController }: any) => Promise<string>;
    constructor(apiKey?: string);
    /**
     * @zh 如果你有需要特別設定 axios，請使用這方法。
     * @en If you need to set axios, please use this method.
     */
    setAxios(axios: any): void;
    /**
     * @zh 設定 api key。
     * @en Set api key.
     */
    setConfiguration(apiKey: string): void;
    createChat(): XChat;
    createImagesGeneration(): XImagesGeneration;
}
