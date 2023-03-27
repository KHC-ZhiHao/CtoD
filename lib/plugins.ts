import { Log } from 'power-helper'
import { Broker35Plugin, Broker3Plugin } from './core/plugin'

/**
 * @zh 一個基於印出 log 的 plugin。
 */

export const PrintLogPlugin = {
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
        }
    }),
    ver35: new Broker35Plugin({
        name: 'print-log',
        params: () => {
            return {}
        },
        onInstall({ attach }) {
            const log = new Log('print-log-plugin')
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
