import { flow } from 'power-helper'
import { ChatGPT35Broker, templates } from '../lib/index'

/** 如何透過文字獲取最佳索引 */

const API_KEY = ''

flow.run(async() => {
    const broker = new ChatGPT35Broker({
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
        install: ({ bot, attach }) => {
            bot.setConfiguration(API_KEY)
            attach('talkBefore', async({ messages }) => {
                console.log('送出訊息:', messages)
            })
            attach('talkAfter', async({ parseText }) => {
                console.log('接收訊息:', parseText)
            })
            attach('parseFailed', async({ count, retry, response, changeMessages }) => {
                if (count <= 1) {
                    console.log(`回傳錯誤，正在重試: ${count} 次`)
                    changeMessages([response.newMessages[0]])
                    retry()
                }
            })
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
