import { flow } from 'power-helper'
import { BaseBroker } from './index'
import { Translator } from '../core/translator'
import { ValidateCallback, ValidateCallbackOutputs } from '../utils/validate'
import { ChatGPT35, ChatGPT35Message, ChatGPT35TalkResponse } from '../service/chatgpt35'

export class ChatGPT35Broker<
    S extends ValidateCallback<any>,
    O extends ValidateCallback<any>
    > extends BaseBroker<S, O, {
        talkFirst: {
            data: ValidateCallbackOutputs<S>
            messages: ChatGPT35Message[]
            changeMessages: (messages: ChatGPT35Message[]) => void
        }
        talkBefore: {
            data: ValidateCallbackOutputs<S>
            messages: ChatGPT35Message[]
        }
        talkAfter: {
            data: ValidateCallbackOutputs<S>
            response: ChatGPT35TalkResponse
            messages: ChatGPT35Message[]
            parseText: string
            changeParseText: (text: string) => void
        }
        parseFailed: {
            error: any
            retry: () => void
            count: number
            response: ChatGPT35TalkResponse
            parserFails: { name: string, error: any }[]
            messages: ChatGPT35Message[]
            changeMessages: (messages: ChatGPT35Message[]) => void
        }
    }> {
    bot: ChatGPT35 = new ChatGPT35()

    async request<T extends Translator<S, O>>(data: T['__schemeType']): Promise<T['__outputType']> {
        this._install()
        let output: any = null
        let question = await this.translator.compile(data)
        let messages: ChatGPT35Message[] = [
            {
                role: 'user',
                content: question.prompt
            }
        ]
        await this.notify('talkFirst', {
            data,
            messages,
            changeMessages: ms => {
                messages = ms
            }
        })
        await flow.asyncWhile(async ({ count, doBreak }) => {
            if (count >= 10) {
                return doBreak()
            }
            let parseText = ''
            let retryFlag = false
            let response: ChatGPT35TalkResponse = {
                id: '',
                isDone: false,
                newMessages: [],
                text: ''
            }
            try {
                await this.notify('talkBefore', {
                    data,
                    messages
                })
                response = await this.bot.talk(messages)
                parseText = response.text
                await this.notify('talkAfter', {
                    data,
                    response,
                    parseText,
                    messages: response.newMessages,
                    changeParseText: text => {
                        parseText = text
                    }
                })
                messages = response.newMessages
                output = (await this.translator.parse(response.text)).output
                doBreak()
            } catch (error: any) {
                // 如果解析錯誤，可以選擇是否重新解讀
                if (error.isParserError) {
                    await this.notify('parseFailed', {
                        error: error.error,
                        count,
                        response,
                        messages,
                        parserFails: error.parserFails,
                        retry: () => {
                            retryFlag = true
                        },
                        changeMessages: ms => {
                            messages = ms
                        }
                    })
                    if (retryFlag === false) {
                        return doBreak()
                    }
                }
                throw error
            }
        })
        return output
    }
}
