import { AnthropicCtodService } from './index';
import { PromiseResponseType } from '../../types';
export type Message = {
    role: string;
    content: string;
};
export type Config = {
    /**
     * @zh 選擇運行的模型。
     * @en What model to use.
     */
    model: string;
    maxTokens: number;
};
export declare class AnthropicChat {
    anthropic: AnthropicCtodService;
    config: Config;
    constructor(anthropic: AnthropicCtodService);
    /**
     * @zh 改變對話的一些設定
     * @en Change some settings of the conversation
     */
    setConfig(options: Partial<Config>): void;
    /**
     * 移除 system 訊息
     */
    private translateMessages;
    /**
     * @zh 進行對話，並且以結構化的方式輸出
     * @en Talk to the AI and output in a structured way
     */
    chatAndStructure(messages: Message[], jsonSchema: any): Promise<string>;
    /**
     * @zh 進行對話
     * @en Talk to the AI
     */
    talk(messages?: Message[]): Promise<string>;
    /**
     * @zh 進行對話，並且以串流的方式輸出
     * @en Talk to the AI and output in a streaming way
     */
    talkStream(params: {
        messages: Message[];
        onMessage: (_message: string) => void;
        onEnd: () => void;
        onWarn: (_warn: any) => void;
        onError: (_error: any) => void;
    }): {
        cancel: () => void;
    };
}
export type AnthropicChatTalkResponse = PromiseResponseType<AnthropicChat['talk']>;
