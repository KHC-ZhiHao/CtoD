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

        /**
         * @zh 第一次聊天的時候觸發
         * @en Triggered when chatting for the first time
         */

        talkFirst: {
            id: string
            data: ValidateCallbackOutputs<S>
            messages: ChatGPT35Message[]
            changeMessages: (messages: ChatGPT35Message[]) => void
        }

        /**
         * @zh 發送聊天訊息給機器人前觸發
         * @en Triggered before sending chat message to bot
         */

        talkBefore: {
            id: string
            data: ValidateCallbackOutputs<S>
            messages: ChatGPT35Message[]
            lastUserMessage: string
        }

        /**
         * @zh 當聊天機器人回傳資料的時候觸發
         * @en Triggered when the chatbot returns data
         */

        talkAfter: {
            id: string
            data: ValidateCallbackOutputs<S>
            response: ChatGPT35TalkResponse
            messages: ChatGPT35Message[]
            parseText: string
            lastUserMessage: string
            changeParseText: (text: string) => void
        }

        /**
         * @zh 當回傳資料符合規格時觸發
         * @en Triggered when the returned data meets the specifications
         */

        succeeded: {
            id: string
            output: ValidateCallbackOutputs<O>
        }
    
        /**
         * @zh 當回傳資料不符合規格，或是解析錯誤時觸發
         * @en Triggered when the returned data does not meet the specifications or parsing errors
         */

        parseFailed: {
            id: string
            error: any
            retry: () => void
            count: number
            response: ChatGPT35TalkResponse
            parserFails: { name: string, error: any }[]
            messages: ChatGPT35Message[]
            lastUserMessage: string
            changeMessages: (messages: ChatGPT35Message[]) => void
        }

        /**
         * @zh 不論成功失敗，執行結束的時候會執行。
         * @en It will be executed when the execution is completed, regardless of success or failure.
         */

        done: {
            id: string
        }
    }> {
    bot: ChatGPT35 = new ChatGPT35()

    /**
     * @zh 將請求發出至聊天機器人。
     * @en Send request to chatbot.
     */

    async request<T extends Translator<S, O>>(data: T['__schemeType']): Promise<T['__outputType']> {
        this._install()
        let id = flow.createUuid()
        let output: any = null
        let question = await this.translator.compile(data)
        let messages: ChatGPT35Message[] = [
            {
                role: 'user',
                content: question.prompt
            }
        ]
        await this.hook.notify('talkFirst', {
            id,
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
                    id,
                    data,
                    messages,
                    lastUserMessage
                })
                response = await this.bot.talk(messages)
                parseText = response.text
                await this.hook.notify('talkAfter', {
                    id,
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
                    id,
                    output
                })
                await this.hook.notify('done', { id })
                doBreak()
            } catch (error: any) {
                // 如果解析錯誤，可以選擇是否重新解讀
                if (error.isParserError) {
                    await this.hook.notify('parseFailed', {
                        id,
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
                await this.hook.notify('done', { id })
                throw error
            }
        })
        return output
    }
}
