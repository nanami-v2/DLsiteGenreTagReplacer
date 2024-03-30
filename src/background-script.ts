
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
        const msg     = new Message(msgType, msgData);
    
        chrome.tabs.sendMessage(tabId, msg, (response: any) => void {});
    });
    /*
        タブ切り替え時の振る舞いを定義する
        これにより複数開いているタブの間で変換モードを共有できる
        つまり

        - どれか一つのタブで旧版表示にしたら、残るタブもタブ切り替え時に旧版表示に切り替わる
        - どれか一つのタブで新版表示にしたら、残るタブもタブ切り替え時に新版表示に切り替わる

        ということ
    */
    chrome.tabs.onActivated.addListener((
        activeInfo: chrome.tabs.TabActiveInfo
    ) => {
        /*
            強制的に置換処理を走らせる
        */
        const tabId   = activeInfo.tabId;
        const msgType = MessageType.ReplaceGenreWord;
        const msgData = new MessageDataReplaceGenreWord();
        const msg     = new Message(msgType, msgData);
    
        chrome.tabs.sendMessage(tabId, msg, (response: any) => void {});
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
        if (tabChangeInfo.status === 'complete') {
            /*
                強制的に置換処理を走らせる
            */
            const msgType = MessageType.ReplaceGenreWord;
            const msgData = new MessageDataReplaceGenreWord();
            const msg     = new Message(msgType, msgData);
    
            chrome.tabs.sendMessage(tabId, msg, (response: any) => void {});
        }
    });
    /*
        contets-script側で読み込むと、毎ページで読み込むことになる
        当然これは無駄なので、background側で読み込んでおいてキャッシュしておく
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
