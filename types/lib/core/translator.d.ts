import { TextParser } from './parser';
import { ValidateCallback, ValidateCallbackOutputs } from '../utils/validate';
export declare type TranslatorParams<S extends ValidateCallback<any>, O extends ValidateCallback<any>> = {
    /**
     * @zh 輸入的資料格式。
     * @en The input data format.
     */
    input: S;
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
    assembly: (data: ValidateCallbackOutputs<S>) => Promise<string>;
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
    compile(data: ValidateCallbackOutputs<S>): Promise<{
        scheme: ReturnType<S> extends infer T ? { [K in keyof T]: ReturnType<S>[K] extends {
            __outputType: any;
        } ? ReturnType<S>[K]["__outputType"] : unknown; } : never;
        prompt: string;
    }>;
    /**
     * @zh 將文字轉換成序列化資量。
     * @en Convert text to serialized data.
     */
    parse(text: string): Promise<{
        output: ReturnType<O> extends infer T ? { [K in keyof T]: ReturnType<O>[K] extends {
            __outputType: any;
        } ? ReturnType<O>[K]["__outputType"] : unknown; } : never;
        parserName: string;
        parserFails: {
            name: string;
            error: any;
        }[];
    }>;
}
