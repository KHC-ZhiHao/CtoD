import { GoogleMessage, GoogleChat, Config } from './chat.js';
import type { GoogleGenAI } from '@google/genai';
type GPTContent = {
    type: 'image_url' | 'text';
    text?: string;
    image_url?: {
        url: string;
        detail?: string;
    };
};
type GPTMessage = {
    role: 'system' | 'user' | 'assistant';
    content: string | GPTContent[];
};
export declare class GoogleCtodService {
    googleGenAI: GoogleGenAI;
    constructor(googleGenAI: any);
    static chatGPTMessageToGoogleChatMessage(messages: GPTMessage[]): GoogleMessage[];
    static createChatRequestWithJsonSchema(params: {
        googleGenAI: any;
        config: Partial<Omit<Config, 'model'>> | (() => Promise<Partial<Omit<Config, 'model'>>>);
        model: string;
    }): (messages: any[], { schema, abortController }: any) => Promise<string>;
    createChat(): GoogleChat;
}
export {};
