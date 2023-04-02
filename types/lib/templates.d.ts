declare type JsonResponseFormat = {
    desc: string;
    example: any;
};
/**
 * @zh 協助使用者將格式需求轉成論敘語句。
 * @en Assist the user in converting the formatting requirements into declarative sentences.
 */
export declare const requireJsonResponse: (question: string | string[], format: Record<string, JsonResponseFormat>) => string;
export {};
