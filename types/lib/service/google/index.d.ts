import type { GoogleGenerativeAI } from '@google/generative-ai';
export declare class Google {
    static createChatRequest(params: {
        googleGenerativeAI: GoogleGenerativeAI;
        model: string;
    }): (messages: any[], { schema }: any) => Promise<string>;
}
