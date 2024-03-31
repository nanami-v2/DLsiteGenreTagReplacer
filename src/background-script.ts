
import { Message } from "./message";
import { MessageType } from "./message-type";
import { MessageDataReplaceGenreWord } from "./message-data";
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
            case MessageType.GetGenreWordConversionMap:
                return sendResponse(g_conversionMap);
            case MessageType.GetGenerWordConversionMode:
                return sendResponse(g_conversionMode);
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
        /*
            強制的に置換処理を走らせる
        */
        g_conversionMode = nextConversionMode;
    
        const tabId   = tab!.id!;
        const msgType = MessageType.ReplaceGenreWord;
        const msgData = new MessageDataReplaceGenreWord();

        console.log('sendMessage-ReplaceGenreWord');

        chrome.tabs.sendMessage(
            tabId,
            new Message(msgType, msgData)
        ).catch((err) => console.log(err));
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
                /*
                    強制的に置換処理を走らせる
                */
                const tabId   = tab.id!;
                const msgType = MessageType.ReplaceGenreWord;
                const msgData = new MessageDataReplaceGenreWord();
                
                console.log('sendMessage-ReplaceGenreWord');

                chrome.tabs.sendMessage(
                    tabId,
                    new Message(msgType, msgData)
                ).catch((err) => console.log(err));            
            }
        );
    });
    /*
        タブ更新時にも置換する必要がある
        例えば検索結果でジャンルを選ぶとページの内容が更新されるため
    */
    chrome.tabs.onUpdated.addListener((
        tabId        : number,
        tabChangeInfo: chrome.tabs.TabChangeInfo,
        tab          : chrome.tabs.Tab
    ) => {
        if (!tab.url || !tab.url.includes('dlsite.com/') || tabChangeInfo.status !== 'complete')
            return;
        /*
        強制的に置換処理を走らせる
        */
       const msgType = MessageType.ReplaceGenreWord;
       const msgData = new MessageDataReplaceGenreWord();
       
       console.log('sendMessage-ReplaceGenreWord');

        chrome.tabs.sendMessage(
            tabId,
            new Message(msgType, msgData)
        ).catch((err) => console.log(err));
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