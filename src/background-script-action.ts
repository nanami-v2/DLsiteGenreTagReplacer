
import { Message } from "./message";
import { MessageType } from "./message-type";
import { MessageDataReplaceGenreWord } from "./message-data";
import { GenreWordConversionMapLoader } from "./core/genre-word-conversion-map-loader";
import { GenreWordConversionMode } from "./core/genre-word-conversion-mode";
import { BackgroundScriptData } from "./background-script-data";


const CONTEXT_MENU_ID           = '43ae9812-9ca5-425d-b12f-c617f91f9095'; /* GUID */
const CONTEXT_MENU_TITLE_TO_OLD = '旧タグ名で表示';
const CONTEXT_MENU_TITLE_TO_NEW = '新タグ名で表示';

export class BackgroundScriptAction {
    public setup(data: BackgroundScriptData): void {
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
                    return sendResponse(data.conversionMap);
                case MessageType.GetGenerWordConversionMode:
                    return sendResponse(data.conversionMode);
            }
        });
        /*
            コンテキストメニューを作成
            コンテキストメニューの表示はタブ間を跨いで切り替わることに注意
        */
        const nextConversionMode = getNextConversionMode(data.conversionMode);
        const contextMenuTitle   = getContextMenuTitle(nextConversionMode);

        chrome.contextMenus.create({
            type               : 'normal',
            id                 : CONTEXT_MENU_ID,
            title              : contextMenuTitle,
            contexts           : ['page'],
            documentUrlPatterns: ['*://*.dlsite.com/*']
        });
        chrome.contextMenus.onClicked.addListener((
            info: chrome.contextMenus.OnClickData,
            tab : chrome.tabs.Tab | undefined
        ) => {
            const nextConversionMode      = getNextConversionMode(data.conversionMode);
            const afterNextConversionMode = getNextConversionMode(nextConversionMode);

            const menuId    = info.menuItemId;
            const menuTitle = getContextMenuTitle(afterNextConversionMode);
    
            chrome.contextMenus.update(menuId, {title: menuTitle});        

            data.conversionMode = nextConversionMode;
    
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
            
            - どれか一つのタブで旧版表示にしたら、残るタブもタブ切り替で旧版表示に切り替わる
            - どれか一つのタブで新版表示にしたら、残るタブもタブ切り替で新版表示に切り替わる
    
            …ということ
        */
        chrome.tabs.onActivated.addListener((
            activeInfo: chrome.tabs.TabActiveInfo
        ) => {
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
            if (tabChangeInfo.status !== 'complete')
                return;
    
            const msgType = MessageType.ReplaceGenreWord;
            const msgData = new MessageDataReplaceGenreWord();
            const msg     = new Message(msgType, msgData);
    
            chrome.tabs.sendMessage(tabId, msg, (response: any) => void {});
        });
    }
    public execute(data: BackgroundScriptData): void {
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
            data.conversionMap = conversionMap;
        })
        .catch((err) => {
            console.log(err);
        });
    }
}

function getContextMenuTitle(conversionMode: GenreWordConversionMode): string {
    return (conversionMode === GenreWordConversionMode.ToOldWords)
        ? CONTEXT_MENU_TITLE_TO_OLD
        : CONTEXT_MENU_TITLE_TO_NEW;
}

function getNextConversionMode(conversionMode: GenreWordConversionMode): GenreWordConversionMode {
    return (conversionMode === GenreWordConversionMode.ToOldWords)
        ? GenreWordConversionMode.ToNewWords
        : GenreWordConversionMode.ToOldWords;
}