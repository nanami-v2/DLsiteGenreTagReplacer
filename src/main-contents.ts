
import {
    AppMessage,
    AppMessageType,
    AppMessageStartGenreWordConversion,
    AppMessageGetConvertedGenreWordsRequest,
    AppMessageGetConvertedGenreWordsResponse
} from "./app-message";

console.log('AAAAAAAAAAAAAAAAAAAAAAA');

browser.runtime.onMessage.addListener((
    message      : AppMessage,
    messageSender: browser.runtime.MessageSender,
    sendResponse : (response: any) => void
) => {
    console.log(message);

    //switch (message.type) {
    //    case AppMessageType.StartGenreWordConversion:
    //        return onStartGenreWordConversion(
    //            message,
    //            messageSender,
    //            sendResponse
    //        );
    //}
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
    const genreContainers     = document.getElementsByClassName('main_genre');
    const genreContainerCount = genreContainers.length;
    const genreWords          = new Array<string>();

    for (let i = 0; i < genreContainerCount; ++i) {
        const genreTags     = genreContainers[i].children;
        const genreTagCount = genreTags.length;

        for (let j = 0; j < genreTagCount; ++j) {
            genreWords.push(genreTags[j].textContent ? genreTags[j].textContent! : '');
        }
    }

    console.log(genreWords);
    //browser.runtime.sendMessage(
    //    new AppMessageGetConvertedGenreWordsRequest(genreWords)
    //)
    //.then((res: AppMessageGetConvertedGenreWordsResponse) => {
    //    console.log(res);
    //});
}