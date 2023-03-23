import { ValidateCallback, ValidateCallbackOutputs } from '../utils/validate';
export declare type TranslatorParams<S extends ValidateCallback<any>, O extends ValidateCallback<any>> = {
    scheme: S;
    output: O;
    assembly: (data: ValidateCallbackOutputs<S>) => Promise<string>;
};
export declare class Translator<S extends ValidateCallback<any>, O extends ValidateCallback<any>> {
    private params;
    private parsers;
    constructor(params: TranslatorParams<S, O>);
    get __schemeType(): ValidateCallbackOutputs<S>;
    get __outputType(): ValidateCallbackOutputs<O>;
    compile(data: ValidateCallbackOutputs<S>): Promise<{
        scheme: ReturnType<S> extends infer T ? { [K in keyof T]: ReturnType<S>[K] extends import("yup").Schema<any, any, any, ""> ? ReturnType<S>[K]["__outputType"] : unknown; } : never;
        prompt: string;
    }>;
    parse(text: string): Promise<{
        output: ReturnType<O> extends infer T ? { [K in keyof T]: ReturnType<O>[K] extends import("yup").Schema<any, any, any, ""> ? ReturnType<O>[K]["__outputType"] : unknown; } : never;
        parserName: string;
        parserFails: {
            name: string;
            error: any;
        }[];
    }>;
}
