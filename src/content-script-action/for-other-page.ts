
import { ContentScriptAction } from "../content-script-action";
import { MessageFactory } from "../message-factory";

export class ContentScriptActionForOtherPage implements ContentScriptAction {
    public setup(): void { 
        chrome.runtime.onMessage.addListener((
            message      : any,
            messageSender: chrome.runtime.MessageSender,
            sendResponse : (response: any) => void
        ) => {
            /* Do nothing */
        });
        /*
            セットアップ完了を通知
        */
        const msgFactory = new MessageFactory();
        const msgEvent   = msgFactory.createMessageContentScriptSetuppedEvent();

        chrome.runtime
        .sendMessage(msgEvent)
        .catch((err) => console.error(err));
    }
    public excute(): void {
        /* Do nothing */
    }
}