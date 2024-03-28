
export enum MessageType {
    GetGenreWordConversionMap,
    GetGenerWordConversionMode,
    ReplaceGenreWord,
}

export interface Message {
    type: MessageType;
}

export class MessageGetGenreWordConversionMap implements Message {
    type: MessageType = MessageType.GetGenreWordConversionMap;
}

export class MessageGetGenreWordConversionMode implements Message {
    type: MessageType = MessageType.GetGenerWordConversionMode;
}

export class MessageReplaceGenreWord implements Message {
    type: MessageType = MessageType.ReplaceGenreWord;
}