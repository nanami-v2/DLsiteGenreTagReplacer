
import { Message } from "./message";
import { MessageType } from "./message/type";
import { MessageFactory } from "./message-factory";
import { GenreWordConversionMapLoader } from "./core/genre-word-conversion-map-loader";
import { GenreWordConversionMap } from "./core/genre-word-conversion-map";
import { GenreWordConversionMode } from "./core/genre-word-conversion-mode";

let g_conversionMap  = new GenreWordConversionMap();
let g_conversionMode = GenreWordConversionMode.ToOldWords;

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
        console.log(err);
    });
    /*
        メッセージハンドラを登録
    */
    chrome.runtime.onMessage.addListener((
        message      : any,
        messageSender: chrome.runtime.MessageSender,
        sendResponse : (response: any) => void
    ) => {
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
        documentUrlPatterns: ['*://*.dlsite.com/*']
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

        g_conversionMode = nextConversionMode;
    
        const tabId      = tab!.id!;
        const msgFactory = new MessageFactory();
        const msgEvent   = msgFactory.createMessageContextMenuClickedEvent();

        chrome.tabs
        .sendMessage(tabId, msgEvent)
        .catch((err) => console.log(err));
    });
    /*
        タブ切り替え時の振る舞いを定義する
        これにより複数開いているタブの間で変換状態を共有できる
    */
    chrome.tabs.onActivated.addListener((
        activeInfo: chrome.tabs.TabActiveInfo
    ) => {
        chrome.tabs.get(
            activeInfo.tabId,
            (tab: chrome.tabs.Tab) => {
                if (!tab.url || !tab.url.includes('dlsite.com/'))
                    return;

                const tabId      = tab.id!;
                const msgFactory = new MessageFactory();
                const msgEvent   = msgFactory.createMessageTabActivatedEvent();

                console.log('tab is activated');

                chrome.tabs
                .sendMessage(tabId, msgEvent)
                .catch((err) => console.log(err));
            }
        );
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