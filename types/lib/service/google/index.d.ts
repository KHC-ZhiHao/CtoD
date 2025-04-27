import { GoogleMessage, GoogleChat } from './chat';
import type { GoogleGenerativeAI } from '@google/generative-ai';
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
    generativeAI: GoogleGenerativeAI;
    constructor(generativeAI: any);
    static chatGPTMessageToGoogleChatMessage(messages: GPTMessage[]): GoogleMessage[];
    static createChatRequestWithJsonSchema(params: {
        googleGenerativeAI: any;
        model: string;
    }): (messages: any[], { schema }: any) => Promise<any>;
    createChat(): GoogleChat;
}
export {};
