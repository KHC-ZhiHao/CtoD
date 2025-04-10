import { Llama3CppCtodService } from './index';
type Message = {
    role: string;
    content: string;
};
type Options = any;
export type Config = {
    baseUrl: string;
    headers: Record<string, string>;
    autoConvertTraditionalChinese: boolean;
};
type Stream = {
    onMessage: (message: string) => void;
    onEnd?: () => void;
    onWarn?: (error: any) => void;
    onError?: (error: any) => void;
};
export declare class Llama3CppCompletion {
    private getProp;
    core: Llama3CppCtodService;
    config: Config;
    constructor(core: Llama3CppCtodService);
    setConfig(config: Partial<Config>): void;
    completion(params: {
        options?: Options;
        messages: Message[];
    }): {
        run: () => Promise<{
            message: string;
            fullMessage: string;
        }>;
        cancel: () => void;
    };
    completionStream(params: Stream & {
        messages: Message[];
        options?: Options;
    }): {
        cancel: () => void;
    };
    talk(params: {
        options?: Options;
        messages: Message[];
        response_format?: {
            type: 'json_object';
            schema: any;
        };
    }): {
        run: () => Promise<{
            message: string;
        }>;
        cancel: () => void;
    };
    talkStream(params: Stream & {
        options?: Options;
        messages: Message[];
    }): {
        cancel: () => void;
    };
}
export {};
