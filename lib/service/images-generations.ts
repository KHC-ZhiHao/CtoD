import axios, { AxiosInstance } from 'axios'

type ApiResponse = {
    created: string
    data: {
        b64_json: string
    }[]
}

type Config = {
    /**
     * @zh 一次圖片回應數量
     * @en Number of image responses at a time
     */
    n: number
    /**
     * @zh 解析度，例如 1024x1024
     * @en Resolution, for example 1024x1024
     */
    size: `${number}x${number}`
}

export class ImagesGenerations {
    private axios = axios.create()
    private apiKey = ''
    private config: Config = {
        n: 1,
        size: '1024x1024'
    }

    /**
     * @zh 如果你有需要特別設定 axios，請使用這方法
     * @en If you need to set axios, use this method
     */

    setAxios(axios: AxiosInstance) {
        this.axios = axios
    }

    /**
     * @zh 設定 api key
     * @en Set api key
     */

    setConfiguration(apiKey: string) {
        this.apiKey = apiKey
    }

    /**
     * @zh 改變對話的一些設定
     * @en Change some settings of the conversation
     */

    setConfig(options: Partial<Config>) {
        Object.assign(this.config, options)
    }

    /**
     * @zh 產生圖片
     * @en Generate image
     */

    async create(prompt: string) {
        const result = await this.axios.post<ApiResponse>('https://api.openai.com/v1/images/generations', {
            prompt,
            n: this.config.n,
            size: this.config.size,
            response_format: 'b64_json'
        }, {
            timeout: 1000 * 60 * 5,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            }
        })
        return result.data
    }
}
