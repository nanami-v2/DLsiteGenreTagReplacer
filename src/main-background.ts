
import { Message, MessageType } from "./message";
import { GenreWordConversionMap } from "./core/genre-word-conversion-map";
import { GenreWordConversionMapLoader } from "./core/genre-word-conversion-map-loader";
import { GenreWordConversionMode } from "./core/genre-word-conversion-mode";

let g_conversionMap = new GenreWordConversionMap();

/* 初期化 */
chrome.runtime.onInstalled.addListener(() => {
    /*
        contets-script側で読み込むと、毎ページで読み込むことになる
        よってbackground側で読み込んでおいて、キャッシュしておく
    */
    const conversionMapLoader   = new GenreWordConversionMapLoader();
    const conversionMapFilePath = '/assets/genre-word-conversion-map.json';

    conversionMapLoader.load(
        conversionMapFilePath
    )
    .then((conversionMap) => {
        g_conversionMap = conversionMap;
    })
    .catch((err) => {
        console.log(err);
    });
    /*
        メッセージハンドラを登録
    */
    chrome.runtime.onMessage.addListener((
        message      : Message,
        messageSender: chrome.runtime.MessageSender,
        sendResponse : (response: any) => void
    ) => {
        switch (message.type) {
            case MessageType.GetGenreWordConversionMap:
                return sendResponse(g_conversionMap);
            case MessageType.GetGenerWordConversionMode:
                return sendResponse(GenreWordConversionMode.ToOldWords);
        }
    });
});