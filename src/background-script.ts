
import { Message } from "./message";
import { MessageType } from "./message/type";
import { MessageFactory } from "./message-factory";
import { GenreWordConversionMapLoader } from "./core/genre-word-conversion-map-loader";
import { GenreWordConversionMap } from "./core/genre-word-conversion-map";
import { GenreWordConversionMode } from "./core/genre-word-conversion-mode";
import { BackgroundScriptHandler } from "./background-script-handler";

let g_conversionMap          = new GenreWordConversionMap();
let g_conversionMode         = GenreWordConversionMode.ToOldWords;
let g_setuppedTabIds         = new Array<number>();

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