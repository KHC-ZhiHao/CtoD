declare type TextParserParams = {
    /**
     * @zh 解讀器名字。
     * @en The name of the parser.
     */
    name: string;
    /**
     * @zh 解讀文本。
     * @en Read the text.
     */
    handler: (text: string) => Promise<any>;
};
export declare class TextParser {
    private params;
    /**
     * @zh 盡可能將文字內的 json 解讀出來。
     * @en Try to read the json in the text as much as possible.
     */
    static JsonMessage(): TextParser;
    constructor(params: TextParserParams);
    /**
     * @zh 解讀器名字。
     * @en The name of the parser.
     */
    get name(): string;
    /**
     * @zh 解讀文本。
     * @en Read the text.
     */
    read(text: string): Promise<any>;
}
export {};
