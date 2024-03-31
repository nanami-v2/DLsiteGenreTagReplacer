import { GenreWordConversionMap } from "./core/genre-word-conversion-map";
import { GenreWordConversionMode } from "./core/genre-word-conversion-mode";
import { Message } from "./message";
import { MessageType } from "./message/type";
import {
    MessageDataContextMenuClickedEvent,
    MessageDataGetConversionMapRequest,
    MessageDataGetConversionMapResponse,
    MessageDataGetConversionModeRequest,
    MessageDataGetConversionModeResponse,
    MessageDataTabActivatedEvent,
    MessageDataTabUpdatedEvent
} from "./message/data";


export class MessageFactory {
    public createMessageGetConversionMapRequest(): Message {
        const msgType = MessageType.GetConversionMapRequest;
        const msgData = new MessageDataGetConversionMapRequest();

        return new Message(msgType, msgData);
    }
    public createMessageGetConversionMapResponse(conversionMap: GenreWordConversionMap): Message {
        const msgType = MessageType.GetConversionMapResponse;
        const msgData = new MessageDataGetConversionMapResponse(
            conversionMap
        );

        return new Message(msgType, msgData);
    }
    public createMessageGetConversionModeRequest(): Message {
        const msgType = MessageType.GetConversionModeRequest;
        const msgData = new MessageDataGetConversionModeRequest();

        return new Message(msgType, msgData);
    }
    public createMessageGetConversionModeResponse(conversionMode: GenreWordConversionMode): Message {
        const msgType = MessageType.GetConversionModeRequest;
        const msgData = new MessageDataGetConversionModeResponse(
            conversionMode
        );

        return new Message(msgType, msgData);
    }
    public createMessageContextMenuClickedEvent(): Message {
        const msgType = MessageType.ContextMenuClickedEvent;
        const msgData = new MessageDataContextMenuClickedEvent();

        return new Message(msgType, msgData);
    }
    public createMessageTabActivatedEvent(): Message {
        const msgType = MessageType.TabActivatedEvent;
        const msgData = new MessageDataTabActivatedEvent();

        return new Message(msgType, msgData);
    }
    public createMessagePgaeTabUpdatedEvent(): Message {
        const msgType = MessageType.TabUpdatedEvent;
        const msgData = new MessageDataTabUpdatedEvent();

        return new Message(msgType, msgData);
    }
}