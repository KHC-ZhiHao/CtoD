import { ChatBrokerPlugin } from '../core/plugin'

export default new ChatBrokerPlugin({
    name: 'retry',
    params: yup => {
        return {
            retry: yup.number().required().default(1),
            printWarn: yup.boolean().required().default(true)
        }
    },
    receiveData: () => {
        return {}
    },
    onInstall({ log, attach, params }) {
        attach('parseFailed', async({ count, retry, messages, changeMessages }) => {
            if (count <= params.retry) {
                if (params.printWarn) {
                    log.print(`Is Failed, Retry ${count} times.`)
                }
                changeMessages(messages)
                retry()
            }
        })
    }
})
