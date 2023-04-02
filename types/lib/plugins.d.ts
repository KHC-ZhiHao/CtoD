import { Broker35Plugin, Broker3Plugin } from './core/plugin';
/**
 * @zh 一個基於印出 log 的 plugin。
 * @en A plugin based on printing log.
 */
export declare const PrintLogPlugin: {
    /**
     * @zh 用於 Broker3 的版本。
     * @en The version for Broker3.
     */
    ver3: Broker3Plugin<() => {}>;
    /**
     * @zh 用於 Broker35 的版本。
     * @en The version for Broker35.
     */
    ver35: Broker35Plugin<() => {}>;
};