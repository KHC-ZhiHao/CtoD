import { Hook } from 'power-helper';
import { ChatGPT3 } from '../service/chatgpt3';
import { ChatGPT35 } from '../service/chatgpt35';
import { ChatGPT3Broker } from '../broker/3';
import { ChatGPT35Broker } from '../broker/35';
import { Translator } from './translator';
import { ValidateCallback, ValidateCallbackOutputs } from '../utils/validate';
declare type Broker3Hooks = ChatGPT3Broker<any, any>['__hookType'];
declare type Broker3PluginParams<T extends ValidateCallback<any>> = {
    name: string;
    params: T;
    onInstall: (context: {
        bot: ChatGPT3;
        params: ValidateCallbackOutputs<T>;
        attach: Hook<Broker3Hooks>['attach'];
        attachAfter: Hook<Broker3Hooks>['attachAfter'];
        translator: Translator<any, any>;
    }) => void;
};
export declare class Broker3Plugin<T extends ValidateCallback<any>> {
    _params: Broker3PluginParams<T>;
    constructor(params: Broker3PluginParams<T>);
    use(params: ValidateCallbackOutputs<T>): {
        instance: any;
        params: ValidateCallbackOutputs<T, ReturnType<T>>;
    };
}
declare type Broker35Hooks = ChatGPT35Broker<any, any>['__hookType'];
declare type Broker35PluginParams<T extends ValidateCallback<any>> = {
    name: string;
    params: T;
    onInstall: (context: {
        bot: ChatGPT35;
        params: ValidateCallbackOutputs<T>;
        attach: Hook<Broker35Hooks>['attach'];
        attachAfter: Hook<Broker35Hooks>['attachAfter'];
        translator: Translator<any, any>;
    }) => void;
};
export declare class Broker35Plugin<T extends ValidateCallback<any>> {
    _params: Broker35PluginParams<T>;
    constructor(params: Broker35PluginParams<T>);
    use(params: ValidateCallbackOutputs<T>): {
        instance: any;
        params: ValidateCallbackOutputs<T, ReturnType<T>>;
    };
}
export {};
