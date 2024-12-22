import fs from 'fs'
import { flow } from 'power-helper'
import { prompt } from 'inquirer'
import { CtoD, ChatBrokerPlugin, plugins, OpenAI } from '../lib/index'

/**
 * @test npx esno ./examples/plugin.ts
 */

const apiKey = fs.readFileSync('./.api-key', 'utf-8').trim()

const characterPlugin = new ChatBrokerPlugin({
    name: 'character',
    params: () => {
        return {}
    },
    receiveData: yup => {
        return {
            character: yup.string().required()
        }
    },
    onInstall: ({ receive, attachAfter }) => {
        const characters = new Map<string, string>()
        receive(({ id, data }) => {
            characters.set(id, data.character)
        })
        attachAfter('start', async({ id, setPreMessages }) => {
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
        attachAfter('done', async({ id }) => {
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

    const ctod = new CtoD({
        plugins: () => {
            return {
                character: characterPlugin.use({}),
                log: plugins.PrintLogPlugin.use({
                    detail: true
                })
            }
        },
        request: OpenAI.createChatRequestWithJsonSchema({
            apiKey,
            config: {
                model: 'gpt-4o'
            }
        })
    })

    const brokerBuilder = ctod.createBrokerBuilder<{
        action: string
        character: string
    }>({
        install: ({ attach }) => {
            attach('start', async({ data, plugins }) => {
                plugins.character.send({
                    character: data.character
                })
            })
        },
    })

    const broker = brokerBuilder.create(async({ yup, setMessages }) => {
        setMessages([
            {
                role: 'user',
                content: [
                    '請基於你的角色個性，並依據以下指令進行回應：',
                    action
                ]
            }
        ])
        return {
            message: yup.string().required()
        }
    })
    try {
        const { message } = await broker.request({
            action,
            character
        })
        console.log(message)
    } catch (error: any) {
        console.error('Error:', error?.response?.data?.error?.message ?? error)
    }
})
