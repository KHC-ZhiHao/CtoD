import fs from 'fs'
import { Anthropic } from '@anthropic-ai/sdk'
import { CtoD, AnthropicCtodService, plugins } from '../lib/index.js'

/**
 * @test npx esno ./examples/anthropic.ts
 * Must manually install '@anthropic-ai/sdk' package
 */

const apiKey = fs.readFileSync('./.anthropic-api-key', 'utf-8').trim()

const ctod = new CtoD({
    plugins: () => {
        return {
            retry: plugins.RetryPlugin.use({
                retry: 3,
                printWarn: true
            })
        }
    },
    request: AnthropicCtodService.createChatRequestWithJsonSchema({
        config: {
            model: 'claude-3-5-haiku-latest'
        },
        anthropicSdk: new Anthropic({
            apiKey
        })
    })
})

const brokerBuilder = ctod.createBrokerBuilder<{
    indexes: string[]
    question: string
}>({
    install: ({ attach }) => {
        attach('start', async({ setPreMessages }) => {
            setPreMessages([
                {
                    role: 'system',
                    content: 'You are now a pharmacist skilled at categorizing indexes'
                }
            ])
        })
    }
})

const broker = brokerBuilder.create(async({ zod, data, setMessages }) => {
    const { indexes, question } = data
    setMessages([
        {
            role: 'user',
            content: [
                'I have the following indexes',
                `${JSON.stringify(indexes)}`,
                `Please help me analyze which index "${question}" might belong to`,
                'And sort by relevance from high to low with a score ranging from 0 to 1'
            ]
        }
    ])
    const item = zod.object({
        name: zod.string().describe('Index name'),
        score: zod.number().describe('Rating score')
    })
    return {
        indexes: zod.array(item).describe('Indexes sorted from high to low')
    }
})

broker.request({
    indexes: ['Stomach pain', 'Lower back pain', 'Headache', 'Sore throat', 'Limb pain'],
    question: 'Drinking coffee, eating sweets, acid reflux'
}).then(e => {
    console.log('Output result:', e.indexes)
    /*
        [
            {
                name: 'Stomach pain',
                score: 1
            },
            {
                name: 'Sore throat',
                score: 0.7
            },
            ...
        ]
     */
}).catch(error => {
    console.error('Error:', error)
})
