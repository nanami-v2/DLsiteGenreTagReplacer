
import { MessageType } from './message/type'
import { MessageData } from './message/data';

export class Message {
    type: MessageType;
    data: MessageData | null;

    constructor(type: MessageType, data: MessageData | null) {
        this.type = type;
        this.data = data;
    }
}