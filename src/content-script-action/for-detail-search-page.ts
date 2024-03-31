
import { ContentScriptAction } from "../content-script-action";
import { GenreWordConverterFactory } from "../core/genre-word-converter-factory";
import { GenreWordReplacerFactory } from "../core/genre-word-replacer-factory";
import { GenreWordReplaceTargetPage } from "../core/genre-word-replace-target-page";
import { Message } from "../message";
import { MessageType } from "../message/type";
import {
    MessageDataGetConversionMapResponse,
    MessageDataGetConversionModeResponse,
} from "../message/data";
import { MessageFactory } from '../message-factory';


export class ContentScriptActionForDetailSearchPage implements ContentScriptAction {
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
                case MessageType.TabActivatedEvent:
                    return doReplaceGenreWords();
                case MessageType.TabUpdatedEvent:
                    return doReplaceGenreWords();
            }
        });
        /*
            ジャンルを選ぶと動的に要素が挿入されるので、mutatioObserver でトラッキング
            ジャンルの場合、search_detail_row は5番目
        */
        const searchDetailRows        = document.getElementsByClassName('search_detail_row');
        const mutationObserverTarget  = searchDetailRows[4];
        const mutationObserverOptions = {childList: true, subtree: true};
        const mutationObserver        = new MutationObserver((
            mutations: MutationRecord[],
            observer : MutationObserver
        ) => {
            console.log('mutationObserver', mutations, observer);
        
            doReplaceGenreWords();
        });
        mutationObserver.observe(
            mutationObserverTarget,
            mutationObserverOptions
        );
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
        .then((results: Array<any>) => {
            const conversionMap  = ((results[0] as Message).data as MessageDataGetConversionMapResponse ).conversionMap;
            const conversionMode = ((results[1] as Message).data as MessageDataGetConversionModeResponse).conversionMode;
        
            const wordConverterFactory = new GenreWordConverterFactory();
            const wordReplacerFactory  = new GenreWordReplacerFactory();
            const wordConverter        = wordConverterFactory.createGenreWordConverter(conversionMap, conversionMode);
            const wordReplacer         = wordReplacerFactory.createGenreWordReplacer(GenreWordReplaceTargetPage.DetailSearchPage);
        
            wordReplacer.replaceGenreWords(document, wordConverter);
        })
        .catch((err) => {
            console.log(err);
        });   
    }
    