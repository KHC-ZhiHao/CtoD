import { Hook } from 'power-helper'
import { ChatGPT3 } from '../service/chatgpt3'
import { ChatGPT35 } from '../service/chatgpt35'
import { TextParser } from '../core/parser'
import { ValidateCallback } from '../utils/validate'
import { Translator, TranslatorParams } from '../core/translator'
import { Broker3Plugin, Broker35Plugin } from '../core/plugin'

export type Params<
    S extends ValidateCallback<any>,
    O extends ValidateCallback<any>,
    C extends Record<string, any>,
    P extends Broker3Plugin<any> | Broker35Plugin<any>
> = Omit<TranslatorParams<S, O>, 'parsers'> & {
    plugins?: ReturnType<P['use']>[]
    install: (context: {
        bot: ChatGPT3 | ChatGPT35
        attach: Hook<C>['attach']
        attachAfter: Hook<C>['attachAfter']
        translator: Translator<S, O>
    }) => void
}

export class BaseBroker<
    S extends ValidateCallback<any>,
    O extends ValidateCallback<any>,
    P extends Broker3Plugin<any> | Broker35Plugin<any>,
    C extends Record<string, any>
> {
    protected hook = new Hook<C>()
    protected bot!: ChatGPT3 | ChatGPT35
    protected params: Params<S, O, C, P>
    protected installed = false
    protected translator: Translator<S, O>
    protected __hookType!: C

    constructor(params: Params<S, O, C, P>) {
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
                    attach: this.hook.attach.bind(this.hook),
                    attachAfter: this.hook.attachAfter.bind(this.hook),
                    translator: this.translator
                }
                if (this.params.plugins) {
                    for (let plugin of this.params.plugins) {
                        plugin.instance._params.onInstall({
                            ...context as any,
                            params: plugin.params
                        })
                    }
                }
                this.params.install(context)
            }
        }
    }

    protected request(_data: any): any {
        throw Error('DON\'T CALL THIS!')
    }
}
