import axios from 'axios'
import { OpenAIVision } from './vision.js'
import { OpenAIChat, Config } from './chat.js'
import { OpenAIImagesGeneration } from './images-generation.js'
import { validateToJsonSchema } from '../../utils/validate.js'

export class OpenAICtodService {
    _axios = axios.create()
    _apiKey = ''
    _baseUrl = 'https://api.openai.com'

    static createChatRequest(
        apiKey: string | (() => Promise<string>),
        config: Partial<Config> | (() => Promise<Partial<Config>>) = {},
        options?: {
            axios?: any
            baseUrl?: string
        }
    ) {
        return async(messages: any[], { abortController }: any) => {
            const openai = new OpenAICtodService(typeof apiKey === 'string' ? apiKey : await apiKey())
            const chat = openai.createChat()
            if (options) {
                if (options.axios) {
                    openai.setAxios(options.axios)
                }
                if (options.baseUrl) {
                    openai.setBaseUrl(options.baseUrl)
                }
            }
            chat.setConfig(typeof config === 'function' ? await config() : config)
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
        return async(messages: any[], { schema, onCancel }: any) => {
            const openai = new OpenAICtodService(typeof params.apiKey === 'string' ? params.apiKey : await params.apiKey())
            const chat = openai.createChat()
            const abortController = new AbortController()
            if (params.config) {
                chat.setConfig(typeof params.config === 'function' ? await params.config() : params.config)
            }
            if (params.axios) {
                openai.setAxios(params.axios)
            }
            onCancel(() => abortController.abort())
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
     * @zh 如果你有需要特別設定 baseUrl，請使用這方法。
     * @en If you need to set baseUrl, please use this method.
     */

    setBaseUrl(baseUrl: string) {
        this._baseUrl = baseUrl
    }

    /**
     * @zh 設定 api key。
     * @en Set api key.
     */

    setConfiguration(apiKey: string) {
        this._apiKey = apiKey
    }

    createChat() {
        return new OpenAIChat(this)
    }

    createVision() {
        return new OpenAIVision(this)
    }

    createImagesGeneration() {
        return new OpenAIImagesGeneration(this)
    }
}
