import { CtoD, LlamaCppCtodService } from '../lib/index.js'

/**
 * @test npx esno ./examples/llama.cpp.ts
 */

const ctod = new CtoD({
    request: LlamaCppCtodService.createChatRequestWithJsonSchema({
        config: {
            baseUrl: 'http://localhost:12333'
        }
    })
})

const brokerBuilder = ctod.createBrokerBuilder<{
    scene: string
}>({
    install: ({ attach }) => {
        attach('start', async({ setPreMessages }) => {
            setPreMessages([
                {
                    role: 'system',
                    content: 'You are now a game designer'
                },
                {
                    role: 'user',
                    content: 'I am designing an interactive game, but I am having trouble deciding what should happen next in the storyline'
                },
                {
                    role: 'assistant',
                    content: 'No problem, let me help you think about it.'
                }
            ])
        })
    }
})

const broker = brokerBuilder.create(async({ zod, data, setMessages }) => {
    setMessages([
        {
            role: 'user',
            content: data.scene || 'Feel free to improvise'
        }
    ])
    return {
        next: zod.array(zod.string()).describe('List of events that should happen next')
    }
})

broker.request({
    scene: 'Today Little Red Riding Hood encountered the Big Bad Wolf. The Big Bad Wolf wants to eat Little Red Riding Hood. What should Little Red Riding Hood do? Give me three events that should happen next'
}).then(result => {
    console.log(result.next)
})
