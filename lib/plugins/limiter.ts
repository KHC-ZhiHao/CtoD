import { ChatBrokerPlugin } from '../core/plugin'
import { Event, flow, Schedule } from 'power-helper'

type Events = {
    run: {
        id: string
    }
    waitTimeChange: {
        waitTime: number
    }
}

const config = {
    limit: 3,
    interval: 60000,
}

const state = {
    event: new Event<Events>(),
    schedule: null as Schedule | null,
    waitTimes: [] as number[],
    waitQueue: [] as string[]
}

export default {
    /**
     * @zh 你可以監聽一些事件行為，例如還需要等待多少時間。
     * @en You can listen for some event behaviors, such as how long you still need to wait.
     */

    event: state.event,

    /**
     * @zh 預設是每分鐘限制3次，你可以在設定中改變限制流量。
     * @en By default, the limit is 3 times per minute, and you can change the limit flow in the settings.
     */

    config,

    /**
     * @zh 由於排程會在背景持續倒數，如果有關閉程式的需求，需要手動進行移除。
     * @en Since the schedule will continue to count down in the background, if there is a need to close the program, you need to manually remove it.
     */

    closeSchedule: () => {
        if (state.schedule) {
            state.schedule.close()
            state.schedule = null
        }
    },

    /**
     * @zh Plugin 的接口
     * @en Plugin interface
     */

    plugin: new ChatBrokerPlugin({
        name: 'limiter',
        params: () => {
            return {}
        },
        receiveData: () => {
            return {}
        },
        onInstall({ attach }) {
            if (state.schedule == null) {
                state.schedule = new Schedule()
                state.schedule.add('calc queue', 1000, async() => {
                    const now = Date.now()
                    state.waitTimes = state.waitTimes.filter(time => {
                        return now - time < config.interval
                    })
                    if (state.waitTimes.length !== config.limit) {
                        let nextId = state.waitQueue.shift()
                        if (nextId) {
                            state.waitTimes.push(Date.now())
                            state.event.emit('run', {
                                id: nextId
                            })
                        }
                    } else if (state.waitTimes[0]) {
                        state.event.emit('waitTimeChange', {
                            waitTime: Math.floor(60 - (now - state.waitTimes[0]) / 1000)
                        })
                    }
                })
                state.schedule.play()
            }
            attach('talkBefore', async() => {
                const uid = flow.createUuid()
                state.waitQueue.push(uid)
                return new Promise(resolve => {
                    state.event.on('run', ({ id }, { off }) => {
                        if (id === uid) {
                            off()
                            resolve()
                        }
                    })
                })
            })
        }
    })
}
