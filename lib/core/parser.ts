import JSON5 from 'json5'

type TextParserParams = {
    /**
     * @zh 解讀器名字。
     * @en The name of the parser. 
     */
    name: string
    /**
     * @zh 解讀文本。
     * @en Read the text.
     */
    handler: (text: string) => Promise<any>
}

export class TextParser {
    private params: TextParserParams

    /**
     * @zh 盡可能將文字內的 json 解讀出來。
     * @en Try to read the json in the text as much as possible.
     */

    static JsonMessage() {
        return new TextParser({
            name: 'JsonMessage',
            handler: async (text) => {
                const jsonRegex = /{(?:[^{}]|(?:{[^{}]*}))*}/
                const matchedText = text.match(jsonRegex)?.[0] || ''
                return JSON5.parse(matchedText)
            }
        })
    }

    constructor(params: TextParserParams) {
        this.params = params
    }

    /**
     * @zh 解讀器名字。
     * @en The name of the parser. 
     */

    get name() {
        return this.params.name
    }

    /**
     * @zh 解讀文本。
     * @en Read the text.
     */

    async read(text: string) {
        const result = await this.params.handler(text)
        return result
    }
}
