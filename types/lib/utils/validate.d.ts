import { z } from 'zod';
export type ValidateCallback<T extends Record<string, z.ZodTypeAny>> = (_z: typeof z) => {
    [K in keyof T]: T[K];
};
export type ValidateCallbackOutputs<T extends ValidateCallback<any>, R = ReturnType<T>> = {
    [K in keyof R]: R[K] extends z.ZodTypeAny ? z.infer<R[K]> : R[K];
};
export declare function definedValidateSchema<T extends ValidateCallback<any>>(cb: T): T;
export declare function validate<T extends ValidateCallback<any>, R = ReturnType<T>>(target: any, schemaCallback: T): { [K in keyof R]: R[K] extends z.ZodTypeAny ? z.infer<R[K]> : R[K]; };
export declare function validateToJsonSchema<T extends ValidateCallback<any>>(target: () => T): z.core.JSONSchema.JSONSchema;
