import { Broker35Plugin } from '../core/plugin';
declare const _default: {
    /**
     * @zh 用於 Broker35 的版本。
     * @en The version for Broker35.
     */
    ver35: Broker35Plugin<(yup: typeof import("yup")) => {
        retry: import("yup").NumberSchema<number, import("yup").AnyObject, 1, "d">;
        printWarn: import("yup").BooleanSchema<boolean, import("yup").AnyObject, true, "d">;
    }, () => {}>;
};
export default _default;
