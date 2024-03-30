
import { Message } from "../message";
import { GenreWordConversionMap } from "../core/genre-word-conversion-map";
import { GenreWordConversionMode } from "../core/genre-word-conversion-mode";
import { GenreWordConverterFactory } from "../core/genre-word-converter-factory";
import { GenreWordReplacerFactory } from "../core/genre-word-replacer-factory";
import { GenreWordReplaceTargetPage } from '../core/genre-word-replace-target-page'
import { MessageType } from "../message-type";
import { MessageDataGetGenreWordConversionMap, MessageDataGetGenreWordConversionMode } from "../message-data";
import { ContentScriptAction } from "../content-script-action";

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
                case MessageType.ReplaceGenreWord:
                    doReplaceGenreWords();
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
        const wordReplacer         = wordReplacerFactory.createGenreWordReplacer(GenreWordReplaceTargetPage.SearchResultPage);
    
        if (wordReplacer)
            wordReplacer.replaceGenreWords(document, wordConverter);
    })
    .catch((err) => {
        console.log(err);
    });   
}