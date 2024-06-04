
import { ContentScriptAction } from "../content-script-action";
import { GenreWordConverter } from "../core/genre-word-converter";
import { GenreWordReplacerFactory } from "../core/genre-word-replacer-factory";
import { GenreWordReplaceTargetPage } from "../core/genre-word-replace-target-page";
import { DocumentTitleConverter } from '../core/document-title-converter'
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
                    return doReplaceGenreWordsAndUpdateTabTitle();
            }
        });
        /*
            画面左のタグの選択状況と、画面上部のタグの選択状況はリンクしている
            そしてどちらも動的に追加される
            したがって、両方とも mutationObserver で監視するのが最も適当
        */
        const mutationObserverLeftGenreTagsTarget  = document.getElementsByClassName('left_refine_list')[12];
        const mutationObserverLeftGenreTagsOptions = {childList: true, sbutree: true};
        const mutationObserverLeftGenreTags        = new MutationObserver((
            mutations: MutationRecord[],
            observer : MutationObserver
        ) => {
            doReplaceGenreWordsAndUpdateTabTitle();
        });
        mutationObserverLeftGenreTags.observe(
            mutationObserverLeftGenreTagsTarget,
            mutationObserverLeftGenreTagsOptions
        );
        /*
            画面上部のタグ
        */
        const mutationObserverTopGenreTagsTarget  = document.getElementsByClassName('search_tag_items')[0];
        const mutationObserverTopGenreTagsOptions = {childList: true, sbutree: true};
        const mutationObserverTopGenreTags        = new MutationObserver((
            mutations: MutationRecord[],
            observer : MutationObserver
        ) => {
            doReplaceGenreWordsAndUpdateTabTitle();
        });
        mutationObserverTopGenreTags.observe(
            mutationObserverTopGenreTagsTarget,
            mutationObserverTopGenreTagsOptions
        );
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
        const mutationObserverSelectGenreTarget  = document.getElementById('wrapper')!.nextElementSibling!;
        const mutationObserverSelectGenreOptions = {childList: true};
        const mutationObserverSelectGenre        = new MutationObserver((
            mutations: MutationRecord[],
            observer : MutationObserver
        ) => {
            doReplaceGenreWordsAndUpdateTabTitle();
        });
        mutationObserverSelectGenre.observe(
            mutationObserverSelectGenreTarget,
            mutationObserverSelectGenreOptions
        );
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
        doReplaceGenreWordsAndUpdateTabTitle();
    }
}

function doReplaceGenreWordsAndUpdateTabTitle() {
    const msgFactory                  = new MessageFactory();
    const langCode                    = document.documentElement.lang;
    const msgGetConversionMapRequest  = msgFactory.createMessageGetConversionMapRequest(langCode);
    const msgGetConversionModeRequest = msgFactory.createMessageGetConversionModeRequest();

    Promise.all([
        chrome.runtime.sendMessage(msgGetConversionMapRequest),
        chrome.runtime.sendMessage(msgGetConversionModeRequest)
    ])
    .then((results: Array<Message>) => {
        const conversionMap  = (results[0].data as MessageDataGetConversionMapResponse ).conversionMap;
        const conversionMode = (results[1].data as MessageDataGetConversionModeResponse).conversionMode;
    
        const wordConverter          = new GenreWordConverter(conversionMap, conversionMode);
        const wordReplacerFactory    = new GenreWordReplacerFactory();
        const wordReplacer           = wordReplacerFactory.createGenreWordReplacer(GenreWordReplaceTargetPage.SearchResultPage);
        const documentTitleConverter = new DocumentTitleConverter(conversionMap, conversionMode);
    
        wordReplacer.replaceGenreWords(document, wordConverter);
        document.title = documentTitleConverter.convertDocumentTitle(document.title);
    })
    .catch((err) => {
        console.error(err);
    });   
}