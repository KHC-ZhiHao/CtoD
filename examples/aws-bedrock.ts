import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'
import { paragraph, CtoD, validateToJsonSchema, AnthropicChatDataGenerator, plugins } from '../lib/index.js'

/**
 * @test npx esno ./examples/aws-bedrock
 * Must manually install '@aws-sdk/client-bedrock-runtime' package
 */

const ctod = new CtoD({
    plugins: () => {
        return {
            retry: plugins.RetryPlugin.use({
                retry: 3,
                printWarn: true
            })
        }
    },
    request: async (message, { abortController, schema }) => {
        const dataGenerator = new AnthropicChatDataGenerator(() => {
            return {
                model: '',
                maxTokens: 8192,
                thinking: false,
                temperature: 0.7
            }
        })
        const client = new BedrockRuntimeClient({})
        const jsonSchema = validateToJsonSchema(schema.output)
        const body = dataGenerator.createChatAndStructureBody(message, jsonSchema)
        const input = {
            modelId: 'apac.anthropic.claude-sonnet-4-20250514-v1:0',
            contentType: 'application/json',
            accept: 'application/json',
            body: JSON.stringify({
                ...body,
                model: undefined, // anthropic model is determined by modelId
                anthropic_version: 'bedrock-2023-05-31',
            })
        }
        const command = new InvokeModelCommand(input)
        const response = await client.send(command, {
            abortSignal: abortController.signal
        })
        const result = JSON.parse(new TextDecoder().decode(response.body))
        return dataGenerator.parseChatAndStructureResult(result)
    }
})

const brokerBuilder = ctod.createBrokerBuilder<{
    indexes: string[]
    question: string
}>({
    install: ({ attach }) => {
        attach('start', async ({ setPreMessages }) => {
            setPreMessages([
                {
                    role: 'system',
                    content: 'You are now a pharmacist skilled at categorizing indexes'
                }
            ])
        })
    }
})

const broker = brokerBuilder.create(async ({ zod, data, setMessages }) => {
    const { indexes, question } = data
    setMessages([
        {
            role: 'user',
            contents: [
                {
                    type: 'text',
                    content: paragraph([
                        'I have the following indexes',
                        `${JSON.stringify(indexes)}`,
                        `Please help me analyze which index "${question}" might belong to`,
                        'And sort by relevance from high to low with a score ranging from 0 to 1'
                    ])
                }
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
