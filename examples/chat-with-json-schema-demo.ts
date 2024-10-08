// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../lib/shims.d.ts" />
import { ChatBroker, OpenAI } from '../lib/index'

/**
 * @test npx ts-node ./examples/chat-demo.ts
 */

const API_KEY = ''
const broker = new ChatBroker({
    input: yup => {
        return {
            indexs: yup.array(yup.string()).required(),
            question: yup.string().required()
        }
    },
    output: yup => {
        return {
            indexs: yup.array(yup.object({
                name: yup.string().required(),
                score: yup.number().required()
            })).required()
        }
    },
    install: () => null,
    request: OpenAI.createChatRequestWithJsonSchema({
        apiKey: API_KEY,
        config: {
            model: 'gpt-4o-mini'
        },
        jsonSchemaInfo: {
            desc: {
                indexs: '由高到低排序的索引'
            }
        }
    }),
    question: async({ indexs, question }) => {
        return [
            '我有以下索引',
            `${JSON.stringify(indexs)}`,
            `請幫我解析"${question}"可能是哪個索引`,
            '且相關性由高到低排序並給予分數，分數由 0 ~ 1'
        ].join('\n')
    }
})

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
