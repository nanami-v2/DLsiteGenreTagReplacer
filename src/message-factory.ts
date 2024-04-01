import { GenreWordConversionMap } from "./core/genre-word-conversion-map";
import { GenreWordConversionMode } from "./core/genre-word-conversion-mode";
import { Message } from "./message";
import { MessageType } from "./message/type";
import {
    MessageDataGetConversionMapResponse,
    MessageDataGetConversionModeResponse,
} from "./message/data";


export class MessageFactory {
    public createMessageGetConversionMapRequest(): Message {
        const msgType = MessageType.GetConversionMapRequest;
        const msgData = null;

        return new Message(msgType, msgData);
    }
    public createMessageGetConversionMapResponse(conversionMap: GenreWordConversionMap): Message {
        const msgType = MessageType.GetConversionMapResponse;
        const msgData = new MessageDataGetConversionMapResponse(conversionMap);

        return new Message(msgType, msgData);
    }
    public createMessageGetConversionModeRequest(): Message {
        const msgType = MessageType.GetConversionModeRequest;
        const msgData = null;

        return new Message(msgType, msgData);
    }
    public createMessageGetConversionModeResponse(conversionMode: GenreWordConversionMode): Message {
        const msgType = MessageType.GetConversionModeRequest;
        const msgData = new MessageDataGetConversionModeResponse(conversionMode);

        return new Message(msgType, msgData);
    }
    public createMessageContentScriptSetuppedEvent(): Message {
        const msgType = MessageType.ContentScriptSetuppedEvent;
        const msgData = null;

        return new Message(msgType, msgData);
    }
    public createMessageContextMenuClickedEvent(): Message {
        const msgType = MessageType.ContextMenuClickedEvent;
        const msgData = null;

        return new Message(msgType, msgData);
    }
    public createMessageTabActivatedEvent(): Message {
        const msgType = MessageType.TabActivatedEvent;
        const msgData = null;

        return new Message(msgType, msgData);
    }
}