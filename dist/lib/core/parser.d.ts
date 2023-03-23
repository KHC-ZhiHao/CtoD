declare type TextParserParams = {
    name: string;
    handler: (text: string) => Promise<any>;
};
export declare class TextParser {
    private params;
    static JsonMessage(): TextParser;
    constructor(params: TextParserParams);
    get name(): string;
    read(text: string): Promise<any>;
}
export {};
