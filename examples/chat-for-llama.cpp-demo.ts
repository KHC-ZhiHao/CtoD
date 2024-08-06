// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../lib/shims.d.ts" />
import { ChatBroker, Llama3Cpp, plugins } from '../lib/index'

const gameDesignerBroker = new ChatBroker({
    input: yup => {
        return {
            scene: yup.string()
        }
    },
    output: yup => {
        return {
            next: yup.array().of(yup.string().required()).required()
        }
    },
    plugins: {
        log: plugins.PrintLogPlugin.use({
            detail: true
        })
    },
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
    },
    /**
     * @zh createChatRequest 可以透過 output 自動推斷出要回傳的類型，不需要再額外提供型態
     */
    request: Llama3Cpp.createChatRequest({
        config: {
            baseUrl: 'http://localhost:12333'
        }
    }),
    question: async({ scene }) => {
        return scene || '任意發揮'
    }
})

gameDesignerBroker.request({
    scene: '今天小紅帽遇到了大野狼，大野狼要吃掉小紅帽，小紅帽要怎麼辦？給我三個下一步要發生的事件'
}).then(result => {
    console.log(result)
})
