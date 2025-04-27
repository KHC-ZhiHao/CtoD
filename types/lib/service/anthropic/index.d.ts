import { Config, AnthropicChat } from './chat';
import type { Anthropic } from '@anthropic-ai/sdk';
type GPTContent = {
    type: 'image_url' | 'text';
    text?: string;
    image_url?: {
        url: string;
        detail?: string;
    };
};
type GPTMessage = {
    role: string;
    content: string | GPTContent[];
};
export declare class AnthropicCtodService {
    anthropicSdk: Anthropic;
    constructor(anthropicSdk: any);
    static chatGPTMessageToAnthropicChatMessage(messages: GPTMessage[]): any[];
    static createChatRequestWithJsonSchema(params: {
        anthropicSdk: any;
        config?: Partial<Config>;
    }): (messages: any[], { schema }: any) => Promise<string>;
    createChat(): AnthropicChat;
}
export {};
