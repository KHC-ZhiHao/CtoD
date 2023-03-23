import { Hook } from 'power-helper';
import { ChatGPT3 } from '../service/chatgpt3';
import { ChatGPT35 } from '../service/chatgpt35';
import { ValidateCallback } from '../utils/validate';
import { Translator, TranslatorParams } from '../core/translator';
export declare type Params<S extends ValidateCallback<any>, O extends ValidateCallback<any>, C extends Record<string, any>> = TranslatorParams<S, O> & {
    install: (context: {
        bot: ChatGPT3 | ChatGPT35;
        attach: Hook<C>['attach'];
        translator: Translator<S, O>;
    }) => void;
};
export declare class BaseBroker<S extends ValidateCallback<any>, O extends ValidateCallback<any>, C extends Record<string, any>> extends Hook<C> {
    protected bot: ChatGPT3 | ChatGPT35;
    protected params: Params<S, O, C>;
    protected installed: boolean;
    protected translator: Translator<S, O>;
    constructor(params: Params<S, O, C>);
    protected _install(): any;
    protected request(_data: any): any;
}
