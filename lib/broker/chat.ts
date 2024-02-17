import { TextParser } from '../core/parser'
import { ChatBrokerPlugin } from '../core/plugin'
import { flow, Hook, Log } from 'power-helper'
import { Translator, TranslatorParams } from '../core/translator'
import { ValidateCallback, ValidateCallbackOutputs } from '../utils/validate'

type Message = {
    role: 'system' | 'user' | 'assistant'
    name?: string
    content: string
}

export type ChatBrokerHooks<
    S extends ValidateCallback<any>,
    O extends ValidateCallback<any>,
    P extends ChatBrokerPlugin<any, any>,
    PS extends Record<string, ReturnType<P['use']>>
> = {

    /**
     * @zh 第一次聊天的時候觸發
     * @en Triggered when chatting for the first time
     */

    start: {
        id: string
        data: ValidateCallbackOutputs<S>
        plugins: {
            [K in keyof PS]: {
                send: (data: PS[K]['__receiveData']) => void
            }
        }
        messages: Message[]
        setPreMessages: (messages: Message[]) => void
        changeMessages: (messages: Message[]) => void
    }

    /**
     * @zh 發送聊天訊息給機器人前觸發
     * @en Triggered before sending chat message to bot
     */

    talkBefore: {
        id: string
        data: ValidateCallbackOutputs<S>
        messages: Message[]
        lastUserMessage: string
    }

    /**
     * @zh 當聊天機器人回傳資料的時候觸發
     * @en Triggered when the chatbot returns data
     */

    talkAfter: {
        id: string
        data: ValidateCallbackOutputs<S>
        response: any
        messages: Message[]
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
        response: any
        parserFails: { name: string, error: any }[]
        messages: Message[]
        lastUserMessage: string
        changeMessages: (messages: Message[]) => void
    }

    /**
     * @zh 不論成功失敗，執行結束的時候會執行。
     * @en It will be executed when the execution is completed, regardless of success or failure.
     */

    done: {
        id: string
    }
}

type RequestContext = {
    count: number
    isRetry: boolean
}

export type Params<
    S extends ValidateCallback<any>,
    O extends ValidateCallback<any>,
    C extends Record<string, any>,
    P extends ChatBrokerPlugin<any, any>,
    PS extends Record<string, ReturnType<P['use']>>
> = Omit<TranslatorParams<S, O>, 'parsers'> & {
    name?: string
    plugins?: PS | (() => PS)
    request: (messages: Message[], context: RequestContext) => Promise<string>
    install: (context: {
        log: Log
        attach: Hook<C>['attach']
        attachAfter: Hook<C>['attachAfter']
        translator: Translator<S, O>
    }) => void
}

export class ChatBroker<
    S extends ValidateCallback<any>,
    O extends ValidateCallback<any>,
    P extends ChatBrokerPlugin<any, any>,
    PS extends Record<string, ReturnType<P['use']>>,
    C extends ChatBrokerHooks<S, O, P, PS> = ChatBrokerHooks<S, O, P, PS>
> {
    protected __hookType!: C
    protected log: Log
    protected hook = new Hook<C>()
    protected params: Params<S, O, C, P, PS>
    protected plugins = {} as PS
    protected installed = false
    protected translator: Translator<S, O>

    constructor(params: Params<S, O, C, P, PS>) {
        this.log = new Log(params.name ?? 'no name')
        this.params = params
        this.translator = new Translator({
            ...params,
            parsers: [
                TextParser.JsonMessage()
            ]
        })
    }

    protected _install(): any {
        if (this.installed === false) {
            this.installed = true
            const context = {
                log: this.log,
                attach: this.hook.attach.bind(this.hook),
                attachAfter: this.hook.attachAfter.bind(this.hook),
                translator: this.translator
            }
            this.params.install(context)
            if (this.params.plugins) {
                this.plugins = typeof this.params.plugins === 'function' ? this.params.plugins() : this.params.plugins
                for (let key in this.plugins) {
                    this.plugins[key].instance._params.onInstall({
                        ...context,
                        params: this.plugins[key].params,
                        receive: this.plugins[key].receive
                    })
                }
            }
        }
    }

    /**
     * @zh 將請求發出至聊天機器人。
     * @en Send request to chatbot.
     */

    async request<T extends Translator<S, O>>(data: T['__schemeType']): Promise<T['__outputType']> {
        this._install()
        let id = flow.createUuid()
        let output: any = null
        let plugins = {} as any
        let question = await this.translator.compile(data)
        let messages: Message[] = [
            {
                role: 'user',
                content: question.prompt
            }
        ]
        for (let key in this.plugins) {
            plugins[key] = {
                send: (data: any) => this.plugins[key].send({
                    id,
                    data
                })
            }
        }
        await this.hook.notify('start', {
            id,
            data,
            plugins,
            messages,
            setPreMessages: ms => {
                messages = [
                    ...ms,
                    {
                        role: 'user',
                        content: question.prompt
                    }
                ]
            },
            changeMessages: ms => {
                messages = ms
            }
        })
        await flow.asyncWhile(async ({ count, doBreak }) => {
            if (count >= 10) {
                return doBreak()
            }
            let response = ''
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
                response = await this.params.request(messages, {
                    count,
                    isRetry: retryFlag
                })
                parseText = response
                await this.hook.notify('talkAfter', {
                    id,
                    data,
                    response,
                    messages,
                    parseText,
                    lastUserMessage,
                    changeParseText: text => {
                        parseText = text
                    }
                })
                output = (await this.translator.parse(parseText)).output
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
                        await this.hook.notify('done', { id })
                        throw error
                    }
                } else {
                    await this.hook.notify('done', { id })
                    throw error
                }
            }
        })
        return output
    }
}
