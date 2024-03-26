
import { AppMessage, AppMessageType, AppMessageClickContextMenu } from "./app-message";

//console.log(document.getElementsByClassName('main_genre'));
console.log('content');

const g_data = {
    isClicked: false,
};

browser.runtime.onMessage.addListener((
    message      : AppMessage,
    messageSender: browser.runtime.MessageSender,
    sendResponse : (response: any) => void
) => {
    switch (message.type) {
        case AppMessageType.ClickContextMenu:
            return onClickContextMenu(message, messageSender, sendResponse);
    }
});

/**
 * 
 * @param {} message 
 */
function onClickContextMenu(
    message      : AppMessage,
    messageSender: browser.runtime.MessageSender,
    sendResponse : (response: any) => void
) {
    if (!g_data.isClicked) {
        g_data.isClicked = true;

        console.log(message, 'listended!!!');
        document.body.style.border = '5px solid red';
    }
    else {
        console.log(message, 'listended!!!');
        document.body.style.border = '';
    }
}