
export enum AppMessageType {
    StartGenreWordConversion,
    GetConvertedGenreWordsRequest,
    GetConvertedGenreWordsResponse,
}

export interface AppMessage {
    type: AppMessageType;
}

export class AppMessageStartGenreWordConversion implements AppMessage {
    type: AppMessageType = AppMessageType.StartGenreWordConversion;
};

export class AppMessageGetConvertedGenreWordsRequest implements AppMessage {
    type : AppMessageType = AppMessageType.GetConvertedGenreWordsRequest;
    words: Array<string>  = [];

    constructor(words: Array<string>) {
        this.words = words;
    }
}

export class AppMessageGetConvertedGenreWordsResponse implements AppMessage {
    type          : AppMessageType = AppMessageType.GetConvertedGenreWordsResponse;
    originalWords : Array<string>  = [];
    convertedWords: Array<string>  = [];
    converted     : Array<boolean> = [];

    constructor(
        originalWords : Array<string>,
        convertedWords: Array<string>,
        converted     : Array<boolean>
    ) {
        this.originalWords  = originalWords;
        this.convertedWords = convertedWords;
        this.converted      = converted;
    }
}