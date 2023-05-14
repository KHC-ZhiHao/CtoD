/* eslint-disable no-redeclare */

import * as _Plugins from './core/plugin'
import * as _plugins from './plugins'
import * as _templates from './templates'
import * as _Translator from './core/translator'
import { ValidateCallback } from './utils/validate'
import { TextParser as _TextParser } from './core/parser'
import { ChatGPT3 as _ChatGPT3 } from './service/chatgpt3'
import { ChatGPT35 as _ChatGPT35 } from './service/chatgpt35'
import { ChatGPT3Broker as _ChatGPT3Broker } from './broker/3'
import { ChatGPT35Broker as _ChatGPT35Broker, } from './broker/35'
import { ImagesGenerations as _ImagesGenerations } from './service/images-generations'

export type TextParser = _TextParser
export type Translator<S extends ValidateCallback<any>, O extends ValidateCallback<any>> = _Translator.Translator<S, O>
export type TranslatorParams<S extends ValidateCallback<any>, O extends ValidateCallback<any>> = _Translator.TranslatorParams<S, O>
export type ChatGPT3Broker<S extends ValidateCallback<any>, O extends ValidateCallback<any>> = _ChatGPT3Broker<S, O>
export type ChatGPT35Broker<S extends ValidateCallback<any>, O extends ValidateCallback<any>> = _ChatGPT35Broker<S, O>
export type Broker3Plugin<T extends ValidateCallback<any>> = _Plugins.Broker3Plugin<T>
export type Broker35Plugin<T extends ValidateCallback<any>> = _Plugins.Broker35Plugin<T>
export type ImagesGenerations = _ImagesGenerations

export const TextParser = _TextParser
export const Translator = _Translator.Translator
export const ChatGPT3 = _ChatGPT3
export const ChatGPT35 = _ChatGPT35
export const ChatGPT3Broker = _ChatGPT3Broker
export const ChatGPT35Broker = _ChatGPT35Broker
export const Broker3Plugin = _Plugins.Broker3Plugin
export const Broker35Plugin = _Plugins.Broker35Plugin
export const ImagesGenerations = _ImagesGenerations

export const plugins = _plugins
export const templates = _templates

export const ctod = {
    plugins,
    templates,
    ChatGPT3,
    ChatGPT35,
    Translator,
    TextParser,
    Broker3Plugin,
    Broker35Plugin,
    ChatGPT3Broker,
    ChatGPT35Broker,
    ImagesGenerations
}

module.exports = ctod
module.exports.ctod = ctod

export default ctod
