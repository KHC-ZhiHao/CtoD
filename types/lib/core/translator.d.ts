import { TextParser } from './parser.js';
import { ValidateCallback, ValidateCallbackOutputs } from '../utils/validate.js';
export type TranslatorParams<S extends ValidateCallback<any>, O extends ValidateCallback<any>> = {
    /**
     * @zh 輸入的資料格式。
     * @en The input data format.
     */
    input?: S;
    /**
     * @zh 輸出的資料格式。
     * @en The output data format.
     */
    output: O;
    /**
     * @zh 註冊解讀文字的解析器。
     * @en Register the parser to interpret the text.
     */
    parsers: TextParser[];
    /**
     * @zh 組合輸入資料成為提示文字。
     * @en Combine the input data into a prompt.
     */
    question?: (data: ValidateCallbackOutputs<S>, context: {
        schema: {
            input?: S;
            output: O;
        };
    }) => Promise<string | string[]>;
};
export declare class Translator<S extends ValidateCallback<any>, O extends ValidateCallback<any>> {
    private params;
    constructor(params: TranslatorParams<S, O>);
    get __schemeType(): ValidateCallbackOutputs<S>;
    get __outputType(): ValidateCallbackOutputs<O>;
    /**
     * @zh 組合輸入資料成為提示文字。
     * @en Combine the input data into a prompt.
     */
    compile(data: ValidateCallbackOutputs<S>, context: {
        schema: {
            input?: S;
            output: O;
        };
    }): Promise<{
        scheme: ValidateCallbackOutputs<S, ReturnType<S>>;
        prompt: string;
    }>;
    getValidate(): {
        input: S | undefined;
        output: O;
    };
    changeOutputSchema(schema: O): void;
    /**
     * @zh 將文字轉換成序列化資料。
     * @en Convert text to serialized data.
     */
    parse(text: string): Promise<{
        output: ReturnType<O> extends infer T ? { [K in keyof T]: T[K] extends import("zod").ZodType<unknown, unknown, import("zod/v4/core").$ZodTypeInternals<unknown, unknown>> ? import("zod").infer<T[K]> : T[K]; } : never;
        parserName: string;
        parserFails: {
            name: string;
            error: any;
        }[];
    }>;
}
