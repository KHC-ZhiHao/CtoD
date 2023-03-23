import * as Yup from 'yup'
import type { Schema } from 'yup'

export type ValidateCallback<T extends Record<string, Schema>> = (_yup: typeof Yup) => {
    [K in keyof T]: T[K]
}

export type ValidateCallbackOutputs<
    T extends ValidateCallback<any>,
    R = ReturnType<T>
> = {
    [K in keyof R]: R[K] extends Schema ? R[K]['__outputType'] : unknown
}

export function definedValidateSchema<T extends ValidateCallback<any>>(cb: T): T {
    return cb
}

export function validate<
    T extends ValidateCallback<any>,
    R = ReturnType<T>
>(target: any, schemaCallback: T) {
    return Yup.object(schemaCallback(Yup)).required().validateSync(target || {}) as {
        [K in keyof R]: R[K] extends Schema ? R[K]['__outputType'] : unknown
    }
}
