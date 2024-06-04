
import { Message } from "./message";
import { MessagDataeGetConversionMapRequest } from './message/data'
import { MessageType } from "./message/type";
import { MessageFactory } from "./message-factory";
import { GenreWordConversionMapLoader } from './core/genre-word-conversion-map-loader';
import { GenreWordConversionMode } from "./core/genre-word-conversion-mode";
import { ContextMenu } from "./core/context-menu";
import { LocalStorage } from './core/local-storage';
import { SessionStorage } from './core/session-storage';

export namespace BackgroundScriptHandler {
    export function onInstalled(): void {
        /*
            コンテキストメニューを作成
            コンテキストメニューの表示はタブ間を跨いで切り替わることに注意
        */
       const contextMenu           = new ContextMenu();
       const localStorage          = new LocalStorage();
       const defaultConversionMode = GenreWordConversionMode.ToOldWords;

        contextMenu.create(defaultConversionMode)
        .then(() => localStorage.clear())
        .then(() => localStorage.saveConversionMode(defaultConversionMode))
        .catch((err) => console.error(err));
    }
    export function onMessage(
        message      : any,
        messageSender: chrome.runtime.MessageSender,
        sendResponse : (response: any) => void
    ): boolean | undefined {
        switch ((message as Message).type) {
            case MessageType.GetConversionMapRequest: {
                const conversionMapLoader = new GenreWordConversionMapLoader();
                const msgFactory          = new MessageFactory();
                const langCode            = (message.data as MessagDataeGetConversionMapRequest).langCode;
                
                conversionMapLoader.loadConversionMap(langCode)
                .then((conversionMap) => {
                    sendResponse(msgFactory.createMessageGetConversionMapResponse(conversionMap));
                })
                .catch((err) => console.error(err));

                return true; /* Keep channel for sendResponse */
            }
            case MessageType.GetConversionModeRequest: {
                const localStorage = new LocalStorage();
                const msgFactory   = new MessageFactory();

                localStorage.loadConversionMode()
                .then((conversionMode) => {
                    sendResponse(msgFactory.createMessageGetConversionModeResponse(conversionMode!));
                })
                .catch((err) => console.error(err));

                return true; /* Keep channel for sendResponse */
            }
            case MessageType.ContentScriptSetuppedEvent: {
                const sessionStorage = new SessionStorage();
                const tabId          = messageSender.tab!.id!;

                sessionStorage.saveTabId(tabId)
                .catch((err) => console.error(err));

                return;
            }
        }
    }
    export function onContextMenuClicked(
        info: chrome.contextMenus.OnClickData,
        tab : chrome.tabs.Tab | undefined
    ): void {
        const contextMenu    = new ContextMenu();
        const localStorage   = new LocalStorage();
        const sessionStorage = new SessionStorage();
        const msgFactory     = new MessageFactory();
        /*
            - contextMenuのテキストを切り替える
            - フリップ後の変換モードを保存
            - 現状の DLsite.com のタブ全てに通知
        */
        localStorage.loadConversionMode()
        .then((conversionMode) => {
            const flippedConversionMode = (conversionMode === GenreWordConversionMode.ToOldWords)
                ? GenreWordConversionMode.ToNewWords
                : GenreWordConversionMode.ToOldWords;

            return Promise.all([
                localStorage.saveConversionMode(flippedConversionMode),
                contextMenu.updateTitleText(info.menuItemId, flippedConversionMode),
                sessionStorage.loadAllTabIds()
            ]);
        })
        .then((results) => {
            const tabIds = results[2];
            const msg    = msgFactory.createMessageContextMenuClickedEvent();
            
            for (const tabId of tabIds) {
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
        const sessionStorage = new SessionStorage();
        
        sessionStorage.deleteTabId(tabId)
        .catch((err) => console.error(err));
    }
}