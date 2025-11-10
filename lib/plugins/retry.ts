import { ChatBrokerPlugin } from '../core/plugin.js'

export default new ChatBrokerPlugin({
    name: 'retry',
    params: z => {
        return {
            retry: z.number().default(1),
            printWarn: z.boolean().default(true)
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
