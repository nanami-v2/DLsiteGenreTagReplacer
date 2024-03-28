
import {
    AppMessageStartGenreWordConversion,
    AppMessageGetConvertedGenreWordsRequest,
    AppMessageGetConvertedGenreWordsResponse,
    AppMessage,
    AppMessageType,
} from "./app-message";
import { GenreWordConversionMap } from './core/genre-word-conversion-map';
import { GenreWordConversionMapLoader } from "./core/genre-word-conversion-map-loader";

const CONTEXT_MENU_ID    = '43ae9812-9ca5-425d-b12f-c617f91f9095'; /* GUID */
const CONTEXT_MENU_TITLE = 'Execute Anti-WordHunting';

browser.runtime.onInstalled.addListener(() => {
    /*
        コンテキストメニューを生成
    */
    browser.menus.create({
        type               : 'normal',
        id                 : CONTEXT_MENU_ID,
        title              : CONTEXT_MENU_TITLE,
        contexts           : ['page'],
        documentUrlPatterns: ['*://*.dlsite.com/*']
    });
    browser.menus.onClicked.addListener(onClickContextMenu);
    /*
        リソースを読み込み
    */
    /*
    const wordConversionMapLoader   = new GenreWordConversionMapLoader();
    const wordConversionMapFilePath = '/assets/genre-word-conversion-map-entries.json';

    wordConversionMapLoader
    .load(wordConversionMapFilePath)
    .then((wordConversionMap) => {
        console.log(wordConversionMap)
    })
    .catch((err) => {
        console.log(err);
    });
    */

    /*
    browser.runtime.onMessage.addListener((
        message: AppMessage,
        messageSender: browser.runtime.MessageSender,
        sendResponse: (response: any) => void
    ) => {
        switch (message.type) {
            case AppMessageType.GetConvertedGenreWordsRequest:
                return onGetConvertedGenreWordsRequest(
                    message,
                    messageSender,
                    sendResponse
                );
        }
    });
    */
});

function onClickContextMenu(
    info: browser.menus.OnClickData,
    tab : browser.tabs.Tab | undefined
) {
    const tabId   = tab!.id!;
    const message = new AppMessageStartGenreWordConversion();

    console.log(tabId, message);
    browser.tabs.sendMessage(tabId, message);
}

function onGetConvertedGenreWordsRequest(
    message      : AppMessage,
    messageSender: browser.runtime.MessageSender,
    sendResponse : (response: any) => void
) {
    /* ここでワードを変換して、返す */
    //sendResponse('AAAA');    
}