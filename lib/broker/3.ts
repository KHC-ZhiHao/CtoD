import { flow } from 'power-helper'
import { Translator } from '../core/translator'
import { BaseBroker } from './index'
import { ChatGPT3, ChatGPT3TalkResponse } from '../service/chatgpt3'
import { ValidateCallback, ValidateCallbackOutputs } from '../utils/validate'

export class ChatGPT3Broker<
    S extends ValidateCallback<any>,
    O extends ValidateCallback<any>,
    > extends BaseBroker<S, O, {
        talkBefore: {
            data: ValidateCallbackOutputs<S>
            prompt: string
        }
        talkAfter: {
            data: ValidateCallbackOutputs<S>
            prompt: string
            response: ChatGPT3TalkResponse
            parseText: string
            changeParseText: (text: string) => void
        }
        parseFailed: {
            error: any
            count: number
            retry: () => void
            response: ChatGPT3TalkResponse
            parserFails: { name: string, error: any }[]
            changePrompt: (text: string) => void
        }
    }> {

    bot: ChatGPT3 = new ChatGPT3()

    async request<T extends Translator<S, O>>(data: T['__schemeType']): Promise<T['__outputType']> {
        this._install()
        let output: any = null
        let question = await this.translator.compile(data)
        await flow.asyncWhile(async ({ count, doBreak }) => {
            if (count >= 10) {
                return doBreak()
            }
            let parseText = ''
            let retryFlag = false
            let response: ChatGPT3TalkResponse = {
                id: '',
                isDone: false,
                text: ''
            }
            try {
                await this.notify('talkBefore', {
                    data,
                    prompt: question.prompt
                })
                response = await this.bot.talk(question.prompt)
                parseText = response.text
                await this.notify('talkAfter', {
                    data,
                    prompt: question.prompt,
                    response,
                    parseText,
                    changeParseText: text => {
                        parseText = text
                    }
                })
                output = (await this.translator.parse(parseText)).output
                doBreak()
            } catch (error: any) {
                // 如果解析錯誤，可以選擇是否重新解讀
                if (error.isParserError) {
                    await this.notify('parseFailed', {
                        error: error.error,
                        count,
                        response,
                        parserFails: error.parserFails,
                        retry: () => {
                            retryFlag = true
                        },
                        changePrompt: (text) => {
                            question.prompt = text
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
