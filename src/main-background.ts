
import {
    AppMessage,
    AppMessageType,
    AppMessageStartGenreWordConversion,
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

    browser.runtime.onMessage.addListener((
        message: AppMessage,
        messageSender: browser.runtime.MessageSender,
        sendResponse: (response: any) => void
    ) => {
        switch (message.type) {
            case AppMessageType.GetGenreWordConversionMap:
                return onGetGenreWordConversionMap(
                    message,
                    messageSender,
                    sendResponse
                );
        }
    });
});

function onClickContextMenu(
    info: browser.menus.OnClickData,
    tab : browser.tabs.Tab | undefined
) {
    const tabId   = tab!.id!;
    const message = new AppMessageStartGenreWordConversion();

    browser.tabs.sendMessage(tabId, message);
}

function onGetGenreWordConversionMap(
    message      : AppMessage,
    messageSender: browser.runtime.MessageSender,
    sendResponse : (response: any) => void
) {
    const conversionMapLoader   = new GenreWordConversionMapLoader();
    const conversionMapFilePath = '/assets/genre-word-conversion-map.json';

    return (
        conversionMapLoader.load(
            conversionMapFilePath
        )
        .then((conversionMap) => {
            return Promise.resolve(conversionMap);
        })
        .catch((err) => {
            return Promise.reject(err);
        })
    );
}