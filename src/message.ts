
import { MessageType } from './message/type'
import { MessageData } from './message/data';

export class Message {
    name: string;
    type: MessageType;
    data: MessageData | null;

    constructor(type: MessageType, data: MessageData | null) {
        this.name = MessageType[type];
        this.type = type;
        this.data = data;
    }
}