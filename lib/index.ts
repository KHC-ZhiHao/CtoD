/* eslint-disable no-redeclare */

import * as _plugins from './plugins'
import * as _templates from './templates'
import * as _Translator from './core/translator'
import { ValidateCallback } from './utils/validate'
import { OpenAI as _OpenAI } from './service/openai'
import { TextParser as _TextParser } from './core/parser'
import { ChatBroker as _ChatBroker } from './broker/chat'
import { ChatBrokerPlugin as _ChatBrokerPlugin } from './core/plugin'

export type OpenAI = _OpenAI
export type TextParser = _TextParser
export type Translator<S extends ValidateCallback<any>, O extends ValidateCallback<any>> = _Translator.Translator<S, O>
export type TranslatorParams<S extends ValidateCallback<any>, O extends ValidateCallback<any>> = _Translator.TranslatorParams<S, O>
export type ChatBroker<S extends ValidateCallback<any>, O extends ValidateCallback<any>> = _ChatBroker<S, O, any, any>
export type ChatBrokerPlugin<T extends ValidateCallback<any>, R extends ValidateCallback<any>> = _ChatBrokerPlugin<T, R>

export const OpenAI = _OpenAI
export const TextParser = _TextParser
export const Translator = _Translator.Translator

export const ChatBroker = _ChatBroker
export const ChatBrokerPlugin = _ChatBrokerPlugin

export const plugins = _plugins
export const templates = _templates

export const ctod = {
    OpenAI,
    plugins,
    templates,
    ChatBroker,
    Translator,
    TextParser,
    ChatBrokerPlugin
}

module.exports = ctod
module.exports.ctod = ctod

export default ctod
