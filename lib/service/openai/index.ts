import { OpenAIChat } from './chat'
import { OpenAICompletion } from './completion'
import { OpenAIImagesGeneration } from './images-generation'
import axios, { AxiosInstance } from 'axios'

export class OpenAI {
    _axios = axios.create()
    _apiKey = ''

    constructor(apiKey = '') {
        this._apiKey = apiKey
    }

    /**
     * @zh 如果你有需要特別設定 axios，請使用這方法。
     * @en If you need to set axios, please use this method.
     */

    setAxios(axios: AxiosInstance) {
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
        return new OpenAIChat(this)
    }

    createCompletion() {
        return new OpenAICompletion(this)
    }

    createImagesGeneration() {
        return new OpenAIImagesGeneration(this)
    }
}
