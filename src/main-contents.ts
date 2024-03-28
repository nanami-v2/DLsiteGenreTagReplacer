
import {
    AppMessage,
    AppMessageType,
    AppMessageGetGenreWordConversionMap,
    AppMessageStartGenreWordConversion,
    AppMessageGetConvertedGenreWordsRequest,
    AppMessageGetConvertedGenreWordsResponse
} from "./app-message";
import { GenreWordConversionMap } from "./core/genre-word-conversion-map";
import { GenreWordUpdater } from './core/genre-word-updater';

browser.runtime.onMessage.addListener((
    message      : AppMessage,
    messageSender: browser.runtime.MessageSender,
    sendResponse : (response: any) => void
) => {
    console.log('onMessage', message);

    switch (message.type) {
        case AppMessageType.StartGenreWordConversion:
            return onStartGenreWordConversion(
                message,
                messageSender,
                sendResponse
            );
        //case AppMessageType.GetConvertedGenreWordsResponse:
        //    return onGetConvertedGenreWordsResponse(
        //        message,
        //        messageSender,
        //        sendResponse
        //    );
    }
});

/**
 * 
 * @param {} message 
 */
function onStartGenreWordConversion(
    message      : AppMessage,
    messageSender: browser.runtime.MessageSender,
    sendResponse : (response: any) => void
) {
    browser.runtime.sendMessage(
        new AppMessageGetGenreWordConversionMap()
    )
    .then((conversionMap: GenreWordConversionMap) => {
        console.log(conversionMap);

        const wordUpdater = new GenreWordUpdater();
        
        wordUpdater.updateGenreWords(
            document,
            conversionMap
        );
    });
}