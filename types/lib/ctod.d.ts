import { ChatBroker, Message, Params as ChatBrokerParams, ChatBrokerHooks, RequestContext } from './broker/chat';
import { ChatBrokerPlugin } from './core/plugin';
import { Schema } from 'yup';
import * as Yup from 'yup';
type IO = any;
export declare class CtoD<P extends ChatBrokerPlugin<IO, IO>, PS extends Record<string, ReturnType<P['use']>>> {
    params: {
        request: (messages: Message[], context: RequestContext) => Promise<string>;
        plugins?: (() => PS) | undefined;
    };
    constructor(params: {
        request: (messages: Message[], context: RequestContext) => Promise<string>;
        plugins?: () => PS;
    });
    createBrokerBuilder<I extends Record<string, any>>(params?: {
        install?: ChatBrokerParams<() => I, IO, ChatBrokerHooks<() => I, IO, P, PS>, P, PS>['install'];
    }): {
        create: <O extends Record<string, Schema<any, any, any, "">>>(install: (context: {
            id: string;
            yup: typeof Yup;
            data: I;
            plugins: { [K in keyof PS]: {
                send: (data: PS[K]["__receiveData"]) => void;
            }; };
            setMessages: (messages: (Omit<Message, 'content'> & {
                content: string | string[];
            })[]) => void;
            metadata: Map<string, any>;
        }) => Promise<O>) => ChatBroker<() => I, () => O, P, PS, ChatBrokerHooks<() => I, () => O, P, PS>>;
    };
}
export {};
