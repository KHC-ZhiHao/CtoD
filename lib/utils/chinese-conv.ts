import { Converter } from 'opencc-js'

/**
 * @zh 繁体转简体
 * @en Traditional to Simplified
*/
export const t2s = (text: string) => {
    const converter = Converter({
        from: 'tw',
        to: 'cn'
    })
    return converter(text)
}

/**
 * @zh 简体转繁体
 * @en Simplified to Traditional
 */
export const s2t = (text: string) => {
    const converter = Converter({
        from: 'cn',
        to: 'tw'
    })
    return converter(text)
}
