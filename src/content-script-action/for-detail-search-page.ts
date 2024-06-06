
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
            }
        });
        /*
            ジャンルを選ぶと動的に要素が挿入されるので、mutatioObserver でトラッキング
            ジャンルの場合、search_detail_row は5番目
        */
        const searchDetailRows                         = document.getElementsByClassName('search_detail_row');
        const mutationObserverSelectedGenreTagsTarget  = searchDetailRows[4];
        const mutationObserverSelectedGenreTagsOptions = {childList: true, subtree: true};
        const mutationObserverSelectedGenreTags        = new MutationObserver((
            mutations: MutationRecord[],
            observer : MutationObserver
        ) => {
            doReplaceGenreWords();
        });
        mutationObserverSelectedGenreTags.observe(
            mutationObserverSelectedGenreTagsTarget,
            mutationObserverSelectedGenreTagsOptions
        );
        /*
            ジャンル一覧は非同期で読み込んで、display:none で隠蔽しつつ初期化している
            なのでこちらも mutationObserver で監視する必要がある
            
            ジャンル一覧のモーダルは 0 番目
        */
        const seaerchModals                     = document.getElementsByClassName('search_detail_modal');
        const mutationObserverGenreModalTarget  = seaerchModals[0];
        const mutationObserverGenreModalOptions = {childList: true, subtree: true};
        const mutationObserverGenreModal        = new MutationObserver((
            mutations: MutationRecord[],
            observer : MutationObserver
        ) => {
            doReplaceGenreWords();
        });
        mutationObserverGenreModal.observe(
            mutationObserverGenreModalTarget,
            mutationObserverGenreModalOptions
        );
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
        const wordReplacer  = new GenreWordReplacer(GenreWordReplaceTargetPage.DetailSearchPage);
    
        wordReplacer.replaceGenreWords(document, wordConverter);
    })
    .catch((err) => {
        console.error(err);
    });   
}
