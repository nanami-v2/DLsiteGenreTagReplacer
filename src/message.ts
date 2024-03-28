
export enum MessageType {
    GetGenreWordConversionMap,
}

export interface Message {
    type: MessageType;
}

export class MessageGetGenreWordConversionMap implements Message {
    type: MessageType = MessageType.GetGenreWordConversionMap;
}