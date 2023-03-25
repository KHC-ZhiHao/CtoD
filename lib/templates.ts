type JsonResponseFormat = {
    desc: string
    example: any
}
/**
 * @zh 協助使用者將格式需求轉成論敘語句
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
