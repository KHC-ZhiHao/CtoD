import { Log } from 'power-helper'
import { Broker35Plugin, Broker3Plugin } from './core/plugin'

/**
 * @zh 一個基於印出 log 的 plugin。
 * @en A plugin based on printing log.
 */

export const PrintLogPlugin = {

    /**
     * @zh 用於 Broker3 的版本。
     * @en The version for Broker3.
     */

    ver3: new Broker3Plugin({
        name: 'print-log',
        params: () => {
            return {}
        },
        onInstall({ attach }) {
            const log = new Log('print-log-plugin')
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
        params: () => {
            return {}
        },
        onInstall({ log, attach }) {
            attach('talkBefore', async({ lastUserMessage }) => {
                log.print('Send:', { color: 'green' })
                log.print('\n' + lastUserMessage)
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

export const retryPlugin = new Broker35Plugin({
    name: 'retry',
    params: yup => {
        return {
            retry: yup.number().required().default(1),
            warn: yup.boolean().required().default(true)
        }
    },
    onInstall({ log, attach, params }) {
        attach('parseFailed', async({ count, retry, response, changeMessages }) => {
            if (count <= params.retry) {
                if (params.warn) {
                    log.print(`回傳錯誤，正在重試: ${count} 次`)
                }
                changeMessages([response.newMessages[0]])
                retry()
            }
        })
    }
})
