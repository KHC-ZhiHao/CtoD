import fs from 'fs'
import { CtoD, XCtodService, plugins } from '../lib/index.js'

/**
 * @test npx esno ./examples/x.ts
 */

const apiKey = fs.readFileSync('./.x-api-key', 'utf-8').trim()

const ctod = new CtoD({
    plugins: () => {
        return {
            retry: plugins.RetryPlugin.use({
                retry: 3,
                printWarn: true
            })
        }
    },
    request: XCtodService.createChatRequestWithJsonSchema({
        apiKey,
        config: {
            model: 'grok-4-latest',
        }
    })
})

const brokerBuilder = ctod.createBrokerBuilder<{
    indexes: string[]
    question: string
}>({
    install: ({ attach }) => {
        attach('start', async({ setPreMessages }) => {
            setPreMessages([
                {
                    role: 'system',
                    content: '你現在是一位擅長分類索引的藥師'
                }
            ])
        })
    }
})

const broker = brokerBuilder.create(async({ zod, data, setMessages }) => {
    const { indexes, question } = data
    setMessages([
        {
            role: 'user',
            content: [
                '我有以下索引',
                `${JSON.stringify(indexes)}`,
                `請幫我解析"${question}"可能是哪個索引`,
                '且相關性由高到低排序並給予分數，分數由 0 ~ 1'
            ]
        }
    ])
    const item = zod.object({
        name: zod.string().describe('索引名稱'),
        score: zod.number().describe('評比分數')
    })
    return {
        indexes: zod.array(item).describe('由高到低排序的索引')
    }
})

broker.request({
    indexes: ['胃痛', '腰痛', '頭痛', '喉嚨痛', '四肢疼痛'],
    question: '喝咖啡，吃甜食，胃食道逆流'
}).then(e => {
    console.log('輸出結果：', e.indexes)
    /*
        [
            {
                name: '胃痛',
                score: 1
            },
            {
                name: '喉嚨痛',
                score: 0.7
            },
            ...
        ]
     */
}).catch(error => {
    console.error('Error:', error)
})
