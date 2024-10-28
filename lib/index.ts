export * as plugins from './plugins'
export * as templates from './templates'
export { validateToJsonSchema } from './utils/validate'
export { OpenAI } from './service/openai'
export { Llama3Cpp } from './service/llama3.cpp'
export { TextParser } from './core/parser'
export { ChatGPTMessage } from './service/openai/chat'
export { ChatBroker } from './broker/chat'
export { ChatBrokerPlugin } from './core/plugin'
export { Translator, TranslatorParams } from './core/translator'

import * as plugins from './plugins'
import * as templates from './templates'
import { OpenAI } from './service/openai'
import { Llama3Cpp } from './service/llama3.cpp'
import { Translator } from './core/translator'
import { TextParser } from './core/parser'
import { ChatBroker } from './broker/chat'
import { ChatBrokerPlugin } from './core/plugin'
import { validateToJsonSchema } from './utils/validate'
import { extendSchema } from '@sodaru/yup-to-json-schema'
import { addMethod, Schema } from 'yup'


/**
 * @see https://github.com/sodaru/yup-to-json-schema?tab=readme-ov-file#extend-the-schema
 */

export const bindYupToJsonSchemaToYup = () => {
    extendSchema({
        Schema,
        addMethod
    })
}

export const ctod = {
    OpenAI,
    Llama3Cpp,
    plugins,
    templates,
    ChatBroker,
    Translator,
    TextParser,
    ChatBrokerPlugin,
    validateToJsonSchema,
    bindYupToJsonSchemaToYup
}

module.exports = ctod
module.exports.ctod = ctod

export default ctod
