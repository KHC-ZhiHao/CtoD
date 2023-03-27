import { BaseBroker } from './index';
import { Translator } from '../core/translator';
import { Broker35Plugin } from '../core/plugin';
import { ValidateCallback, ValidateCallbackOutputs } from '../utils/validate';
import { ChatGPT35, ChatGPT35Message, ChatGPT35TalkResponse } from '../service/chatgpt35';
export declare class ChatGPT35Broker<S extends ValidateCallback<any>, O extends ValidateCallback<any>> extends BaseBroker<S, O, Broker35Plugin<any>, {
    talkFirst: {
        data: ValidateCallbackOutputs<S>;
        messages: ChatGPT35Message[];
        changeMessages: (messages: ChatGPT35Message[]) => void;
    };
    talkBefore: {
        data: ValidateCallbackOutputs<S>;
        messages: ChatGPT35Message[];
        lastUserMessage: string;
    };
    talkAfter: {
        data: ValidateCallbackOutputs<S>;
        response: ChatGPT35TalkResponse;
        messages: ChatGPT35Message[];
        parseText: string;
        lastUserMessage: string;
        changeParseText: (text: string) => void;
    };
    succeeded: {
        output: ValidateCallbackOutputs<O>;
    };
    parseFailed: {
        error: any;
        retry: () => void;
        count: number;
        response: ChatGPT35TalkResponse;
        parserFails: {
            name: string;
            error: any;
        }[];
        messages: ChatGPT35Message[];
        lastUserMessage: string;
        changeMessages: (messages: ChatGPT35Message[]) => void;
    };
}> {
    bot: ChatGPT35;
    request<T extends Translator<S, O>>(data: T['__schemeType']): Promise<T['__outputType']>;
}
