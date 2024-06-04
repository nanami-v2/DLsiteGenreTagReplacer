
import { ContentScriptAction } from "../content-script-action";
import { GenreWordConverter } from "../core/genre-word-converter";
import { GenreWordReplacerFactory } from "../core/genre-word-replacer-factory";
import { GenreWordReplaceTargetPage } from "../core/genre-word-replace-target-page";
import { Message } from "../message";
import { MessageType } from "../message/type";
import {
    MessageDataGetConversionMapResponse,
    MessageDataGetConversionModeResponse,
} from "../message/data";
import { MessageFactory } from '../message-factory';

export class ContentScriptActionForGenreListPage implements ContentScriptAction {
    public setup(): void {
        /*
            メッセージハンドラを登録
        */
        chrome.runtime.onMessage.addListener((
            message      : any,
            messageSender: chrome.runtime.MessageSender,
            sendResponse : (response: any) => void
        ) => {
            switch ((message as Message).type) {
                case MessageType.ContextMenuClickedEvent:
                    return doReplaceGenreWords();
            }
        });
        /*
            セットアップ完了を通知
        */
        const msgFactory = new MessageFactory();
        const msgEvent   = msgFactory.createMessageContentScriptSetuppedEvent();

        chrome.runtime
        .sendMessage(msgEvent)
        .catch((err) => console.error(err));
    }
    public excute(): void {
        doReplaceGenreWords();
    }
}

function doReplaceGenreWords() {
    const msgFactory                  = new MessageFactory();
    const msgGetConversionMapRequest  = msgFactory.createMessageGetConversionMapRequest();
    const msgGetConversionModeRequest = msgFactory.createMessageGetConversionModeRequest();

    Promise.all([
        chrome.runtime.sendMessage(msgGetConversionMapRequest),
        chrome.runtime.sendMessage(msgGetConversionModeRequest)
    ])
    .then((results: Array<Message>) => {
        const conversionMap  = (results[0].data as MessageDataGetConversionMapResponse ).conversionMap;
        const conversionMode = (results[1].data as MessageDataGetConversionModeResponse).conversionMode;
    
        const wordConverter       = new GenreWordConverter(conversionMap, conversionMode);
        const wordReplacerFactory = new GenreWordReplacerFactory();
        const wordReplacer        = wordReplacerFactory.createGenreWordReplacer(GenreWordReplaceTargetPage.GenreListPage);
    
        wordReplacer.replaceGenreWords(document, wordConverter);
    })
    .catch((err) => {
        console.error(err);
    });   
}
