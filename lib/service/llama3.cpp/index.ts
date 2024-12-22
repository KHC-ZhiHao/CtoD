import axios, { AxiosInstance } from 'axios'
import { sify } from 'chinese-conv/dist'
import { validateToJsonSchema } from '../../utils/validate'
import { Llama3CppCompletion, Config } from './completion'

export class Llama3Cpp {
    _axios = axios.create()

    static createChatRequest(params: {
        config: Partial<Config> | (() => Promise<Partial<Config>>)
        talkOptions?: any
    }) {
        return async(messages: any[], { schema, onCancel }: any) => {
            const ll3cpp = new Llama3Cpp()
            const chat = ll3cpp.createCompletion()
            const config = typeof params.config === 'function' ? await params.config() : params.config
            chat.setConfig(config)
            let formatSchema = validateToJsonSchema(schema.output)
            if (chat.config.autoConvertTraditionalChinese) {
                formatSchema = JSON.parse(sify(JSON.stringify(formatSchema)))
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
