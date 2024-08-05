import axios, { AxiosInstance } from 'axios'
import { validateToJsonSchema } from '../../utils/validate'
import { Llama3CppCompletion, Config } from './completion'

export class Llama3Cpp {
    _axios = axios.create()

    static createChatRequest(config: Partial<Config> | (() => Promise<Partial<Config>>)) {
        return async(messages: any[], { schema, onCancel }: any) => {
            const ll3cpp = new Llama3Cpp()
            const chat = ll3cpp.createCompletion()
            chat.setConfig(typeof config === 'function' ? await config() : config)
            const { promise, cancel } = chat.talk({
                messages: messages,
                response_format: {
                    type: 'json_object',
                    schema: validateToJsonSchema(schema.output)
                }
            })
            onCancel(cancel)
            const text = await promise()
            return text
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
