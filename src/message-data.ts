import { MessageType } from "./message-type";

export interface MessageData {}

export class MessageDataGetGenreWordConversionMap implements MessageData {
}

export class MessageDataGetGenreWordConversionMode implements MessageData {    
}

export class MessageDataReplaceGenreWord implements MessageData {    
}

export class MessageDataEchoMessage implements MessageData {
    msgType: MessageType;
    msgData: MessageData;

    constructor(msgType: MessageType, msgData: MessageData) {
        this.msgType = msgType;
        this.msgData = msgData;
    }
}