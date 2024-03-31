
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

export class ContentScriptActionForSearchResultPage implements ContentScriptAction {
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
            「他のジャンルで探す」などの場合、サーバーから取得したデータを基にダイアログを作成している。
            なので、このような場合にも表記を変えるため、mutatioObserver で対象のノード――検索モーダル――を監視する必要がある。
        
            その対象であるが、id="wrapper"の次のノードに検索結果ダイアログを挿入するつくりになっているようなのでそれに従う。
            下記は一例。
        
            ```html
            <body>
              <div id="container">
                <div id="top_header"></div>
                <div id="header"></div>
                <div id="top_wrapper"></div>
                <div id="wrapper"></div>
                <div></div>
              </div>
            </body>
            ```      
        */
        const mutationObserverTarget  = document.getElementById('wrapper')!.nextElementSibling!;
        const mutationObserverOptions = {childList: true};
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
        const wordReplacer         = wordReplacerFactory.createGenreWordReplacer(GenreWordReplaceTargetPage.SearchResultPage);
    
        if (wordReplacer)
            wordReplacer.replaceGenreWords(document, wordConverter);

        let convertedTitle = document.title;

        for (const entry of conversionMap.entries) {
            console.log(entry.newWord, entry.oldWord);
            convertedTitle = convertedTitle.replace(entry.newWord, entry.oldWord);
        }
        console.log(document.title, convertedTitle);
        document.title = convertedTitle;
    })
    .catch((err) => {
        console.log(err);
    });   
}