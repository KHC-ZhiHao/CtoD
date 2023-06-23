import Handlebars from 'handlebars'
import { record } from 'power-helper'

type JsonResponseFormat = {
    desc: string
    example: any
}

/**
 * @zh 協助使用者將格式需求轉成論敘語句。
 * @en Assist the user in converting the formatting requirements into declarative sentences.
 */

export const requireJsonResponse = (question: string | string[], format: Record<string, JsonResponseFormat>) => {
    return [
        ...(Array.isArray(question) ? question : [question]),
        'Please respond using the following JSON format and minify the JSON without including any explanation: ',
        '{',
        Object.entries(format).map(([key, value]) => {
            return [
                `/* ${value.desc} */`,
                `"${key}": ${JSON.stringify(value.example)}`,
            ].join('\n')
        }).join(',\n'),
        '}'
    ].join('\n')
}

/**
 * @zh 協助使用者將格式需求轉成論敘語句，支援 Handlebars。
 * @en Assist the user in converting the formatting requirements into declarative sentences, support Handlebars.
 */

export const requireJsonResponseWithHandlebars = (
    value: Record<string, any>,
    question: string | string[],
    format: Record<string, JsonResponseFormat>
) => {
    const handlebars = Handlebars.create()

    handlebars.registerHelper('DATA', function(this: any, value) {
        return JSON.stringify(value)
    })

    handlebars.registerHelper('ENV', function(this: any, value) {
        return this.__envs && value ? this.__envs[value] : ''
    })

    handlebars.registerHelper('INPUT', function(this: any) {
        return JSON.stringify(record.omit(this, ['__envs']))
    })

    handlebars.registerHelper('JOIN', function(this: any, value) {
        return Array.isArray(value) ? value.join() : JSON.stringify(value)
    })

    return handlebars.compile(requireJsonResponse(question, format))(value)
}
