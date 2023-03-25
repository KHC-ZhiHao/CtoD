/**
 * 獲取 Promise 的回傳值
 * @example
 * const foo = async() => {
 *  return 3
 * }
 * const bar: PromiseResponseType<typeof foo> = 3
 */
export declare type PromiseResponseType<T extends (...args: any) => Promise<any>, R = Parameters<ReturnType<T>['then']>[0]> = R extends (value: infer P) => any ? P : never;
