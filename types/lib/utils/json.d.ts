export declare const parseJSONStream: <T>(data: string) => {
    items: T[];
    lastChunk: string;
};
