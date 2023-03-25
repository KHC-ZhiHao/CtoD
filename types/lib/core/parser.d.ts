declare type TextParserParams = {
    /**
     * 解讀器名字
     */
    name: string;
    /**
     * 解讀文本
     */
    handler: (text: string) => Promise<any>;
};
export declare class TextParser {
    private params;
    /**
     * 盡可能將文字內的 json 解讀出來
     */
    static JsonMessage(): TextParser;
    constructor(params: TextParserParams);
    /**
     * 解讀器名字
     */
    get name(): string;
    /**
     * 解讀文本
     */
    read(text: string): Promise<any>;
}
export {};
