import { ChatBrokerPlugin } from '../core/plugin';
import { Event, Hook, Log } from 'power-helper';
import { Translator, TranslatorParams } from '../core/translator';
import { ValidateCallback, ValidateCallbackOutputs } from '../utils/validate';
type Message = {
    role: 'system' | 'user' | 'assistant';
    name?: string;
    content: string;
};
export type ChatBrokerHooks<S extends ValidateCallback<any>, O extends ValidateCallback<any>, P extends ChatBrokerPlugin<any, any>, PS extends Record<string, ReturnType<P['use']>>> = {
    /**
     * @zh 第一次聊天的時候觸發
     * @en Triggered when chatting for the first time
     */
    start: {
        id: string;
        data: ValidateCallbackOutputs<S>;
        plugins: {
            [K in keyof PS]: {
                send: (data: PS[K]['__receiveData']) => void;
            };
        };
        schema: {
            input: S;
            output: O;
        };
        messages: Message[];
        setPreMessages: (messages: Message[]) => void;
        changeMessages: (messages: Message[]) => void;
    };
    /**
     * @zh 發送聊天訊息給機器人前觸發
     * @en Triggered before sending chat message to bot
     */
    talkBefore: {
        id: string;
        data: ValidateCallbackOutputs<S>;
        messages: Message[];
        lastUserMessage: string;
    };
    /**
     * @zh 當聊天機器人回傳資料的時候觸發
     * @en Triggered when the chatbot returns data
     */
    talkAfter: {
        id: string;
        data: ValidateCallbackOutputs<S>;
        response: any;
        messages: Message[];
        parseText: string;
        lastUserMessage: string;
        /**
         * @zh 宣告解析失敗
         * @en Declare parsing failure
         */
        parseFail: (error: any) => void;
        changeParseText: (text: string) => void;
    };
    /**
     * @zh 當回傳資料符合規格時觸發
     * @en Triggered when the returned data meets the specifications
     */
    succeeded: {
        id: string;
        output: ValidateCallbackOutputs<O>;
    };
    /**
     * @zh 當回傳資料不符合規格，或是解析錯誤時觸發
     * @en Triggered when the returned data does not meet the specifications or parsing errors
     */
    parseFailed: {
        id: string;
        error: any;
        retry: () => void;
        count: number;
        response: any;
        parserFails: {
            name: string;
            error: any;
        }[];
        messages: Message[];
        lastUserMessage: string;
        changeMessages: (messages: Message[]) => void;
    };
    /**
     * @zh 不論成功失敗，執行結束的時候會執行。
     * @en It will be executed when the execution is completed, regardless of success or failure.
     */
    done: {
        id: string;
    };
};
type RequestContext = {
    count: number;
    isRetry: boolean;
    onCancel: (cb: () => void) => void;
    schema: {
        input: any;
        output: any;
    };
};
export type Params<S extends ValidateCallback<any>, O extends ValidateCallback<any>, C extends Record<string, any>, P extends ChatBrokerPlugin<any, any>, PS extends Record<string, ReturnType<P['use']>>> = Omit<TranslatorParams<S, O>, 'parsers'> & {
    name?: string;
    plugins?: PS | (() => PS);
    request: (messages: Message[], context: RequestContext) => Promise<string>;
    install?: (context: {
        log: Log;
        attach: Hook<C>['attach'];
        attachAfter: Hook<C>['attachAfter'];
        translator: Translator<S, O>;
    }) => void;
};
export declare class ChatBroker<S extends ValidateCallback<any>, O extends ValidateCallback<any>, P extends ChatBrokerPlugin<any, any>, PS extends Record<string, ReturnType<P['use']>>, C extends ChatBrokerHooks<S, O, P, PS> = ChatBrokerHooks<S, O, P, PS>> {
    protected __hookType: C;
    protected log: Log;
    protected hook: Hook<C>;
    protected params: Params<S, O, C, P, PS>;
    protected plugins: PS;
    protected installed: boolean;
    protected translator: Translator<S, O>;
    protected event: Event<{
        cancel: {
            requestId: string;
        };
        cancelAll: any;
    }>;
    constructor(params: Params<S, O, C, P, PS>);
    protected _install(): any;
    cancel(requestId?: string): Promise<void>;
    requestWithId<T extends Translator<S, O>>(data: T['__schemeType']): {
        id: string;
        request: Promise<T['__outputType']>;
    };
    /**
     * @zh 將請求發出至聊天機器人。
     * @en Send request to chatbot.
     */
    request<T extends Translator<S, O>>(data: T['__schemeType']): Promise<T['__outputType']>;
}
export {};
