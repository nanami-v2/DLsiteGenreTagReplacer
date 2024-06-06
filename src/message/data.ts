import { GenreWordConversionMap } from "../core/genre-word-conversion-map";
import { GenreWordConversionMode } from "../core/genre-word-conversion-mode";

export interface MessageData {}

export class MessagDataeGetConversionMapRequest implements MessageData {
    langCode: string;

    constructor(langCode: string) {
        this.langCode = langCode;
    }
}

export class MessageDataGetConversionMapResponse implements MessageData {
    conversionMap: GenreWordConversionMap | null;

    constructor(conversionMap: GenreWordConversionMap | null) {
        this.conversionMap = conversionMap;
    }
}

export class MessageDataGetConversionModeResponse implements MessageData {
    conversionMode: GenreWordConversionMode;

    constructor(conversionMode: GenreWordConversionMode) {
        this.conversionMode = conversionMode;
    }
}