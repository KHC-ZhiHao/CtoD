import { ChatBrokerPlugin } from '../core/plugin'

export default new ChatBrokerPlugin({
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
        attach('start', async({ messages, changeMessages }) => {
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
