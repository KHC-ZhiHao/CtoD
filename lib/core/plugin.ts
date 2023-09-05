import { Translator } from './translator'
import { ChatBrokerHooks } from '../broker/chat'
import { Log, Hook, Event } from 'power-helper'
import { ValidateCallback, ValidateCallbackOutputs } from '../utils/validate'

type BrokerHooks = ChatBrokerHooks<any, any, any, any>
type BrokerPluginParams<
    T extends ValidateCallback<any>,
    R extends ValidateCallback<any>
> = {
    name: string
    params: T
    receiveData: R
    onInstall: (context: {
        log: Log
        params: ValidateCallbackOutputs<T>
        attach: Hook<BrokerHooks>['attach']
        attachAfter: Hook<BrokerHooks>['attachAfter']
        translator: Translator<any, any>
        receive: (callback: (params: {
            id: string
            data: ValidateCallbackOutputs<R>
        }) => void) => void
    }) => void
}

export class ChatBrokerPlugin<
    T extends ValidateCallback<any>,
    R extends ValidateCallback<any>
> {
    _event = new Event()
    _params: BrokerPluginParams<T, R>
    constructor(params: BrokerPluginParams<T, R>) {
        this._params = params
    }

    use(params: ValidateCallbackOutputs<T>) {
        return {
            instance: this as any,
            params,
            send: (data: ValidateCallbackOutputs<R>) => { this._event.emit('receive', data) },
            receive: (callback: any) => { this._event.on('receive', callback) },
            __receiveData: null as unknown as ValidateCallbackOutputs<R>
        }
    }
}
