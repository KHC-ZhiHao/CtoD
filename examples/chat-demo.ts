// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../lib/shims.d.ts" />
import { ChatBroker, OpenAI, plugins } from '../lib/index'

/**
 * @test npx esno ./examples/chat-demo.ts
 */

const API_KEY = ''
const broker = new ChatBroker({
    input: yup => {
        return {
            indexes: yup.array(yup.string().required()).required(),
            question: yup.string().required()
        }
    },
    output: yup => {
        const item = yup.object({
            name: yup.string().required().meta({
                jsonSchema: {
                    description: '索引名稱'
                }
            }),
            score: yup.number().required().meta({
                jsonSchema: {
                    description: '評比分數'
                }
            })
        }).required()
        return {
            indexes: yup.array(item).required().meta({
                jsonSchema: {
                    description: '由高到低排序的索引'
                }
            })
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
    question: async({ indexes, question }) => {
        return [
            '我有以下索引',
            `${JSON.stringify(indexes)}`,
            `請幫我解析"${question}"可能是哪個索引`,
            '且相關性由高到低排序並給予分數，分數由 0 ~ 1'
        ]
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
    console.error('Error:', error?.response?.data?.error?.message ?? error)
})
