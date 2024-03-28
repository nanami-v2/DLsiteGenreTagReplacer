
import {
    AppMessage,
    AppMessageType,
} from "./app-message";
import { GenreWordConversionMapLoader } from "./core/genre-word-conversion-map-loader";

browser.runtime.onInstalled.addListener(() => {
    console.log('Installed...');
    
    browser.runtime.onMessage.addListener((
        message: AppMessage,
        messageSender: browser.runtime.MessageSender,
        sendResponse: (response: any) => void
    ) => {
        console.log('MESSAGE-RECEIVED');
        switch (message.type) {
            case AppMessageType.GetGenreWordConversionMap:
                return onGetGenreWordConversionMap(
                    message,
                    messageSender,
                    sendResponse
                );
        }
    });
});

function onGetGenreWordConversionMap(
    message      : AppMessage,
    messageSender: browser.runtime.MessageSender,
    sendResponse : (response: any) => void
) {
    const conversionMapLoader   = new GenreWordConversionMapLoader();
    const conversionMapFilePath = '/assets/genre-word-conversion-map.json';

    return (
        conversionMapLoader.load(
            conversionMapFilePath
        )
        .then((conversionMap) => {
            return Promise.resolve(conversionMap);
        })
        .catch((err) => {
            return Promise.reject(err);
        })
    );
}