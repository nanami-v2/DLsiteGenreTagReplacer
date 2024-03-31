
import { Message } from "../message";
import { GenreWordConversionMap } from "../core/genre-word-conversion-map";
import { GenreWordConversionMode } from "../core/genre-word-conversion-mode";
import { GenreWordConverterFactory } from "../core/genre-word-converter-factory";
import { GenreWordReplacerFactory } from "../core/genre-word-replacer-factory";
import { GenreWordReplaceTargetPage } from "../core/genre-word-replace-target-page";
import { MessageType } from "../message-type";
import { MessageDataGetGenreWordConversionMap, MessageDataGetGenreWordConversionMode } from "../message-data";
import { ContentScriptAction } from "../content-script-action";

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
                case MessageType.ContextMenuClicked:
                    return doReplaceGenreWords();
                case MessageType.PageTabActivated:
                    return doReplaceGenreWords();
                case MessageType.PageTabUpdated:
                    return doReplaceGenreWords();
            }
        });
    }
    public excute(): void {
        doReplaceGenreWords();
    }
}

function doReplaceGenreWords() {
    const msgTypeGetGenreConversionMap  = MessageType.GetGenreWordConversionMap;
    const msgTypeGenGenreConversionMode = MessageType.GetGenerWordConversionMode;
    const msgDataGetGenreConversionMap  = new MessageDataGetGenreWordConversionMap();
    const msgDataGetGenreConversionMode = new MessageDataGetGenreWordConversionMode();

    Promise.all([
        chrome.runtime.sendMessage(
            new Message(
                msgTypeGetGenreConversionMap,
                msgDataGetGenreConversionMap
            )
        ),
        chrome.runtime.sendMessage(
            new Message(
                msgTypeGenGenreConversionMode,
                msgDataGetGenreConversionMode
            )
        )
    ])
    .then((results: Array<any>) => {
        const conversionMap  = results[0] as GenreWordConversionMap;
        const conversionMode = results[1] as GenreWordConversionMode;
    
        const wordConverterFactory = new GenreWordConverterFactory();
        const wordReplacerFactory  = new GenreWordReplacerFactory();
        const wordConverter        = wordConverterFactory.createGenreWordConverter(conversionMap, conversionMode);
        const wordReplacer         = wordReplacerFactory.createGenreWordReplacer(GenreWordReplaceTargetPage.GenreListPage);
    
        wordReplacer.replaceGenreWords(document, wordConverter);
    })
    .catch((err) => {
        console.log(err);
    });   
}
