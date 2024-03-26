
import { AppMessageClickContextMenu } from "./app-message";

const CONTEXT_MENU_ID    = '43ae9812-9ca5-425d-b12f-c617f91f9095'; /* GUID */
const CONTEXT_MENU_TITLE = 'Execute Anti-WordHunting';

console.log('background');


function onClickContextMenu(
    info: browser.menus.OnClickData,
    tab : browser.tabs.Tab | undefined
): void {
    const tabId   = tab!.id!;
    const message = new AppMessageClickContextMenu();

    browser.tabs.sendMessage(tabId, message);
}

/*
    https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Background_scripts#initialize_the_extension
    にある通り、本来は browser.runtime.onInstalled でコンテキストメニューを作るべき
*/
browser.menus.create({
    type               : 'normal',
    id                 : CONTEXT_MENU_ID,
    title              : CONTEXT_MENU_TITLE,
    contexts           : ['page'],
    documentUrlPatterns: ['*://*.dlsite.com/*']
});
browser.menus.onClicked.addListener(onClickContextMenu);
