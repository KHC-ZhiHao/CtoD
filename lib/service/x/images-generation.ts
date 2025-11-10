import { XCtodService } from './index.js'

type ApiResponse = {
    created: string
    data: {
        b64_json: string
    }[]
}

type Config = {
    /**
     * @zh 模型，支援 grok-2-image
     * @en Model, support grok-2-image
     */
    model: 'grok-2-image'
}

export class XImagesGeneration {
    private xAi: XCtodService
    private config: Config = {
        model: 'grok-2-image'
    }

    constructor(xAi: XCtodService) {
        this.xAi = xAi
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
        const result = await this.xAi._axios.post<ApiResponse>('https://api.x.ai/v1/images/generations', {
            prompt,
            n: 1,
            model: this.config.model,
            response_format: 'b64_json'
        }, {
            timeout: 1000 * 60 * 5,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.xAi._apiKey}`
            }
        })
        return result.data
    }
}
