export const parseJSONStream = <T>(data: string): {
    items: T[]
    lastChunk: string
} => {
    const items: T[] = []
    let buffer = ''
    let depth = 0
    let inString = false
    let escapeNext = false
    let objectStarted = false

    for (let i = 0; i < data.length; i++) {
        const char = data[i]

        if (escapeNext) {
            escapeNext = false
            if (objectStarted) buffer += char
            continue
        }
        if (char === '\\') {
            escapeNext = true
            if (objectStarted) buffer += char
            continue
        }
        if (char === '"') {
            inString = !inString
            if (objectStarted) buffer += char
            continue
        }
        if (!inString) {
            if (char === '{') {
                if (depth === 0) {
                    objectStarted = true
                    buffer = '{'
                } else {
                    buffer += char
                }
                depth++
            } else if (char === '}') {
                depth--
                buffer += char
                if (depth === 0 && objectStarted) {
                    const trimmed = buffer.trim()
                    if (trimmed) {
                        try {
                            items.push(JSON.parse(trimmed))
                        } catch {
                            // 解析失敗，忽略
                        }
                    }
                    buffer = ''
                    objectStarted = false
                }
            } else if (objectStarted) {
                buffer += char
            }
        } else if (objectStarted) {
            buffer += char
        }
    }

    return {
        items,
        lastChunk: objectStarted ? buffer.trim() : ''
    }
}
