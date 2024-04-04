
import { Message } from "./message";
import { MessageType } from "./message/type";
import { MessageFactory } from "./message-factory";
import { GenreWordConversionMode } from "./core/genre-word-conversion-mode";
import { Storage } from "./storage";

export namespace BackgroundScriptHandler {
    export function onInstalled(): void {
        /*
            コンテキストメニューを作成
            コンテキストメニューの表示はタブ間を跨いで切り替わることに注意
        */
        const defaultConversionMode  = GenreWordConversionMode.ToOldWords;
        const switchedConversionMode = switchConversionMode(defaultConversionMode);
    
        chrome.contextMenus.create({
            type               : 'normal',
            id                 : '43ae9812-9ca5-425d-b12f-c617f91f9095', /* GUID */
            title              : getContextMenuTitle(switchedConversionMode),
            contexts           : ['page'],
            documentUrlPatterns: ['*://www.dlsite.com/*']
        });
        /*
            ストレージを初期化
        */
        const storage = new Storage();

        storage
        .init(defaultConversionMode)
        .catch((err) => console.error(err));
    }
    export function onMessage(
        message      : any,
        messageSender: chrome.runtime.MessageSender,
        sendResponse : (response: any) => void
    ): boolean | undefined {
        switch ((message as Message).type) {
            case MessageType.GetConversionMapRequest: {
                const storage = new Storage();

                storage
                .loadConversionMap()
                .then((conversionMap) => {
                    const msgFactory = new MessageFactory();
                    const msg        = msgFactory.createMessageGetConversionMapResponse(conversionMap);

                    sendResponse(msg);
                })
                .catch((err) => console.error(err));

                return true; /* Keep channel for sendResponse */
            }
            case MessageType.GetConversionModeRequest: {
                const storage = new Storage();

                storage
                .loadConversionMode()
                .then((conversionMode) => {
                    const msgFactory = new MessageFactory();
                    const msg        = msgFactory.createMessageGetConversionModeResponse(conversionMode);

                    sendResponse(msg);
                })
                .catch((err) => console.error(err));

                return true; /* Keep channel for sendResponse */
            }
            case MessageType.ContentScriptSetuppedEvent: {
                const tabId   = messageSender.tab!.id!;
                const storage = new Storage();

                storage
                .saveTabId(tabId)
                .then(() => storage.loadAllTabIds())
                .then((tabIds) => console.log('insert tabId...', tabId, tabIds))
                .catch((err) => console.error(err));

                return;
            }
        }
    }
    export function onContextMenuClicked(
        info: chrome.contextMenus.OnClickData,
        tab : chrome.tabs.Tab | undefined
    ): void {
        const itemId  = info.menuItemId
        const storage = new Storage();

        console.log('contextMenuClicked...', tab?.id);

        storage
        .loadConversionMode()
        .then((currentConversionMode) => {
            /*
                コンテキストメニューの更新と、スイッチングした変換モードの保存は独立して行える
            */
            return Promise.all([
                storage.saveConversionMode(
                    switchConversionMode(currentConversionMode)
                ),
                new Promise((resolve, reject) => {
                    chrome.contextMenus.update(
                        itemId,
                        {title: getContextMenuTitle(currentConversionMode)},
                        () => resolve(undefined)
                    )
                })
            ]);
        })
        .then(() => storage.loadAllTabIds())
        .then((tabIds) => {
            /*
                複数タブにまとめて通知
            */
            const msgFactory = new MessageFactory();
            const msg        = msgFactory.createMessageContextMenuClickedEvent();
            
            for (const tabId of tabIds) {
                console.log('sendMessage...onContextMenuClicked', tabId);
                
                chrome.tabs
                .sendMessage(tabId, msg)
                .catch((err) => console.error(err));
            }
        })
        .catch((err) => console.error(err));
    }
    export function onTabRemoved(
        tabId     : number,
        removeInfo: chrome.tabs.TabRemoveInfo
    ): void {
        const storage = new Storage();

        storage
        .deleteTabId(tabId)
        .then(() => storage.loadAllTabIds())
        .then((tabIds) => console.log('remove tabId...', tabId, tabIds))
        .catch((err) => console.error(err));
    }
}


function getContextMenuTitle(conversionMode: GenreWordConversionMode): string {
    return (conversionMode === GenreWordConversionMode.ToOldWords)
        ? '旧タグ名で表示'
        : '新タグ名で表示';
}

function switchConversionMode(conversionMode: GenreWordConversionMode): GenreWordConversionMode {
    return (conversionMode === GenreWordConversionMode.ToOldWords)
        ? GenreWordConversionMode.ToNewWords
        : GenreWordConversionMode.ToOldWords;
}