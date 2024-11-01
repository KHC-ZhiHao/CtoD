import * as Yup from 'yup';
import { Schema } from 'yup';
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
export declare const validateToJsonSchema: <T extends ValidateCallback<any>>(cb: T) => import("json-schema").JSONSchema7;
