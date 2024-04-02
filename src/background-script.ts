
import { BackgroundScriptHandler } from "./background-script-handler";

chrome.runtime.onInstalled.addListener(
    BackgroundScriptHandler.onInstalled
);
chrome.runtime.onMessage.addListener(
    BackgroundScriptHandler.onMessage
)
chrome.contextMenus.onClicked.addListener(
    BackgroundScriptHandler.onContextMenuClicked
);
chrome.tabs.onRemoved.addListener(
    BackgroundScriptHandler.onTabRemoved
);