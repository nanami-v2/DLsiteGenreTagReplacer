
export enum MessageType {
    GetGenreWordConversionMap,
    GetGenerWordConversionMode,
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