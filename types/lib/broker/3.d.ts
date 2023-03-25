import { Translator } from '../core/translator';
import { BaseBroker } from './index';
import { ChatGPT3, ChatGPT3TalkResponse } from '../service/chatgpt3';
import { ValidateCallback, ValidateCallbackOutputs } from '../utils/validate';
export declare class ChatGPT3Broker<S extends ValidateCallback<any>, O extends ValidateCallback<any>> extends BaseBroker<S, O, {
    talkBefore: {
        data: ValidateCallbackOutputs<S>;
        prompt: string;
    };
    talkAfter: {
        data: ValidateCallbackOutputs<S>;
        prompt: string;
        response: ChatGPT3TalkResponse;
        parseText: string;
        changeParseText: (text: string) => void;
    };
    parseFailed: {
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
}> {
    bot: ChatGPT3;
    request<T extends Translator<S, O>>(data: T['__schemeType']): Promise<T['__outputType']>;
}
