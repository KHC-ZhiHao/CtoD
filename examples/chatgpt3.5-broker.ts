import { flow } from 'power-helper'
import { prompt } from 'inquirer'
import { ChatGPT35Broker, plugins, templates } from '../lib/index'

/**
 * @zh 這裡示範如何透過 ChatGPT35Broker 從使用者獲取疑問中獲取最佳索引
 * @en Here is a demonstration of how to use ChatGPT35Broker to obtain the best index from the user's queries.
 * @test npx ts-node ./examples/chatgpt3.5-broker.ts
 */


flow.run(async() => {
    const { apiKey } = await prompt([
        {
            type: 'input',
            name: 'apiKey',
            message: 'Please enter API key.',
            default: ''
        }
    ])
    if (!apiKey) {
        throw new Error('Unable to find API key.')
    }
    const broker = new ChatGPT35Broker({
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
        plugins: [
            plugins.PrintLogPlugin.ver35.use({})
        ],
        install: ({ bot, attach }) => {
            bot.setConfiguration(apiKey)
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
                '且相關性由高到低排序並給予分數，分數為 0 ~ 1'
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
    await broker.request({
        question: '閃到腰，又一直咳嗽',
        indexs: [
            '腰痛',
            '頭痛',
            '喉嚨痛',
            '四肢疼痛'
        ]
    })
})
