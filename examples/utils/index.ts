import fs from 'fs'
import { Buffer } from 'buffer'
import { prompt } from 'inquirer'

type BufferEncoding = 'ascii' | 'utf8' | 'utf-8' | 'utf16le' | 'ucs2' | 'ucs-2' | 'base64' | 'latin1' | 'binary' | 'hex'

/**
 * @zh 你可以透過在根目錄中加入 .key 檔案，來自動讀取 API key
 * @en You can automatically read the API key by adding the .key file in the root directory.
 */

export const getKey = async() => {
    let apiKey = ''
    let keyFile = './.key'
    if (fs.existsSync(keyFile)) {
        apiKey = fs.readFileSync('./.key').toString()
    }
    if (!apiKey) {
        const { inputApiKey } = await prompt([
            {
                type: 'input',
                name: 'inputApiKey',
                message: 'Please enter API key.',
                default: ''
            }
        ])
        apiKey = inputApiKey
    }
    if (!apiKey) {
        throw new Error('Unable to find API key.')
    }
    return apiKey
}

/**
 * @zh 定義輸出資料夾位置
 * @en Define the output folder location
 */

export const definedOutputDir = (dirName: string) => {
    let dir = `.output/${dirName}`
    if (fs.existsSync(dir) === false) {
        fs.mkdirSync(dir, {
            recursive: true
        })
    }
    return {
        write(fileName: string, content: Buffer | string | Record<any, any>, encode: BufferEncoding = 'utf-8') {
            let data = content
            if (Buffer.isBuffer(content) === false && typeof content !== 'string') {
                data = JSON.stringify(content, null, 4)
            }
            fs.writeFileSync(`${dir}/${fileName}`, data, encode)
        }
    }
}
