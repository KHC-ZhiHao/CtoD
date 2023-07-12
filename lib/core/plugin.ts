import { Log, Hook, Event } from 'power-helper'
import { ChatGPT3 } from '../service/chatgpt3'
import { ChatGPT35 } from '../service/chatgpt35'
import { ChatGPT3Broker } from '../broker/3'
import { ChatGPT35Broker } from '../broker/35'
import { Translator } from './translator'
import { ValidateCallback, ValidateCallbackOutputs } from '../utils/validate'

type Broker3Hooks = ChatGPT3Broker<any, any, any, any>['__hookType']
type Broker3PluginParams<
    T extends ValidateCallback<any>,
    R extends ValidateCallback<any>
> = {
    name: string
    params: T
    receiveData: R
    onInstall: (context: {
        bot: ChatGPT3
        log: Log
        params: ValidateCallbackOutputs<T>
        attach: Hook<Broker3Hooks>['attach']
        attachAfter: Hook<Broker3Hooks>['attachAfter']
        translator: Translator<any, any>
        receive: (callback: (params: {
            id: string
            data: ValidateCallbackOutputs<R>
        }) => void) => void
    }) => void
}

export class Broker3Plugin<
    T extends ValidateCallback<any>,
    R extends ValidateCallback<any>
> {
    _event = new Event()
    _params: Broker3PluginParams<T, R>
    constructor(params: Broker3PluginParams<T, R>) {
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

// 3.5

type Broker35Hooks = ChatGPT35Broker<any, any, any, any>['__hookType']
type Broker35PluginParams<
    T extends ValidateCallback<any>,
    R extends ValidateCallback<any>
> = {
    name: string
    params: T
    receiveData: R
    onInstall: (context: {
        bot: ChatGPT35
        log: Log
        params: ValidateCallbackOutputs<T>
        attach: Hook<Broker35Hooks>['attach']
        attachAfter: Hook<Broker35Hooks>['attachAfter']
        translator: Translator<any, any>
        receive: (callback: (params: {
            id: string
            data: ValidateCallbackOutputs<R>
        }) => void) => void
    }) => void
}

export class Broker35Plugin<
    T extends ValidateCallback<any>,
    R extends ValidateCallback<any>
> {
    _event = new Event()
    _params: Broker35PluginParams<T, R>
    constructor(params: Broker35PluginParams<T, R>) {
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

// 4

type Broker4Hooks = ChatGPT35Broker<any, any, any, any>['__hookType']
type Broker4PluginParams<
    T extends ValidateCallback<any>,
    R extends ValidateCallback<any>
> = {
    name: string
    params: T
    receiveData: R
    onInstall: (context: {
        bot: ChatGPT35
        log: Log
        params: ValidateCallbackOutputs<T>
        attach: Hook<Broker4Hooks>['attach']
        attachAfter: Hook<Broker4Hooks>['attachAfter']
        translator: Translator<any, any>
        receive: (callback: (params: {
            id: string
            data: ValidateCallbackOutputs<R>
        }) => void) => void
    }) => void
}

export class Broker4Plugin<
    T extends ValidateCallback<any>,
    R extends ValidateCallback<any>
> {
    _event = new Event()
    _params: Broker4PluginParams<T, R>
    constructor(params: Broker4PluginParams<T, R>) {
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
