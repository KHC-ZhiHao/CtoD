import { flow } from 'power-helper'
import { BaseBroker } from './index'
import { Translator } from '../core/translator'
import { Broker35Plugin } from '../core/plugin'
import { ValidateCallback, ValidateCallbackOutputs } from '../utils/validate'
import { ChatGPT35, ChatGPT35Message, ChatGPT35TalkResponse } from '../service/chatgpt35'

export class ChatGPT35Broker<
    S extends ValidateCallback<any>,
    O extends ValidateCallback<any>
    > extends BaseBroker<S, O, Broker35Plugin<any>, {
        talkFirst: {
            data: ValidateCallbackOutputs<S>
            messages: ChatGPT35Message[]
            changeMessages: (messages: ChatGPT35Message[]) => void
        }
        talkBefore: {
            data: ValidateCallbackOutputs<S>
            messages: ChatGPT35Message[]
            lastUserMessage: string
        }
        talkAfter: {
            data: ValidateCallbackOutputs<S>
            response: ChatGPT35TalkResponse
            messages: ChatGPT35Message[]
            parseText: string
            lastUserMessage: string
            changeParseText: (text: string) => void
        }
        succeeded: {
            output: ValidateCallbackOutputs<O>
        }
        parseFailed: {
            error: any
            retry: () => void
            count: number
            response: ChatGPT35TalkResponse
            parserFails: { name: string, error: any }[]
            messages: ChatGPT35Message[]
            lastUserMessage: string
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
        await this.hook.notify('talkFirst', {
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
            let response: ChatGPT35TalkResponse = null as any
            let parseText = ''
            let retryFlag = false
            let lastUserMessage = messages.filter(e => e.role === 'user').slice(-1)[0]?.content || ''
            try {
                await this.hook.notify('talkBefore', {
                    data,
                    messages,
                    lastUserMessage
                })
                response = await this.bot.talk(messages)
                parseText = response.text
                await this.hook.notify('talkAfter', {
                    data,
                    response,
                    parseText,
                    messages: response.newMessages,
                    lastUserMessage,
                    changeParseText: text => {
                        parseText = text
                    }
                })
                messages = response.newMessages
                output = (await this.translator.parse(response.text)).output
                await this.hook.notify('succeeded', {
                    output
                })
                doBreak()
            } catch (error: any) {
                // 如果解析錯誤，可以選擇是否重新解讀
                if (error.isParserError) {
                    await this.hook.notify('parseFailed', {
                        error: error.error,
                        count,
                        response,
                        messages,
                        lastUserMessage,
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
