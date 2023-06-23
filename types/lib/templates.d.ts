declare type JsonResponseFormat = {
    desc: string;
    example: any;
};
/**
 * @zh 協助使用者將格式需求轉成論敘語句。
 * @en Assist the user in converting the formatting requirements into declarative sentences.
 */
export declare const requireJsonResponse: (question: string | string[], format: Record<string, JsonResponseFormat>) => string;
/**
 * @zh 協助使用者將格式需求轉成論敘語句，支援 Handlebars。
 * @en Assist the user in converting the formatting requirements into declarative sentences, support Handlebars.
 */
export declare const requireJsonResponseWithHandlebars: (value: Record<string, any>, question: string | string[], format: Record<string, JsonResponseFormat>) => string;
export {};
