import { TextParser } from './parser'
import { validate, ValidateCallback, ValidateCallbackOutputs } from '../utils/validate'

export type TranslatorParams<
    S extends ValidateCallback<any>,
    O extends ValidateCallback<any>
> = {
    input: S
    output: O
    parsers: TextParser[]
    assembly: (data: ValidateCallbackOutputs<S>) => Promise<string>
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

    async compile(data: ValidateCallbackOutputs<S>) {
        const scheme = validate(data, this.params.input)
        const prompt = await this.params.assembly(scheme)
        return {
            scheme,
            prompt
        }
    }

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
            throw {
                isParserError: true,
                error,
                parserFails
            }
        }
    }
}
