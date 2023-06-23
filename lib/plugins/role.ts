import { Broker35Plugin } from '../core/plugin'

export default {
    /**
     * @zh 用於 Broker35 的版本。
     * @en The version for Broker35.
     */

    ver35: new Broker35Plugin({
        name: 'role',
        params: yup => {
            return {
                role: yup.string().required()
            }
        },
        receiveData: () => {
            return {}
        },
        onInstall({ attach, params }) {
            attach('talkFirst', async({ messages, changeMessages }) => {
                changeMessages([
                    {
                        role: 'user',
                        content: `你現在是${params.role}。`
                    },
                    {
                        role: 'assistant',
                        content: `沒問題，我現在是${params.role}，有什麼可以幫你的嗎？`
                    },
                    ...messages
                ])
            })
        }
    })    
}
