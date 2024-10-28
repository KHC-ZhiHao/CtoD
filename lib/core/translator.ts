import { TextParser } from './parser'
import { validate, ValidateCallback, ValidateCallbackOutputs } from '../utils/validate'
import { ParserError } from '../utils/error'

export type TranslatorParams<
    S extends ValidateCallback<any>,
    O extends ValidateCallback<any>
> = {
    /**
     * @zh 輸入的資料格式。
     * @en The input data format.
     */
    input: S
    /**
     * @zh 輸出的資料格式。
     * @en The output data format. 
     */
    output: O
    /**
     * @zh 註冊解讀文字的解析器。
     * @en Register the parser to interpret the text.
     */
    parsers: TextParser[]
    /**
     * @zh 組合輸入資料成為提示文字。
     * @en Combine the input data into a prompt.
     */
    question: (data: ValidateCallbackOutputs<S>, context: {
        schema: {
            input: S
            output: O
        }
    }) => Promise<string | string[]>
}

export class Translator<
    S extends ValidateCallback<any>,
    O extends ValidateCallback<any>
> {
    private params: TranslatorParams<S, O>

    constructor(params: TranslatorParams<S, O>) {
        this.params = params
    }

    get __schemeType(): ValidateCallbackOutputs<S> {
        return null as any
    }
    get __outputType(): ValidateCallbackOutputs<O> {
        return null as any
    }

    /**
     * @zh 組合輸入資料成為提示文字。
     * @en Combine the input data into a prompt.
     */

    async compile(data: ValidateCallbackOutputs<S>, context: {
        schema: {
            input: S
            output: O
        }
    }) {
        const scheme = validate(data, this.params.input)
        const prompt = await this.params.question(scheme, context)
        return {
            scheme,
            prompt: Array.isArray(prompt) ? prompt.join('\n') : prompt
        }
    }

    getValidate() {
        return {
            input: this.params.input,
            output: this.params.output
        }
    }

    /**
     * @zh 將文字轉換成序列化資料。
     * @en Convert text to serialized data.
     */

    async parse(text: string) {
        let result: any = undefined
        let parserName = ''
        let parserFails: { name: string, error: any }[] = []
        for (let parse of this.params.parsers) {
            try {
                result = await parse.read(text)
                parserName = parse.name
            } catch (error) {
                result = undefined
                parserFails.push({
                    name: parse.name,
                    error
                })
            }
        }
        try {
            let output = validate(result, this.params.output)
            return {
                output,
                parserName,
                parserFails
            }
        } catch (error) {
            throw new ParserError(error, parserFails)
        }
    }
}
