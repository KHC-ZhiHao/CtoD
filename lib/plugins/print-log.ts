import { Broker35Plugin, Broker3Plugin } from '../core/plugin'

export default  {

    /**
     * @zh 用於 Broker3 的版本。
     * @en The version for Broker3.
     */

    ver3: new Broker3Plugin({
        name: 'print-log',
        params: () => {
            return {}
        },
        receiveData: () => {
            return {}
        },
        onInstall({ log, attach }) {
            attach('talkBefore', async({ prompt }) => {
                log.print('Send:', { color: 'green' })
                log.print(prompt)
            })
            attach('talkAfter', async({ parseText }) => {
                log.print('Receive:', { color: 'red' })
                log.print(parseText)
            })
            attach('succeeded', async({ output }) => {
                log.print('Output:', { color: 'yellow' })
                try {
                    log.print('\n' + JSON.stringify(output, null, 4))
                } catch (error) {
                    log.print('\n' + output)
                }
            })
        }
    }),

    /**
     * @zh 用於 Broker35 的版本。
     * @en The version for Broker35.
     */

    ver35: new Broker35Plugin({
        name: 'print-log',
        params: yup => {
            return {
                detail: yup.boolean().required().default(false)
            }
        },
        receiveData: () => {
            return {}
        },
        onInstall({ params, log, attach }) {
            attach('talkBefore', async({ lastUserMessage, messages }) => {
                log.print('Send:', { color: 'green' })
                if (params.detail) {
                    log.print('\n' + JSON.stringify(messages, null, 4))
                } else {
                    log.print('\n' + lastUserMessage)
                }
            })
            attach('talkAfter', async({ parseText }) => {
                log.print('Receive:', { color: 'cyan' })
                log.print('\n' + parseText)
            })
            attach('succeeded', async({ output }) => {
                log.print('Output:', { color: 'yellow' })
                try {
                    log.print('\n' + JSON.stringify(output, null, 4))
                } catch (error) {
                    log.print('\n' + output)
                }
            })
        }
    })
}
