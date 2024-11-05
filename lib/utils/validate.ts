import * as Yup from 'yup'
import { convertSchema } from '@sodaru/yup-to-json-schema'
import { Schema } from 'yup'

export type ValidateCallback<T extends Record<string, Schema>> = (_yup: typeof Yup) => {
    [K in keyof T]: T[K]
}

export type ValidateCallbackOutputs<
    T extends ValidateCallback<any>,
    R = ReturnType<T>
> = {
    [K in keyof R]: R[K] extends { '__outputType': any } ? R[K]['__outputType'] : unknown
}

export function definedValidateSchema<T extends ValidateCallback<any>>(cb: T): T {
    return cb
}

export function validate<
    T extends ValidateCallback<any>,
    R = ReturnType<T>
>(target: any, schemaCallback: T) {
    return Yup.object(schemaCallback(Yup)).required().validateSync(target || {}) as {
        [K in keyof R]: R[K] extends { '__outputType': any } ? R[K]['__outputType'] : unknown
    }
}

export const definedYupSchema = <T extends ValidateCallback<any>>(cb: T) => {
    return cb(Yup)
}

export const validateToJsonSchema = <T extends ValidateCallback<any>>(cb: T) => {
    const removeAllDefault = (schema: any) => {
        if (schema.default) {
            delete schema.default
        }
        if (schema.properties) {
            for (let key in schema.properties) {
                if (schema.properties[key].default) {
                    delete schema.properties[key].default
                }
                removeAllDefault(schema.properties[key])
            }
        }
        if (schema.items) {
            removeAllDefault(schema.items)
        }
    }
    const addAllAdditionalProperties = (jsonSchema: any) => {
        if (jsonSchema.type === 'object') {
            jsonSchema.additionalProperties = false
            for (const key in jsonSchema.properties) {
                addAllAdditionalProperties(jsonSchema.properties[key])
            }
        } else if (jsonSchema.type === 'array') {
            addAllAdditionalProperties(jsonSchema.items)
        }
    }
    const jsonSchema = convertSchema(Yup.object(cb(Yup)))
    removeAllDefault(jsonSchema)
    addAllAdditionalProperties(jsonSchema)
    return jsonSchema
}
