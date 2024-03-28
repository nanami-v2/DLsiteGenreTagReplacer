
import { GenreWordConversionMap } from "./core/genre-word-conversion-map";
import { GenreWordReplacer } from './core/genre-word-replacer';
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
        const wordReplacer = new GenreWordReplacer();

        wordReplacer.replaceGenreWords(
            document,
            conversionMap
        );
    });
}