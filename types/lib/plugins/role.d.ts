import { Broker35Plugin } from '../core/plugin';
declare const _default: {
    /**
     * @zh 用於 Broker35 的版本。
     * @en The version for Broker35.
     */
    ver35: Broker35Plugin<(yup: typeof import("yup")) => {
        role: import("yup").StringSchema<string, import("yup").AnyObject, undefined, "">;
    }, () => {}>;
};
export default _default;
