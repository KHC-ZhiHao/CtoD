import { Hook, Log } from 'power-helper';
import { ChatGPT3 } from '../service/chatgpt3';
import { ChatGPT35 } from '../service/chatgpt35';
import { ValidateCallback } from '../utils/validate';
import { Translator, TranslatorParams } from '../core/translator';
import { Broker3Plugin, Broker35Plugin } from '../core/plugin';
export declare type Params<S extends ValidateCallback<any>, O extends ValidateCallback<any>, C extends Record<string, any>, P extends Broker3Plugin<any, any> | Broker35Plugin<any, any>, PS extends Record<string, ReturnType<P['use']>>> = Omit<TranslatorParams<S, O>, 'parsers'> & {
    name?: string;
    plugins?: PS | (() => PS);
    install: (context: {
        log: Log;
        bot: ChatGPT3 | ChatGPT35;
        attach: Hook<C>['attach'];
        attachAfter: Hook<C>['attachAfter'];
        translator: Translator<S, O>;
    }) => void;
};
export declare class BaseBroker<S extends ValidateCallback<any>, O extends ValidateCallback<any>, P extends Broker3Plugin<any, any> | Broker35Plugin<any, any>, PS extends Record<string, ReturnType<P['use']>>, C extends Record<string, any>> {
    protected __hookType: C;
    protected log: Log;
    protected hook: import("power-helper/dist/modules/hook").Hook<C>;
    protected bot: ChatGPT3 | ChatGPT35;
    protected params: Params<S, O, C, P, PS>;
    protected plugins: PS;
    protected installed: boolean;
    protected translator: Translator<S, O>;
    constructor(params: Params<S, O, C, P, PS>);
    protected _install(): any;
    protected request(_data: any): any;
}
