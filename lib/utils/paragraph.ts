/**
 * @zh 將陣列的多行文字合併為一個字串。
 * @en Join multiple lines of text from an array into a single string.
 */
export const paragraph = (texts: string | string[]): string => {
    if (typeof texts === 'string') {
        return texts
    }
    return texts.join('\n')
}
