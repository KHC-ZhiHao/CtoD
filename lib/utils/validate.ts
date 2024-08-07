import * as Yup from 'yup'
import { pick } from 'power-helper'
import { convertSchema } from '@sodaru/yup-to-json-schema'
import type { Schema } from 'yup'

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

/**
 * @zh 將 JSON Schema 設定描述，可以指定深層結構，例如 user.name, user.level 等。
 * @en Set the JSON Schema description, you can specify deep structures, such as user.name, user.level, etc.
 */

type Info = {
    desc?: Record<string, string | {
        description?: string
        examples?: any
    }>
}

export const validateToJsonSchema = <T extends ValidateCallback<any>>(cb: T, info?: Info) => {
    const bodySchemaBindDoc = (schema: ReturnType<typeof convertSchema>, doc: Info) => {
        if (doc && doc.desc) {
            for (let key in doc.desc) {
                if (schema.properties) {
                    let target = pick.peel(schema.properties, key.replaceAll('.', '.properties.'))
                    if (target && target !== true) {
                        let d = doc.desc[key]
                        if (typeof d === 'object') {
                            if (d.description) {
                                target.description = d.description
                            }
                            if (d.examples) {
                                target.examples = d.examples
                            }
                        } else if (typeof d === 'string') {
                            target.description = d
                        }
                    }
                }
            }
        }
        return schema
    }
    const jsonSchema = convertSchema(Yup.object(cb(Yup)))
    delete jsonSchema.default
    return info ? bodySchemaBindDoc(jsonSchema, info) : jsonSchema
}
