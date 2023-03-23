import JSON5 from 'json5'

type TextParserParams = {
    name: string
    handler: (text: string) => Promise<any>
}

export class TextParser {
    private params: TextParserParams

    static JsonMessage() {
        return new TextParser({
            name: 'JsonMessage',
            handler: async (text) => {
                try {
                    return JSON.parse(text)
                } catch (error) {
                    return JSON5.parse('{' + text.split('{').slice(1).join('{').split('}').slice(0, -1).join('}') + '}')
                }
            }
        })
    }

    constructor(params: TextParserParams) {
        this.params = params
    }

    get name() {
        return this.params.name
    }

    async read(text: string) {
        const result = await this.params.handler(text)
        return result
    }
}
