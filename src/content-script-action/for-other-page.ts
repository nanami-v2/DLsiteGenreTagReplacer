
import { ContentScriptAction } from "../content-script-action";
import { MessageFactory } from "../message-factory";

export class ContentScriptActionForOtherPage implements ContentScriptAction {
    public setup(): void { 
        /*
            実は非置換対象のページであってもbackground scriptからメッセージが送られてくる場合がある。
            何故なら、background script側ではタブIDで判別しているから。
            つまり置換対象ページから非置換対象ページへと同一タブで遷移した場合にメッセージが送られてくる。
            
            なのでmessageを受け取り破棄するためだけの処理があると都合がよい。
            ――というかそうしないとエラーになる。なので現状この「何もしない」クラスは必須。
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