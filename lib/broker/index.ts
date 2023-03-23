import { Hook } from 'power-helper'
import { ChatGPT3 } from '../service/chatgpt3'
import { ChatGPT35 } from '../service/chatgpt35'
import { ValidateCallback } from '../utils/validate'
import { Translator, TranslatorParams } from '../core/translator'

export type Params<
    S extends ValidateCallback<any>,
    O extends ValidateCallback<any>,
    C extends Record<string, any>
> = TranslatorParams<S, O> & {
    install: (context: {
        bot: ChatGPT3 | ChatGPT35
        attach: Hook<C>['attach']
        translator: Translator<S, O>
    }) => void
}

export class BaseBroker<
    S extends ValidateCallback<any>,
    O extends ValidateCallback<any>,
    C extends Record<string, any>
> extends Hook<C> {
    protected bot!: ChatGPT3 | ChatGPT35
    protected params: Params<S, O, C>
    protected installed = false
    protected translator: Translator<S, O>

    constructor(params: Params<S, O, C>) {
        super()
        this.params = params
        this.translator = new Translator(params)
    }

    protected _install(): any {
        if (this.installed === false) {
            this.installed = true
            if (this.bot) {
                this.params.install({
                    bot: this.bot,
                    attach: this.attach.bind(this),
                    translator: this.translator
                })
            }
        }
    }

    protected request(_data: any): any {
        throw Error('DON\'T CALL THIS!')
    }
}
