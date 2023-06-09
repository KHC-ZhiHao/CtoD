import { Broker35Plugin } from '../core/plugin'

export default {
    /**
     * @zh 用於 Broker35 的版本。
     * @en The version for Broker35.
     */

    ver35: new Broker35Plugin({
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
            attach('parseFailed', async({ count, retry, response, changeMessages }) => {
                if (count <= params.retry) {
                    if (params.printWarn) {
                        log.print(`Is Failed, Retry ${count} times.`)
                    }
                    changeMessages(response.newMessages.slice(0, -1))
                    retry()
                }
            })
        }
    })    
}
