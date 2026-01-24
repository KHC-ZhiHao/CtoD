import axios, { AxiosInstance } from 'axios'
import { s2t, t2s } from '../../utils/chinese-conv.js'
import { validateToJsonSchema } from '../../utils/validate.js'
import { LlamaCppCompletion, Config } from './completion.js'

export class LlamaCppCtodService {
    _axios = axios.create()

    static createChatRequestWithJsonSchema(params: {
        axios?: AxiosInstance
        config: Partial<Config> | (() => Promise<Partial<Config>>)
        talkOptions?: any
    }) {
        return async(messages: any[], { schema, onCancel }: any) => {
            const llamaCpp = new LlamaCppCtodService()
            const chat = llamaCpp.createCompletion()
            const config = typeof params.config === 'function' ? await params.config() : params.config
            chat.setConfig(config)
            let formatSchema = validateToJsonSchema(schema.output)
            if (params.axios) {
                llamaCpp.setAxios(params.axios)
            }
            if (chat.config.autoConvertTraditionalChinese) {
                formatSchema = JSON.parse(t2s(JSON.stringify(formatSchema)))
            }
            const { run, cancel } = chat.talk({
                options: params.talkOptions,
                messages: messages,
                response_format: {
                    type: 'json_object',
                    schema: formatSchema
                }
            })
            onCancel(cancel)
            const { message } = await run()
            return chat.config.autoConvertTraditionalChinese ? s2t(message) : message
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
        return new LlamaCppCompletion(this)
    }
}
