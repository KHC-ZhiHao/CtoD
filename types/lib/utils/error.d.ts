declare type ParserFail = {
    name: string;
    error: any;
};
export declare class ParserError {
    isParserError: boolean;
    parserFails: ParserFail[];
    error: any;
    constructor(error: any, parserFails: ParserFail[]);
}
export {};
