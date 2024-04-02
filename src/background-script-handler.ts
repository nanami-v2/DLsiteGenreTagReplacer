
import { Message } from "./message";
import { MessageType } from "./message/type";
import { MessageFactory } from "./message-factory";
import { GenreWordConversionMapLoader } from "./core/genre-word-conversion-map-loader";
import { GenreWordConversionMode } from "./core/genre-word-conversion-mode";

export namespace BackgroundScriptHandler {
    export function onInstalled(): void {
        /*
            コンテキストメニューを作成
            コンテキストメニューの表示はタブ間を跨いで切り替わることに注意
        */
        const defaultConversionMode = GenreWordConversionMode.ToOldWords;
        const nextConversionMode    = getNextConversionMode(defaultConversionMode);
        const contextMenuTitle      = getContextMenuTitle(nextConversionMode);
    
        chrome.contextMenus.create({
            type               : 'normal',
            id                 : '43ae9812-9ca5-425d-b12f-c617f91f9095', /* GUID */
            title              : contextMenuTitle,
            contexts           : ['page'],
            documentUrlPatterns: ['*://www.dlsite.com/*']
        });
        /*
            ストレージに初期値を保存
        */
        chrome.storage.local
        .clear()
        .then(() => {
            chrome.storage.local
            .set({'conversionMode': defaultConversionMode});
        });
    }
    export function onMessage(
        message      : any,
        messageSender: chrome.runtime.MessageSender,
        sendResponse : (response: any) => void
    ): boolean | undefined {
        switch ((message as Message).type) {
            case MessageType.GetConversionMapRequest: {
                const conversionMapLoader   = new GenreWordConversionMapLoader();
                const conversionMapFilePath = '/assets/genre-word-conversion-map.json';
    
                conversionMapLoader
                .loadGenreWordConversionMap(conversionMapFilePath)
                .then((conversionMap) => {
                    const msgFactory  = new MessageFactory();
                    const msgResponse = msgFactory.createMessageGetConversionMapResponse(conversionMap);
    
                    sendResponse(msgResponse);
                })
                .catch((err) => console.error(err));
    
                return true; /* Keep channel for sendResponse */
            }
            case MessageType.GetConversionModeRequest: {
                chrome.storage.local
                .get('conversionMode')
                .then((result) => {
                    const conversionMode = (result['conversionMode'] as GenreWordConversionMode);
                    const msgFactory     = new MessageFactory();
                    const msgResponse    = msgFactory.createMessageGetConversionModeResponse(conversionMode);
    
                    sendResponse(msgResponse);
                })
                .catch((err) => console.error(err));

                return true; /* Keep channel for sendResponse */
            }
            case MessageType.ContentScriptSetuppedEvent: {
                const tabId = messageSender.tab!.id!;
                const data  = {[`tabId-${tabId}`]: tabId};

                chrome.storage.local
                .set(data)
                .then(()       => chrome.storage.local.get())
                .then((result) => console.log('insert tabId...', tabId, result))
                .catch((err)   => console.error(err));

                return;
            }
        }
    }
    export function onContextMenuClicked(
        info: chrome.contextMenus.OnClickData,
        tab : chrome.tabs.Tab | undefined
    ): void {
        chrome.storage.local
        .get()
        .then((result) => {
            console.log('contextMenuClicked...', tab?.id, result);

            const conversionMode          = (result['conversionMode'] as GenreWordConversionMode);
            const nextConversionMode      = getNextConversionMode(conversionMode);
            const afterNextConversionMode = getNextConversionMode(nextConversionMode);
            /*
                コンテキストメニューのテキストを切り替える
            */
            const itemId    = info.menuItemId;
            const menuTitle = getContextMenuTitle(afterNextConversionMode);
        
            chrome.contextMenus
            .update(itemId, {title: menuTitle});
            /*
                変換モードを更新
            */
            chrome.storage.local
            .set({'conversionMode': nextConversionMode});
            /*
                個々のページが内容を変更できるように通知
            */
            const msgFactory = new MessageFactory();
            const msgEvent   = msgFactory.createMessageContextMenuClickedEvent();
            
            for (const [k, v] of Object.entries(result)) {
                if (k.includes('tabId-')) {
                    console.log('sendMessage-onContextMenuClicked', v);
                    chrome.tabs
                    .sendMessage(v, msgEvent)
                    .catch((err) => console.error(err));
                }
            }
        })
        .catch((err) => console.error(err));
    }
    export function onTabRemoved(
        tabId     : number,
        removeInfo: chrome.tabs.TabRemoveInfo
    ): void {
        /*
            本質的に並行処理であるため、削除処理は atomic でなければならない
            すなわち fetch & remove という戦略は使えない（LostUpdate が生じる）

            なのでデータ構造もそれに制約を受け、setuppedTabId を配列に格納して保存するということができない
        */
        chrome.storage.local
        .remove(`tabId-${tabId}`)
        .then(()       => chrome.storage.local.get())
        .then((result) => console.log('remove tabId...', tabId, result));
    }
}


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