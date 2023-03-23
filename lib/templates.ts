type JsonResponseFormat = {
    desc: string
    example: any
}

export const requireJsonResponse = (question: string | string[], format: Record<string, JsonResponseFormat>) => {
    return [
        ...(Array.isArray(question) ? question : [question]),
        '請使用以下的 JSON 格式回答，並 minify JSON，且不帶解釋：',
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
