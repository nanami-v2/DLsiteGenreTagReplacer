
import {
    Message,
    MessageType,
} from "./message";
import { GenreWordConversionMap } from "./core/genre-word-conversion-map";
import { GenreWordConversionMapLoader } from "./core/genre-word-conversion-map-loader";

let g_conversionMap = new GenreWordConversionMap();

/* 初期化 */
browser.runtime.onInstalled.addListener(() => {
    /*
        contets-script側で読み込むと、毎ページで読み込むことになるので無駄
        なのでbackground側で読み込んでおいて、キャッシュしておく
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
    browser.runtime.onMessage.addListener((
        message: Message,
        messageSender: browser.runtime.MessageSender,
        sendResponse: (response: any) => void
    ) => {
        if (message.type === MessageType.GetGenreWordConversionMap)
            sendResponse(g_conversionMap);
    });
});