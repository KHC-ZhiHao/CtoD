import { ChatBrokerPlugin } from '../core/plugin'

export default new ChatBrokerPlugin({
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
