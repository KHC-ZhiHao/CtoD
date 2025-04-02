import { Config, AnthropicChat } from './chat';
import type { Anthropic } from '@anthropic-ai/sdk';
export declare class AnthropicCtodService {
    anthropicSdk: Anthropic;
    constructor(anthropicSdk: Anthropic);
    static createChatRequestWithJsonSchema(params: {
        anthropicSdk: Anthropic;
        config?: Config;
    }): (messages: any[], { schema }: any) => Promise<string>;
    createChat(): AnthropicChat;
}
