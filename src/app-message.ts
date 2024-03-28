
import { GenreWordConversionMap } from "./core/genre-word-conversion-map";
export enum AppMessageType {
    StartGenreWordConversion,
    GetGenreWordConversionMap,
    GetGenreWordConversionMapResponse,
    GetConvertedGenreWordsRequest,
    GetConvertedGenreWordsResponse,
}

export interface AppMessage {
    type: AppMessageType;
}

export class AppMessageGetGenreWordConversionMap implements AppMessage {
    type: AppMessageType = AppMessageType.GetGenreWordConversionMap;
}


export class AppMessageStartGenreWordConversion implements AppMessage {
    type: AppMessageType = AppMessageType.StartGenreWordConversion;
};

export class AppMessageGetConvertedGenreWordsRequest implements AppMessage {
    type         : AppMessageType = AppMessageType.GetConvertedGenreWordsRequest;
    originalWords: Array<string>  = [];

    constructor(originalWords: Array<string>) {
        this.originalWords = originalWords;
    }
}

export class AppMessageGetConvertedGenreWordsResponse implements AppMessage {
    type          : AppMessageType = AppMessageType.GetConvertedGenreWordsResponse;
    originalWords : Array<string>  = [];
    convertedWords: Array<string>  = [];
    isConverted   : Array<boolean> = [];

    constructor(
        originalWords : Array<string>,
        convertedWords: Array<string>,
        isConverted   : Array<boolean>
    ) {
        this.originalWords  = originalWords;
        this.convertedWords = convertedWords;
        this.isConverted    = isConverted;
    }
}