import * as Yup from 'yup';
import type { Schema } from 'yup';
export declare type ValidateCallback<T extends Record<string, Schema>> = (_yup: typeof Yup) => {
    [K in keyof T]: T[K];
};
export declare type ValidateCallbackOutputs<T extends ValidateCallback<any>, R = ReturnType<T>> = {
    [K in keyof R]: R[K] extends {
        '__outputType': any;
    } ? R[K]['__outputType'] : unknown;
};
export declare function definedValidateSchema<T extends ValidateCallback<any>>(cb: T): T;
export declare function validate<T extends ValidateCallback<any>, R = ReturnType<T>>(target: any, schemaCallback: T): { [K in keyof R]: R[K] extends {
    __outputType: any;
} ? R[K]["__outputType"] : unknown; };
/**
 * @zh 將 JSON Schema 設定描述，可以指定深層結構，例如 user.name, user.level 等。
 * @en Set the JSON Schema description, you can specify deep structures, such as user.name, user.level, etc.
 */
export declare type JsonSchemaInfo = {
    desc?: Record<string, string | {
        description?: string;
        examples?: any;
    }>;
};
export declare const validateToJsonSchema: <T extends ValidateCallback<any>>(cb: T, info?: JsonSchemaInfo) => import("json-schema").JSONSchema7;
