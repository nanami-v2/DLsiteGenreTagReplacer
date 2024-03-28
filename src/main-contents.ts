
import { Message, MessageGetGenreWordConversionMap, MessageGetGenreWordConversionMode, MessageType } from "./message";
import { GenreWordConversionMap } from "./core/genre-word-conversion-map";
import { GenreWordConversionMode } from "./core/genre-word-conversion-mode";
import { GenreWordReplacer } from './core/genre-word-replacer';
import { GenreWordConverter } from "./core/genre-word-converter";


Promise.all([
    chrome.runtime.sendMessage(new MessageGetGenreWordConversionMap()),
    chrome.runtime.sendMessage(new MessageGetGenreWordConversionMode())
])
.then((results: Array<any>) => {
    const conversionMap  = results[0] as GenreWordConversionMap;
    const conversionMode = results[1] as GenreWordConversionMode;

    const wordConverter = new GenreWordConverter(conversionMap, conversionMode);
    const wordReplacer  = new GenreWordReplacer();

    wordReplacer.replaceGenreWords(document, wordConverter);
})
.catch((err) => {
    console.log(err);
});

chrome.runtime.onMessage.addListener((
    message      : any,
    messageSender: chrome.runtime.MessageSender,
    sendResponse : (response: any) => void
) => {
    const msg     = message as Message;
    const msgType = msg.type;

    if (msgType === MessageType.ReplaceGenreWord) {
        Promise.all([
            chrome.runtime.sendMessage(new MessageGetGenreWordConversionMap()),
            chrome.runtime.sendMessage(new MessageGetGenreWordConversionMode())
        ])
        .then((results: Array<any>) => {
            const conversionMap  = results[0] as GenreWordConversionMap;
            const conversionMode = results[1] as GenreWordConversionMode;
        
            const wordConverter = new GenreWordConverter(conversionMap, conversionMode);
            const wordReplacer  = new GenreWordReplacer();
        
            wordReplacer.replaceGenreWords(document, wordConverter);
        })
        .catch((err) => {
            console.log(err);
        });
    }
});

const mutationObserver = new MutationObserver((
    mutations: MutationRecord[],
    observer : MutationObserver
) => {
    console.log(mutations, observer);
});
mutationObserver.observe(document);