// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../lib/shims.d.ts" />
import { ChatBroker, OpenAI, plugins, bindYupToJsonSchemaToYup } from '../lib/index'

/**
 * @test npx ts-node ./examples/chat-demo.ts
 */

const API_KEY = ''
const broker = new ChatBroker({
    input: yup => {
        return {
            indexs: yup.array(yup.string().required()).required(),
            question: yup.string().required()
        }
    },
    output: yup => {
        const item = yup.object({
            name: yup.string().description('索引名稱').required(),
            score: yup.number().description('評比分數').required()
        }).required()
        return {
            indexs: yup.array(item).description('由高到低排序的索引').required()
        }
    },
    plugins: {
        log: plugins.PrintLogPlugin.use({
            detail: true
        })
    },
    install({ attach }) {
        attach('start', async({ setPreMessages }) => {
            setPreMessages([
                {
                    role: 'system',
                    content: '你現在是一位擅長分類索引的藥師'
                }
            ])
        })
    },
    request: OpenAI.createChatRequestWithJsonSchema({
        apiKey: API_KEY,
        config: {
            model: 'gpt-4o-mini'
        }
    }),
    question: async({ indexs, question }) => {
        return [
            '我有以下索引',
            `${JSON.stringify(indexs)}`,
            `請幫我解析"${question}"可能是哪個索引`,
            '且相關性由高到低排序並給予分數，分數由 0 ~ 1'
        ]
    }
})


bindYupToJsonSchemaToYup()
broker.request({
    indexs: ['胃痛', '腰痛', '頭痛', '喉嚨痛', '四肢疼痛'],
    question: '喝咖啡，吃甜食，胃食道逆流'
}).then(e => {
    console.log('輸出結果：', e.indexs)
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
    console.error('Error:', error?.response?.data?.error?.message ?? error)
})
