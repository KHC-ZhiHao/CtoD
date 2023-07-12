import { Hook, Log } from 'power-helper'
import { ChatGPT3 } from '../service/chatgpt3'
import { ChatGPT35 } from '../service/chatgpt35'
import { ChatGPT4 } from '../service/chatgpt4'
import { TextParser } from '../core/parser'
import { ValidateCallback } from '../utils/validate'
import { Translator, TranslatorParams } from '../core/translator'
import { Broker3Plugin, Broker35Plugin, Broker4Plugin } from '../core/plugin'

export type Params<
    B extends ChatGPT3 | ChatGPT35 | ChatGPT4,
    S extends ValidateCallback<any>,
    O extends ValidateCallback<any>,
    C extends Record<string, any>,
    P extends Broker3Plugin<any, any> | Broker35Plugin<any, any> | Broker4Plugin<any, any>,
    PS extends Record<string, ReturnType<P['use']>>
> = Omit<TranslatorParams<S, O>, 'parsers'> & {
    name?: string
    plugins?: PS | (() => PS)
    install: (context: {
        log: Log
        bot: B
        attach: Hook<C>['attach']
        attachAfter: Hook<C>['attachAfter']
        translator: Translator<S, O>
    }) => void
}

export class BaseBroker<
    B extends ChatGPT3 | ChatGPT35 | ChatGPT4,
    S extends ValidateCallback<any>,
    O extends ValidateCallback<any>,
    P extends Broker3Plugin<any, any> | Broker35Plugin<any, any> | Broker4Plugin<any, any>,
    PS extends Record<string, ReturnType<P['use']>>,
    C extends Record<string, any>
> {
    protected __hookType!: C
    protected log: Log
    protected hook = new Hook<C>()
    protected bot!: B
    protected params: Params<B, S, O, C, P, PS>
    protected plugins = {} as PS
    protected installed = false
    protected translator: Translator<S, O>

    constructor(params: Params<B, S, O, C, P, PS>) {
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
            if (this.bot) {
                const context = {
                    bot: this.bot,
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
    }

    protected request(_data: any): any {
        throw Error('DON\'T CALL THIS!')
    }
}
