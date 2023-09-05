import { ChatBrokerPlugin } from '../core/plugin';
declare type Events = {
    run: {
        id: string;
    };
    waitTimeChange: {
        waitTime: number;
    };
};
declare const _default: {
    /**
     * @zh 你可以監聽一些事件行為，例如還需要等待多少時間。
     * @en You can listen for some event behaviors, such as how long you still need to wait.
     */
    event: import("power-helper/dist/modules/event").Event<Events>;
    /**
     * @zh 預設是每分鐘限制3次，你可以在設定中改變限制流量。
     * @en By default, the limit is 3 times per minute, and you can change the limit flow in the settings.
     */
    config: {
        limit: number;
        interval: number;
    };
    /**
     * @zh 由於排程會在背景持續倒數，如果有關閉程式的需求，需要手動進行移除。
     * @en Since the schedule will continue to count down in the background, if there is a need to close the program, you need to manually remove it.
     */
    closeSchedule: () => void;
    /**
     * @zh Plugin 的接口
     * @en Plugin interface
     */
    plugin: ChatBrokerPlugin<() => {}, () => {}>;
};
export default _default;
