import { Log, Hook } from 'power-helper';
import { ChatGPT3 } from '../service/chatgpt3';
import { ChatGPT35 } from '../service/chatgpt35';
import { ChatGPT3Broker } from '../broker/3';
import { ChatGPT35Broker } from '../broker/35';
import { Translator } from './translator';
import { ValidateCallback, ValidateCallbackOutputs } from '../utils/validate';
declare type Broker3Hooks = ChatGPT3Broker<any, any, any, any>['__hookType'];
declare type Broker3PluginParams<T extends ValidateCallback<any>, R extends ValidateCallback<any>> = {
    name: string;
    params: T;
    receiveData: R;
    onInstall: (context: {
        bot: ChatGPT3;
        log: Log;
        params: ValidateCallbackOutputs<T>;
        attach: Hook<Broker3Hooks>['attach'];
        attachAfter: Hook<Broker3Hooks>['attachAfter'];
        translator: Translator<any, any>;
        receive: (callback: (params: {
            id: string;
            data: ValidateCallbackOutputs<R>;
        }) => void) => void;
    }) => void;
};
export declare class Broker3Plugin<T extends ValidateCallback<any>, R extends ValidateCallback<any>> {
    _event: import("power-helper/dist/modules/event").Event<Record<string, Record<string, any>>>;
    _params: Broker3PluginParams<T, R>;
    constructor(params: Broker3PluginParams<T, R>);
    use(params: ValidateCallbackOutputs<T>): {
        instance: any;
        params: ValidateCallbackOutputs<T, ReturnType<T>>;
        send: (data: ValidateCallbackOutputs<R>) => void;
        receive: (callback: any) => void;
        __receiveData: ValidateCallbackOutputs<R, ReturnType<R>>;
    };
}
declare type Broker35Hooks = ChatGPT35Broker<any, any, any, any>['__hookType'];
declare type Broker35PluginParams<T extends ValidateCallback<any>, R extends ValidateCallback<any>> = {
    name: string;
    params: T;
    receiveData: R;
    onInstall: (context: {
        bot: ChatGPT35;
        log: Log;
        params: ValidateCallbackOutputs<T>;
        attach: Hook<Broker35Hooks>['attach'];
        attachAfter: Hook<Broker35Hooks>['attachAfter'];
        translator: Translator<any, any>;
        receive: (callback: (params: {
            id: string;
            data: ValidateCallbackOutputs<R>;
        }) => void) => void;
    }) => void;
};
export declare class Broker35Plugin<T extends ValidateCallback<any>, R extends ValidateCallback<any>> {
    _event: import("power-helper/dist/modules/event").Event<Record<string, Record<string, any>>>;
    _params: Broker35PluginParams<T, R>;
    constructor(params: Broker35PluginParams<T, R>);
    use(params: ValidateCallbackOutputs<T>): {
        instance: any;
        params: ValidateCallbackOutputs<T, ReturnType<T>>;
        send: (data: ValidateCallbackOutputs<R>) => void;
        receive: (callback: any) => void;
        __receiveData: ValidateCallbackOutputs<R, ReturnType<R>>;
    };
}
export {};
