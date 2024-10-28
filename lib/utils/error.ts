type ParserFail = {
    name: string
    error: any
}

export class ParserError {
    isParserError = true
    parserFails: ParserFail[] = []
    error: any
    constructor(error: any, parserFails: ParserFail[]) {
        this.error = error
        this.parserFails = parserFails
    }
}
