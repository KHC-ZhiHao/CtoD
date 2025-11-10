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
                    content: 'Please play the role of ' + character
                },
                {
                    role: 'assistant',
                    content: 'No problem, I am now ' + character
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
        message: 'Please enter the character name.',
        default: 'Patrick Star'
    })
    
    const action = await input({
        message: 'What would you like to ask them?',
        default: 'Who is your best friend?'
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
                    'Based on your character personality, please respond to the following instruction:',
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
