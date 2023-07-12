import { flow } from 'power-helper'
import { getKey } from '../utils'
import { prompt } from 'inquirer'
import { ChatGPT4Broker, plugins, Broker4Plugin, templates } from '../../lib/index'

/**
 * @invoke npx ts-node ./examples/applications/cosplay.ts
 */

const characterPlugin = new Broker4Plugin({
    name: 'character',
    params: () => {
        return {}
    },
    receiveData: yup => {
        return {
            character: yup.string().required()
        }
    },
    onInstall: ({ receive, attach }) => {
        const characters = new Map<string, string>()
        receive(({ id, data }) => {
            characters.set(id, data.character)
        })
        attach('talkFirst', async({ id, setPreMessages }) => {
            const character = characters.get(id)
            setPreMessages([
                {
                    role: 'user',
                    content: '請你扮演' + character
                },
                {
                    role: 'assistant',
                    content: '沒問題，我現在是' + character
                }
            ])
        })
        attach('done', async({ id }) => {
            characters.delete(id)
        })
    }
})

flow.run(async () => {
    const { character, action } = await prompt([
        {
            type: 'input',
            name: 'character',
            message: '請輸入角色名稱.',
            default: '派大星'
        },
        {
            type: 'input',
            name: 'action',
            message: '你想對他問什麼？',
            default: '你最好的朋友是誰？'
        }
    ])
    const apiKey = await getKey()
    const broker = new ChatGPT4Broker({
        input: yup => {
            return {
                action: yup.string().required(),
                character: yup.string().required(),
            }
        },
        output: yup => {
            return {
                message: yup.string().required()
            }
        },
        plugins: {
            print: plugins.PrintLogPlugin.ver35.use({
                detail: false
            }),
            character: characterPlugin.use({})
        },
        install: ({ bot, attach }) => {
            bot.setConfig({
                model: 'gpt-4-32k'
            })
            bot.setConfiguration(apiKey)
            attach('talkFirst', async({ data, plugins }) => {
                plugins.character.send({
                    character: data.character
                })
            })
        },
        question: async ({ action }) => {
            return templates.requireJsonResponse([
                '請基於你的角色個性，並依據以下指令進行回應：',
                action
            ], {
                message: {
                    desc: '回應內容',
                    example: 'string'
                }
            })
        }
    })
    try {
        await broker.request({
            action,
            character
        })
    } catch (error: any) {
        console.error('Error:', error?.response?.data?.error?.message ?? error)
    }
})
