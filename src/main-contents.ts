
import { GenreWordConversionMap } from "./core/genre-word-conversion-map";
import { GenreWordUpdater } from './core/genre-word-updater';
import {
    AppMessage,
    AppMessageType,
    AppMessageGetGenreWordConversionMap,
} from "./app-message";

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
        const wordUpdater = new GenreWordUpdater();

        wordUpdater.updateGenreWords(
            document,
            conversionMap
        );
    });
}