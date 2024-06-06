
import { ContentScriptAction } from "../content-script-action";
import { GenreWordConverter } from "../core/genre-word-converter";
import { GenreWordReplacer } from "../core/genre-word-replacer";
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
        const msgEvent   = msgFactory.createContentScriptSetuppedEvent();

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
    const msgGetConversionMapRequest  = msgFactory.createGetConversionMapRequest(document.documentElement.lang);
    const msgGetConversionModeRequest = msgFactory.createGetConversionModeRequest();

    Promise.all([
        chrome.runtime.sendMessage(msgGetConversionMapRequest),
        chrome.runtime.sendMessage(msgGetConversionModeRequest)
    ])
    .then((results: Array<Message>) => {
        const conversionMap  = (results[0].data as MessageDataGetConversionMapResponse ).conversionMap;
        const conversionMode = (results[1].data as MessageDataGetConversionModeResponse).conversionMode;
    
        if (!conversionMap)
            return;

        const wordConverter = new GenreWordConverter(conversionMap, conversionMode);
        const wordReplacer  = new GenreWordReplacer(GenreWordReplaceTargetPage.GenreListPage);
    
        wordReplacer.replaceGenreWords(document, wordConverter);
    })
    .catch((err) => {
        console.error(err);
    });   
}
