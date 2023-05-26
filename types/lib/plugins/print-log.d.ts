import { Broker35Plugin, Broker3Plugin } from '../core/plugin';
declare const _default: {
    /**
     * @zh 用於 Broker3 的版本。
     * @en The version for Broker3.
     */
    ver3: Broker3Plugin<() => {}, () => {}>;
    /**
     * @zh 用於 Broker35 的版本。
     * @en The version for Broker35.
     */
    ver35: Broker35Plugin<(yup: typeof import("yup")) => {
        detail: import("yup").BooleanSchema<boolean, import("yup").AnyObject, false, "d">;
    }, () => {}>;
};
export default _default;
