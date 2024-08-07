import axios, { AxiosInstance } from 'axios'
import { json } from 'power-helper'
import { sify } from 'chinese-conv'
import { validateToJsonSchema, JsonSchemaInfo } from '../../utils/validate'
import { Llama3CppCompletion, Config } from './completion'

export class Llama3Cpp {
    _axios = axios.create()

    static createChatRequest(params: {
        config: Partial<Config> | (() => Promise<Partial<Config>>)
        talkOptions?: any
        jsonSchemaInfo?: JsonSchemaInfo
    }) {
        return async(messages: any[], { schema, onCancel }: any) => {
            const ll3cpp = new Llama3Cpp()
            const chat = ll3cpp.createCompletion()
            const config = typeof params.config === 'function' ? await params.config() : params.config
            const info = params.jsonSchemaInfo ? json.jpjs(params.jsonSchemaInfo) : undefined
            chat.setConfig(config)
            if (chat.config.autoConvertTraditionalChinese && info) {
                for (let key in info.desc) {
                    const d = info.desc[key]
                    if (typeof d === 'object' && d.description) {
                        d.description = sify(d.description)
                    }
                    if (typeof d === 'string') {
                        info.desc[key] = sify(d)
                    }
                }
            }
            const { run, cancel } = chat.talk({
                options: params.talkOptions,
                messages: messages,
                response_format: {
                    type: 'json_object',
                    schema: validateToJsonSchema(schema.output, info)
                }
            })
            onCancel(cancel)
            const { message } = await run()
            return message
        }
    }

    /**
     * @zh 如果你有需要特別設定 axios，請使用這方法。
     * @en If you need to set axios, please use this method.
     */

    setAxios(axios: AxiosInstance) {
        this._axios = axios
    }

    /**
     * @zh 建立 補強/ 對話物件。
     * @en Create completion object.
     */

    createCompletion() {
        return new Llama3CppCompletion(this)
    }
}
