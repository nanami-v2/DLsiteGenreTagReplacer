
import { ContentScriptAction } from "../content-script-action";
import { MessageFactory } from "../message-factory";

export class ContentScriptActionForOtherPage implements ContentScriptAction {
    public setup(): void { 
        /*
            このクラスの存在意義にも関わるが、非置換対象のページであってもbackground scriptから
            置換実行をメッセージが送られてくる。このメッセージを受け取らないとエラーが五月蠅い
            
            なのでmessageを受け取り破棄するためだけの処理があると都合がよい
        */
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