import fs from 'fs'
import Yup from 'yup'
import { flow } from 'power-helper'
import { prompt } from 'inquirer'
import { OpenAI, ChatBroker, plugins, templates } from '../lib'

/**
 * @invoke npx ts-node ./examples/vision-demo.ts
 */

const API_KEY = ''
const ImageUrl = 'data:image/png;base64,' + fs.readFileSync('./examples/vision-demo.png').toString('base64')
const ImageExUrl = 'data:image/png;base64,' + fs.readFileSync('./examples/vision-demo-ex.png').toString('base64')

flow.run(async () => {
    const drinkRule = (yup: typeof Yup) => {
        return yup.object({
            name: yup.string().required(),
            prices: yup.object({
                M: yup.number().nullable(),
                L: yup.number().nullable()
            })
        })
    }
    const broker = new ChatBroker({
        input: yup => {
            return {
                exists: yup.array(drinkRule(yup)).required()
            }
        },
        output: yup => {
            return {
                drinks: yup.array(drinkRule(yup)).required()
            }
        },
        plugins: {
            print: plugins.PrintLogPlugin.use({
                detail: false
            })
        },
        install: () => {
            return null
        },
        request: async(messages) => {
            const openai = new OpenAI(API_KEY)
            const vision = openai.createVision()
            vision.setConfig({
                maxTokens: 4096
            })
            const result = await vision.view([
                {
                    role: 'system',
                    content: '你現在是一個分析菜單的助手，你擅長從圖片中找到商品名稱與價格並歸納'
                },
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: '以下是菜單的一部分，我主要需要藍色文字的商品部分，這部分你可以解讀出什麼？'
                        },
                        {
                            type: 'image_url',
                            image_url: {
                                url: ImageExUrl
                            }
                        }
                    ]
                },
                {
                    role: 'assistant',
                    content: '我從圖片中知道熟成紅茶 中杯25元 大杯30元'
                },
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: messages[0].content
                        },
                        {
                            type: 'image_url',
                            image_url: {
                                url: ImageUrl
                            }
                        }
                    ]
                }
            ])
            return result.text
        },
        question: async ({ exists }) => {
            const ex = exists.map(e => {
                const prices = Object
                    .entries(e.prices)
                    .filter(e => e[1])
                    .map(([key, value]) => `${key}:${value}`)
                return `* ${e.name}: ${prices.join('/')}`
            })
            return templates.requireJsonResponse([
                '你的解讀完全正確，現在請幫我條列出菜單上所有商品，這個菜單中已知以下資料，你解讀的結果如果沒有以下資料代表你的解讀不對：',
                '"""',
                ...ex,
                '"""'
            ], {
                drinks: {
                    desc: '商品清單，不要回傳已知商品',
                    example: [
                        {
                            name: '熟成紅茶',
                            prices: {
                                M: 25,
                                L: 30
                            }
                        }
                    ]
                }
            })
        }
    })
    try {
        const exists = [
            {
                name: '熟成紅茶',
                prices: {
                    M: 25,
                    L: 30
                }
            }
        ] as any[]
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const result = await broker.request({
                exists
            })
            const keys: string[] = exists.map(e => e.name)
            const { drinks } = await prompt([
                {
                    type: 'checkbox',
                    name: 'drinks',
                    message: '請選擇正確的飲料',
                    choices: result.drinks.filter(e => !keys.includes(e.name)).map(e => {
                        return {
                            name: `${e.name} ${Object.entries(e.prices).map(([key, value]) => `${key}:${value}`).join(' ')}`,
                            value: e
                        }
                    })
                },
            ])
            exists.push(...drinks)
            const { keep } = await prompt([
                {
                    type: 'confirm',
                    name: 'keep',
                    message: '是否繼續？'
                }
            ])
            if (keep === false) {
                break
            }
        }
    } catch (error: any) {
        console.error('Error:', error?.response?.data?.error?.message ?? error)
    }
})
