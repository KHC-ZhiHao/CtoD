import { Translator } from './translator.js';
import { ChatBrokerHooks } from '../broker/chat.js';
import { Log, Hook, Event } from 'power-helper';
import { ValidateCallback, ValidateCallbackOutputs } from '../utils/validate.js';
type BrokerHooks = ChatBrokerHooks<any, any, any, any>;
type BrokerPluginParams<T extends ValidateCallback<any>, R extends ValidateCallback<any>> = {
    name: string;
    params: T;
    receiveData: R;
    onInstall: (context: {
        log: Log;
        params: ValidateCallbackOutputs<T>;
        attach: Hook<BrokerHooks>['attach'];
        attachAfter: Hook<BrokerHooks>['attachAfter'];
        translator: Translator<any, any>;
        receive: (callback: (params: {
            id: string;
            data: ValidateCallbackOutputs<R>;
        }) => void) => void;
    }) => void;
};
export declare class ChatBrokerPlugin<T extends ValidateCallback<any>, R extends ValidateCallback<any>> {
    _event: Event<Record<string, Record<string, any>>>;
    _params: BrokerPluginParams<T, R>;
    constructor(params: BrokerPluginParams<T, R>);
    use(params: ValidateCallbackOutputs<T>): {
        instance: any;
        params: ValidateCallbackOutputs<T, ReturnType<T>>;
        send: (data: ValidateCallbackOutputs<R>) => void;
        receive: (callback: any) => void;
        __receiveData: ValidateCallbackOutputs<R>;
    };
}
export {};
