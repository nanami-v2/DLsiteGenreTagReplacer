
import { MessageType } from './message-type'
import { MessageData } from './message-data';

export class Message {
    type: MessageType;
    data: MessageData;

    constructor(type: MessageType, data: MessageData) {
        this.type = type;
        this.data = data;
    }
}