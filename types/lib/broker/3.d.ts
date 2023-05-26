import { Translator } from '../core/translator';
import { BaseBroker } from './index';
import { Broker3Plugin } from '../core/plugin';
import { ChatGPT3, ChatGPT3TalkResponse } from '../service/chatgpt3';
import { ValidateCallback, ValidateCallbackOutputs } from '../utils/validate';
export declare class ChatGPT3Broker<S extends ValidateCallback<any>, O extends ValidateCallback<any>, P extends Broker3Plugin<any, any>, PS extends Record<string, ReturnType<P['use']>>> extends BaseBroker<S, O, P, PS, {
    /**
     * @zh 發送聊天訊息給機器人前觸發
     * @en Triggered before sending chat message to bot
     */
    talkBefore: {
        id: string;
        data: ValidateCallbackOutputs<S>;
        prompt: string;
        plugins: {
            [K in keyof PS]: {
                send: (data: PS[K]['__receiveData']) => void;
            };
        };
    };
    /**
     * @zh 當聊天機器人回傳資料的時候觸發
     * @en Triggered when the chatbot returns data
     */
    talkAfter: {
        id: string;
        data: ValidateCallbackOutputs<S>;
        prompt: string;
        response: ChatGPT3TalkResponse;
        parseText: string;
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
        count: number;
        retry: () => void;
        response: ChatGPT3TalkResponse;
        parserFails: {
            name: string;
            error: any;
        }[];
        changePrompt: (text: string) => void;
    };
    /**
     * @zh 不論成功失敗，執行結束的時候會執行。
     * @en It will be executed when the execution is completed, regardless of success or failure.
     */
    done: {
        id: string;
    };
}> {
    bot: ChatGPT3;
    /**
     * @zh 將請求發出至聊天機器人。
     * @en Send request to chatbot.
     */
    request<T extends Translator<S, O>>(data: T['__schemeType']): Promise<T['__outputType']>;
}
