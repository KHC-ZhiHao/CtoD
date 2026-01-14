import { XCtodService } from './index.js';
export type XMessage = {
    role: 'system' | 'user' | 'assistant';
    name?: string;
    content: string;
};
type ApiResponse = {
    id: string;
    object: string;
    created_at: number;
    status: string;
    completed_at: number;
    error: any;
    incomplete_details: any;
    instructions: any;
    max_output_tokens: any;
    model: string;
    output: Array<{
        type: string;
        id: string;
        status?: string;
        role?: string;
        summary?: Array<{
            text: string;
            type: string;
        }>;
        content?: Array<{
            type: string;
            text: string;
            annotations: Array<any>;
        }>;
    }>;
    parallel_tool_calls: boolean;
    previous_response_id: any;
    reasoning: {
        effort: any;
        summary: any;
    };
    store: boolean;
    temperature: number;
    text: {
        format: {
            type: string;
        };
    };
    tool_choice: string;
    tools: Array<any>;
    top_p: number;
    truncation: string;
    usage: {
        input_tokens: number;
        input_tokens_details: {
            cached_tokens: number;
        };
        output_tokens: number;
        output_tokens_details: {
            reasoning_tokens: number;
        };
        total_tokens: number;
    };
    user: any;
    metadata: {};
};
export type Config = {
    /**
     * @zh 選擇運行的模型'
     * @en The model to use for this chat completion.
     */
    model: string;
    /**
     * @zh 冒險指數，數值由 0 ~ 2 之間，越低回應越穩定。
     * @en What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.
     */
    temperature: number;
    /**
     * @zh 每次對話最多產生幾個 tokens。
     * @en How many tokens to complete to.
     */
    maxTokens?: number;
    /**
     * @zh 是否要啟用思考。
     * @en Whether to enable reasoning.
     */
    reasoning?: {
        effort?: 'none' | 'minimal' | 'low' | 'medium' | 'high' | 'xhigh';
        summary?: 'concise' | 'detailed' | 'auto';
    };
};
export declare class XChat {
    xAi: XCtodService;
    config: Config;
    constructor(xAi: XCtodService);
    /**
     * @zh 改變對話的一些設定
     * @en Change some settings of the conversation
     */
    setConfig(options: Partial<Config>): void;
    /**
     * @zh 進行對話
     * @en Talk to the AI
     */
    talk(messages?: XMessage[], options?: {
        /** 要 forceJsonFormat 為 true 才會生效 */
        jsonSchema?: any;
        abortController?: AbortController;
    }): Promise<{
        id: string;
        text: string;
        newMessages: XMessage[];
        reasoningText: string | undefined;
        apiResponse: ApiResponse;
    }>;
    talkStream(params: {
        messages: any[];
        onMessage: (_message: string) => void;
        onEnd: () => void;
        onWarn?: (_warn: any) => void;
        onThinking?: (_message: string) => void;
        onError: (_error: any) => void;
    }): {
        cancel: () => void;
    };
    /**
     * @zh 開啟持續性對話
     */
    keepTalk(prompt: string | string[], oldMessages?: XMessage[]): Promise<{
        result: {
            id: string;
            text: string;
            newMessages: XMessage[];
            reasoningText: string | undefined;
            apiResponse: ApiResponse;
        };
        nextTalk: (prompt: string | string[]) => Promise</*elided*/ any>;
    }>;
}
export {};
