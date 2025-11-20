import { GoogleCtodService } from './index.js'

type Config = {
    model: string
    size: string
    aspectRatio: string
}

export class GoogleImagesGeneration {
    private google: GoogleCtodService
    private config: Config = {
        model: 'imagen-4.0-generate-001',
        size: '1K',
        aspectRatio: '1:1'
    }

    constructor(google: GoogleCtodService) {
        this.google = google
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
        const response = await this.google.googleGenAI.models.generateImages({
            model: this.config.model,
            prompt,
            config: {
                numberOfImages: 1,
                aspectRatio: this.config.aspectRatio,
                imageSize: this.config.size
            }
        })
        return {
            images: response.generatedImages?.map(e => {
                return {
                    url: e.image?.imageBytes || '',
                    mimeType: e.image?.mimeType || ''
                }
            }) || []
        }
    }
}
