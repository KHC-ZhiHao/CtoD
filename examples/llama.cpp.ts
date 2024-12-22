import { CtoD, Llama3Cpp } from '../lib/index'

/**
 * @test npx esno ./examples/llama.cpp.ts
 */

const ctod = new CtoD({
    request: Llama3Cpp.createChatRequest({
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
                    content: '你現在是一個遊戲設計師'
                },
                {
                    role: 'user',
                    content: '我在設計一個互動式遊戲，但我現在對於劇情下一步要發生什麼事情遇到了困難'
                },
                {
                    role: 'assistant',
                    content: '沒問題，我來幫你想想看。'
                }
            ])
        })
    }
})

const broker = brokerBuilder.create(async({ yup, data, setMessages }) => {
    setMessages([
        {
            role: 'user',
            content: data.scene || '任意發揮'
        }
    ])
    return {
        next: yup.array().of(yup.string().required()).required()
    }
})

broker.request({
    scene: '今天小紅帽遇到了大野狼，大野狼要吃掉小紅帽，小紅帽要怎麼辦？給我三個下一步要發生的事件'
}).then(result => {
    console.log(result.next)
})
