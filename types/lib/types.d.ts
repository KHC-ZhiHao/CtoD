export declare type PromiseResponseType<T extends (...args: any) => Promise<any>, R = Parameters<ReturnType<T>['then']>[0]> = R extends (value: infer P) => any ? P : never;
