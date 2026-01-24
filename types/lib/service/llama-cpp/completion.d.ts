import { LlamaCppCtodService } from './index.js';
import { PolymorphicMessage } from '../../broker/chat.js';
type Message = {
    role: string;
    content: string;
    contents: PolymorphicMessage[];
};
type Options = any;
export type Config = {
    baseUrl: string;
    headers: Record<string, string>;
    autoConvertTraditionalChinese: boolean;
};
type Stream = {
    onMessage: (message: string) => void;
    onEnd?: (params: {
        isManualCancelled: boolean;
    }) => void;
    onWarn?: (error: any) => void;
    onError?: (error: any) => void;
};
export declare class LlamaCppCompletion {
    private getProp;
    core: LlamaCppCtodService;
    config: Config;
    constructor(core: LlamaCppCtodService);
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
