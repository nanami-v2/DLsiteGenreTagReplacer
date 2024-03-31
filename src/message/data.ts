import { GenreWordConversionMap } from "../core/genre-word-conversion-map";
import { GenreWordConversionMode } from "../core/genre-word-conversion-mode";

export interface MessageData {}

export class MessageDataGetConversionMapRequest implements MessageData {
}

export class MessageDataGetConversionMapResponse implements MessageData {
    conversionMap: GenreWordConversionMap;

    constructor(conversionMap: GenreWordConversionMap) {
        this.conversionMap = conversionMap;
    }
}

export class MessageDataGetConversionModeRequest implements MessageData {
}

export class MessageDataGetConversionModeResponse implements MessageData {
    conversionMode: GenreWordConversionMode;

    constructor(conversionMode: GenreWordConversionMode) {
        this.conversionMode = conversionMode;
    }
}

export class MessageDataContextMenuClickedEvent implements MessageData {
}

export class MessageDataTabActivatedEvent implements MessageData {    
}

export class MessageDataTabUpdatedEvent implements MessageData {
}