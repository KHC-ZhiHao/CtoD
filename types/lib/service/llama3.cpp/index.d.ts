import { AxiosInstance } from 'axios';
import { JsonSchemaInfo } from '../../utils/validate';
import { Llama3CppCompletion, Config } from './completion';
export declare class Llama3Cpp {
    _axios: AxiosInstance;
    static createChatRequest(params: {
        config: Partial<Config> | (() => Promise<Partial<Config>>);
        talkOptions?: any;
        jsonSchemaInfo?: JsonSchemaInfo;
    }): (messages: any[], { schema, onCancel }: any) => Promise<string>;
    /**
     * @zh 如果你有需要特別設定 axios，請使用這方法。
     * @en If you need to set axios, please use this method.
     */
    setAxios(axios: AxiosInstance): void;
    /**
     * @zh 建立 補強/ 對話物件。
     * @en Create completion object.
     */
    createCompletion(): Llama3CppCompletion;
}
