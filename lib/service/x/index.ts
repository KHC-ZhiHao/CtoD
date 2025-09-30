import axios from 'axios'
import { XChat, Config } from './chat'
import { XImagesGeneration } from './images-generation'
import { validateToJsonSchema } from '../../utils/validate'

export class XCtodService {
    _axios = axios.create()
    _apiKey = ''

    static createChatRequest(
        apiKey: string | (() => Promise<string>),
        config: Partial<Config> | (() => Promise<Partial<Config>>) = {},
        options?: {
            axios?: any
        }
    ) {
        return async(messages: any[], { onCancel }: any) => {
            const xAi = new XCtodService(typeof apiKey === 'string' ? apiKey : await apiKey())
            const chat = xAi.createChat()
            const abortController = new AbortController()
            if (options && options.axios) {
                xAi.setAxios(options.axios)
            }
            chat.setConfig(typeof config === 'function' ? await config() : config)
            onCancel(() => abortController.abort())
            const { text } = await chat.talk(messages, {
                abortController
            })
            return text
        }
    }

    static createChatRequestWithJsonSchema(params: {
        axios?: any
        apiKey: string | (() => Promise<string>)
        config?: Partial<Pick<Config, 'model' | 'temperature'>> | (() => Promise<Partial<Pick<Config, 'model' | 'temperature'>>>)
    }) {
        return async(messages: any[], { schema, abortController }: any) => {
            const xAi = new XCtodService(typeof params.apiKey === 'string' ? params.apiKey : await params.apiKey())
            const chat = xAi.createChat()
            if (params.config) {
                chat.setConfig(typeof params.config === 'function' ? await params.config() : params.config)
            }
            if (params.axios) {
                xAi.setAxios(params.axios)
            }
            const jsonSchema = validateToJsonSchema(schema.output)
            const { text } = await chat.talk(messages, {
                abortController,
                jsonSchema: {
                    name: 'data',
                    strict: true,
                    schema: jsonSchema
                }
            })
            return text
        }
    }

    constructor(apiKey = '') {
        this._apiKey = apiKey
    }

    /**
     * @zh 如果你有需要特別設定 axios，請使用這方法。
     * @en If you need to set axios, please use this method.
     */

    setAxios(axios: any) {
        this._axios = axios
    }

    /**
     * @zh 設定 api key。
     * @en Set api key.
     */

    setConfiguration(apiKey: string) {
        this._apiKey = apiKey
    }

    createChat() {
        return new XChat(this)
    }

    createImagesGeneration() {
        return new XImagesGeneration(this)
    }
}
