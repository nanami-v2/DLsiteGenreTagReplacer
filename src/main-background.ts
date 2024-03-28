
import { Message, MessageType, MessageReplaceGenreWord } from "./message";
import { GenreWordConversionMap } from "./core/genre-word-conversion-map";
import { GenreWordConversionMapLoader } from "./core/genre-word-conversion-map-loader";
import { GenreWordConversionMode } from "./core/genre-word-conversion-mode";

const CONTEXT_MENU_ID           = '43ae9812-9ca5-425d-b12f-c617f91f9095'; /* GUID */
const CONTEXT_MENU_TITLE_TO_OLD = '旧タグ名で表示';
const CONTEXT_MENU_TITLE_TO_NEW = '新タグ名で表示';

let g_conversionMap  = new GenreWordConversionMap();
let g_conversionMode = GenreWordConversionMode.ToOldWords;

/* 初期化 */
chrome.runtime.onInstalled.addListener(() => {
    /*
        contets-script側で読み込むと、毎ページで読み込むことになる
        当然これは無駄なので、background側で読み込んでおいてキャッシュしておく
    */
    const conversionMapLoader   = new GenreWordConversionMapLoader();
    const conversionMapFilePath = '/assets/genre-word-conversion-map.json';

    conversionMapLoader.load(
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
        const msg     = message as Message;
        const msgType = msg.type;

        switch (msgType) {
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
    chrome.contextMenus.create({
        type               : 'normal',
        id                 : CONTEXT_MENU_ID,
        title              : CONTEXT_MENU_TITLE_TO_NEW,
        contexts           : ['page'],
        documentUrlPatterns: ['*://*.dlsite.com/*']
    });
    chrome.contextMenus.onClicked.addListener((
        info: chrome.contextMenus.OnClickData,
        tab : chrome.tabs.Tab | undefined
    ) => {
        const menuId    = info.menuItemId;
        const menuTitle = (g_conversionMode === GenreWordConversionMode.ToOldWords)
            ? CONTEXT_MENU_TITLE_TO_OLD
            : CONTEXT_MENU_TITLE_TO_NEW;

        chrome.contextMenus.update(menuId, {title: menuTitle});

        g_conversionMode = (g_conversionMode === GenreWordConversionMode.ToOldWords)
            ? GenreWordConversionMode.ToNewWords
            : GenreWordConversionMode.ToOldWords;

        const tabId   = tab!.id!;
        const message = new MessageReplaceGenreWord();

        chrome.tabs.sendMessage(tabId, message, (response: any) => void {});
    });
    /*
        タブ切り替え時の振る舞いを定義する
        これにより複数開いているタブの間で変換モードを共有できる
        つまり
        
        - どれか一つのタブで旧版表示にしたら、残るタブもタブ切り替で旧版表示に切り替わる
        - どれか一つのタブで新版表示にしたら、残るタブもタブ切り替で新版表示に切り替わる

        …ということ
    */
    chrome.tabs.onActivated.addListener((
        activeInfo: chrome.tabs.TabActiveInfo
    ) => {
        const tabId   = activeInfo.tabId;
        const message = new MessageReplaceGenreWord();

        chrome.tabs.sendMessage(tabId, message, (response: any) => void {});
    });
});