import { z, toJSONSchema } from 'zod'

export type ValidateCallback<T extends Record<string, z.ZodTypeAny>> = (_z: typeof z) => {
    [K in keyof T]: T[K]
}

export type ValidateCallbackOutputs<
    T extends ValidateCallback<any>,
    R = ReturnType<T>
> = {
    [K in keyof R]: R[K] extends z.ZodTypeAny ? z.infer<R[K]> : R[K]
}

export function definedValidateSchema<T extends ValidateCallback<any>>(cb: T): T {
    return cb
}

export function validate<
    T extends ValidateCallback<any>,
    R = ReturnType<T>
>(target: any, schemaCallback: T) {
    return z.object(schemaCallback(z)).parse(target || {}) as {
        [K in keyof R]: R[K] extends z.ZodTypeAny ? z.infer<R[K]> : R[K]
    }
}

export function validateToJsonSchema<T extends ValidateCallback<any>>(target: () => T) {
    const schema = toJSONSchema(z.object(target()))
    delete schema.$schema
    return schema
}
