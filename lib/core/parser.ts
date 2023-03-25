import JSON5 from 'json5'

type TextParserParams = {
    /**
     * 解讀器名字 
     */
    name: string
    /**
     * 解讀文本
     */
    handler: (text: string) => Promise<any>
}

export class TextParser {
    private params: TextParserParams

    /**
     * 盡可能將文字內的 json 解讀出來
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
     * 解讀器名字 
     */

    get name() {
        return this.params.name
    }

    /**
     * 解讀文本
     */

    async read(text: string) {
        const result = await this.params.handler(text)
        return result
    }
}
