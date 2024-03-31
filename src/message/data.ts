import { GenreWordConversionMap } from "../core/genre-word-conversion-map";
import { GenreWordConversionMode } from "../core/genre-word-conversion-mode";

export interface MessageData {}

export class MessageDataGetConversionMapResponse implements MessageData {
    conversionMap: GenreWordConversionMap;

    constructor(conversionMap: GenreWordConversionMap) {
        this.conversionMap = conversionMap;
    }
}

export class MessageDataGetConversionModeResponse implements MessageData {
    conversionMode: GenreWordConversionMode;

    constructor(conversionMode: GenreWordConversionMode) {
        this.conversionMode = conversionMode;
    }
}

export class MessageDataUpdateTabTitleRequest implements MessageData {
    newTitle: string;

    constructor(newTitle: string) {
        this.newTitle = newTitle;
    }
}

export class MessageDataUpdateTabTitleResponse implements MessageData {
    oldTitle: string;
    newTitle: string;

    constructor(oldTitle: string, newTitle: string) {
        this.oldTitle = oldTitle;
        this.newTitle = newTitle;
    }
}