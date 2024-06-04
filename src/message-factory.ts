import { GenreWordConversionMap } from "./core/genre-word-conversion-map";
import { GenreWordConversionMode } from "./core/genre-word-conversion-mode";
import { Message } from "./message";
import { MessageType } from "./message/type";
import {
    MessagDataeGetConversionMapRequest,
    MessageDataGetConversionMapResponse,
    MessageDataGetConversionModeResponse,
} from "./message/data";


export class MessageFactory {
    public createGetConversionMapRequest(langCode: string): Message {
        const msgType = MessageType.GetConversionMapRequest;
        const msgData = new MessagDataeGetConversionMapRequest(langCode);

        return new Message(msgType, msgData);
    }
    public createGetConversionMapResponse(conversionMap: GenreWordConversionMap): Message {
        const msgType = MessageType.GetConversionMapResponse;
        const msgData = new MessageDataGetConversionMapResponse(conversionMap);

        return new Message(msgType, msgData);
    }
    public createGetConversionModeRequest(): Message {
        const msgType = MessageType.GetConversionModeRequest;
        const msgData = null;

        return new Message(msgType, msgData);
    }
    public createGetConversionModeResponse(conversionMode: GenreWordConversionMode): Message {
        const msgType = MessageType.GetConversionModeRequest;
        const msgData = new MessageDataGetConversionModeResponse(conversionMode);

        return new Message(msgType, msgData);
    }
    public createContentScriptSetuppedEvent(): Message {
        const msgType = MessageType.ContentScriptSetuppedEvent;
        const msgData = null;

        return new Message(msgType, msgData);
    }
    public createContextMenuClickedEvent(): Message {
        const msgType = MessageType.ContextMenuClickedEvent;
        const msgData = null;

        return new Message(msgType, msgData);
    }
}