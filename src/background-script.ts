
import { Message } from "./message";
import { MessageType } from "./message/type";
import { MessageFactory } from "./message-factory";
import { GenreWordConversionMapLoader } from "./core/genre-word-conversion-map-loader";
import { GenreWordConversionMap } from "./core/genre-word-conversion-map";
import { GenreWordConversionMode } from "./core/genre-word-conversion-mode";

let g_conversionMap     = new GenreWordConversionMap();
let g_conversionMode    = GenreWordConversionMode.ToOldWords;
let g_initializedTabIds = new Array<number>();

chrome.runtime.onInstalled.addListener(() => {
    /*
        変換表を読み込みキャッシュする
    */
    const conversionMapLoader   = new GenreWordConversionMapLoader();
    const conversionMapFilePath = '/assets/genre-word-conversion-map.json';

    conversionMapLoader.loadGenreWordConversionMap(
        conversionMapFilePath
    )
    .then((conversionMap) => {
        g_conversionMap = conversionMap;
    })
    .catch((err) => {
        console.error(err);
    });
    /*
        メッセージハンドラを登録
    */
    chrome.runtime.onMessage.addListener((
        message      : any,
        messageSender: chrome.runtime.MessageSender,
        sendResponse : (response: any) => void
    ) => {
        console.log('onMessage', message.name, messageSender);
        switch ((message as Message).type) {
            case MessageType.GetConversionMapRequest: {
                const msgFactory  = new MessageFactory();
                const msgResponse = msgFactory.createMessageGetConversionMapResponse(g_conversionMap);

                return sendResponse(msgResponse);
            }
            case MessageType.GetConversionModeRequest: {
                const msgFactory  = new MessageFactory();
                const msgResponse = msgFactory.createMessageGetConversionModeResponse(g_conversionMode);

                return sendResponse(msgResponse);
            }
            case MessageType.ContentScriptSetuppedEvent: {
                const tabId = messageSender.tab!.id!;
                const found = g_initializedTabIds.includes(tabId);

                if (!found)
                    g_initializedTabIds.push(tabId);

                return;
            }
        }
    });
    /*
        コンテキストメニューを作成
        コンテキストメニューの表示はタブ間を跨いで切り替わることに注意
    */
    const nextConversionMode = getNextConversionMode(g_conversionMode);
    const contextMenuTitle   = getContextMenuTitle(nextConversionMode);

    chrome.contextMenus.create({
        type               : 'normal',
        id                 : '43ae9812-9ca5-425d-b12f-c617f91f9095', /* GUID */
        title              : contextMenuTitle,
        contexts           : ['page'],
        documentUrlPatterns: ['*://www.dlsite.com/*']
    });
    /*
        コンテキストメニュークリック時の振る舞いを定義する
    */
    chrome.contextMenus.onClicked.addListener((
        info: chrome.contextMenus.OnClickData,
        tab : chrome.tabs.Tab | undefined
    ) => {
        const nextConversionMode      = getNextConversionMode(g_conversionMode);
        const afterNextConversionMode = getNextConversionMode(nextConversionMode);
        /*
            コンテキストメニューのテキストを切り替える
        */
        const menuId    = info.menuItemId;
        const menuTitle = getContextMenuTitle(afterNextConversionMode);
    
        chrome.contextMenus.update(menuId, {title: menuTitle});
        /*
            個々のページが内容を変更できるように通知
        */
        g_conversionMode = nextConversionMode;
    
        const msgFactory = new MessageFactory();
        const msgEvent   = msgFactory.createMessageContextMenuClickedEvent();

        for (const tabId of g_initializedTabIds) {
            chrome.tabs
            .sendMessage(tabId, msgEvent)
            .catch((err) => console.error(err));
        }
    });
    /*
        タブを閉じた時の振る舞い
        保存してあるタブIDを削除する
    */
    chrome.tabs.onRemoved.addListener((
        tabId     : number,
        removeInfo: chrome.tabs.TabRemoveInfo
    ) => {
        const index = g_initializedTabIds.findIndex((e) => e === tabId);
        const found = (index !== -1);

        if (found)
            g_initializedTabIds.splice(index, 1);
    });
});

function getContextMenuTitle(conversionMode: GenreWordConversionMode): string {
    return (conversionMode === GenreWordConversionMode.ToOldWords)
        ? '旧タグ名で表示'
        : '新タグ名で表示';
}

function getNextConversionMode(conversionMode: GenreWordConversionMode): GenreWordConversionMode {
    return (conversionMode === GenreWordConversionMode.ToOldWords)
        ? GenreWordConversionMode.ToNewWords
        : GenreWordConversionMode.ToOldWords;
}