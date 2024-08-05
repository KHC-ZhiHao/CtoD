import { ChatBroker, Llama3Cpp, templates } from '../lib/index'

export const gameBroker = new ChatBroker({
    input: yup => {
        return {
            theme: yup.string(),
            // 場景
            scene: yup.string(),
            // 人物
            users: yup.array().of(yup.object({
                name: yup.string().required(),
                info: yup.string().required()
            })).required(),
            // 歷史
            histories: yup.array().of(yup.object({
                role: yup.string().required(),
                message: yup.string().required()
            })).required()
        }
    },
    output: yup => {
        return {
            next: yup.array().of(yup.string().required()).required()
        }
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
    request: Llama3Cpp.createChatRequest({
        baseUrl: 'https://llama3.com'
    }),
    question: async() => {
        return templates.requireJsonResponse([
            '今天小紅帽遇到了大野狼，大野狼要吃掉小紅帽，小紅帽要怎麼辦？給我三個下一步要發生的事件：'
        ], {
            next: {
                desc: '下一段劇情的選項',
                example: 'string[]'
            }
        })
    }
})
