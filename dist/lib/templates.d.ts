declare type JsonResponseFormat = {
    desc: string;
    example: any;
};
export declare const requireJsonResponse: (question: string | string[], format: Record<string, JsonResponseFormat>) => string;
export {};
