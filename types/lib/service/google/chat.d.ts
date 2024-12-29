import { GoogleCtodService } from './index';
import { PromiseResponseType } from '../../types';
/**
 *  if data:
 *  data: base64 string,
 *  mimeType: image/jpeg,
 */
type Part = {
    text: string;
} | {
    inlineData: {
        data: string;
        mimeType: string;
    };
};
export type GoogleMessage = {
    role: 'model' | 'user';
    parts: Part[];
};
export type Config = {
    /**
     * @zh 選擇運行的模型。
     * @en What model to use.
     */
    model: string;
};
export declare class GoogleChat {
    google: GoogleCtodService;
    config: Config;
    constructor(google: GoogleCtodService);
    /**
     * @zh 改變對話的一些設定
     * @en Change some settings of the conversation
     */
    setConfig(options: Partial<Config>): void;
    /**
     * @zh 進行對話
     * @en Talk to the AI
     */
    talk(messages?: GoogleMessage[]): Promise<{
        text: string;
        newMessages: (GoogleMessage | {
            role: string;
            parts: {
                text: string;
            }[];
        })[];
    }>;
    talkStream(params: {
        messages: GoogleMessage[];
        onMessage: (_message: string) => void;
        onEnd: () => void;
        onWarn: (_warn: any) => void;
        onError: (_error: any) => void;
    }): void;
}
export type GoogleChatTalkResponse = PromiseResponseType<GoogleChat['talk']>;
export {};
