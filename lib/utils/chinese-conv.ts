import ChineseMap from './chinese-conv.json'

export const tify = (text: string) => {
    return text.split('').map(char => (ChineseMap as any)[char] || char).join('')
}

export const sify = (text: string) => {
    const reverseMap: Record<string, string> = {}
    for (const [s, t] of Object.entries(ChineseMap)) {
        reverseMap[t] = s
    }
    return text.split('').map(char => reverseMap[char] || char).join('')
}
