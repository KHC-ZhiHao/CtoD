import fs from 'fs'
import { flow } from 'power-helper'
import { input } from '@inquirer/prompts'
import { CtoD, CtoDPlugin, plugins, OpenAICtodService } from '../lib/index.js'

/**
 * @test npx esno ./examples/plugin.ts
 */

const apiKey = fs.readFileSync('./.openai-api-key', 'utf-8').trim()

const characterPlugin = new CtoDPlugin({
    name: 'character',
    params: () => {
        return {}
    },
    receiveData: zod => {
        return {
            character: zod.string()
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
    const character = await input({
        message: '請輸入角色名稱.',
        default: '派大星'
    })
    
    const action = await input({
        message: '你想對他問什麼？',
        default: '你最好的朋友是誰？'
    })

    const ctod = new CtoD({
        plugins: () => {
            return {
                character: characterPlugin.use({}),
                log: plugins.PrintLogPlugin.use({
                    detail: true
                })
            }
        },
        request: OpenAICtodService.createChatRequestWithJsonSchema({
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

    const broker = brokerBuilder.create(async({ zod, setMessages }) => {
        setMessages([
            {
                role: 'user',
                content: [
                    '請基於你的角色個性,並依據以下指令進行回應：',
                    action
                ]
            }
        ])
        return {
            message: zod.string()
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
