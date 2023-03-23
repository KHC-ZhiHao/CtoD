import { flow } from 'power-helper'
import { ChatGPT3Broker, templates } from '../lib/index'

/** 透過 GPT 3 簡單對話 */

const API_KEY = ''

flow.run(async() => {
    const broker = new ChatGPT3Broker({
        scheme: yup => {
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
        install: ({ bot }) => {
            bot.setConfiguration(API_KEY)
        },
        assembly: async({ indexs, question }) => {
            return templates.requireJsonResponse([
                '我有以下索引',
                `${JSON.stringify(indexs)}`,
                `請幫我解析"${question}"可能是哪個索引`,
                '且相關性由高到低排序並給予分數，分數由 0 ~ 1'
            ], {
                indexs: {
                    desc: '由高到低排序的索引',
                    example: [
                        {
                            name: '索引名稱',
                            score: '評比分數，數字顯示'
                        }
                    ]
                }
            })
        }
    })
    const response = await broker.request({
        indexs: ['腰痛', '頭痛', '喉嚨痛', '四肢疼痛'],
        question: '閃到腰，又一直咳嗽'
    })
    console.log('輸出結果：', response.indexs)
})
