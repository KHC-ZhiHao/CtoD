import ChineseMap from './chinese-conv.json'

/**
 * @zh 繁体转简体
 * @en Traditional to Simplified
 */

export const t2s = (text: string) => {
    return text.split('').map(char => (ChineseMap as any)[char] || char).join('')
}

/**
 * @zh 简体转繁体
 * @en Simplified to Traditional
 */

export const s2t = (text: string) => {
    const reverseMap: Record<string, string> = {}
    for (const [s, t] of Object.entries(ChineseMap)) {
        reverseMap[t] = s
    }
    return text.split('').map(char => reverseMap[char] || char).join('')
}
