export type PromiseResponseType<T extends (..._args: any) => Promise<any>, R = Parameters<ReturnType<T>['then']>[0]> = R extends (_value: infer P) => any ? P : never;
