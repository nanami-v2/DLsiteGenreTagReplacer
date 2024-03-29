
import { Message } from "./message";
import { GenreWordConversionMap } from "./core/genre-word-conversion-map";
import { GenreWordConversionMode } from "./core/genre-word-conversion-mode";
import { GenreWordReplacer } from './core/genre-word-replacer';
import { GenreWordConverter } from "./core/genre-word-converter";
import { GenreWordConverterFactory } from "./core/genre-word-converter-factory";
import { GenreWordReplacerFactory } from "./core/genre-word-replacer-factory";
import { MessageType } from "./message-type";
import { MessageDataGetGenreWordConversionMap, MessageDataGetGenreWordConversionMode } from "./message-data";


const msgTypeGetGenreConversionMap  = MessageType.GetGenreWordConversionMap;
const msgTypeGenGenreConversionMode = MessageType.GetGenerWordConversionMode;
const msgDataGetGenreConversionMap  = new MessageDataGetGenreWordConversionMap();
const msgDataGetGenreConversionMode = new MessageDataGetGenreWordConversionMode();

Promise.all([
    chrome.runtime.sendMessage(
        new Message(
            msgTypeGetGenreConversionMap,
            msgDataGetGenreConversionMap
        )
    ),
    chrome.runtime.sendMessage(
        new Message(
            msgTypeGenGenreConversionMode,
            msgDataGetGenreConversionMode
        )
    )
])
.then((results: Array<any>) => {
    const conversionMap  = results[0] as GenreWordConversionMap;
    const conversionMode = results[1] as GenreWordConversionMode;

    const wordConverterFactory = new GenreWordConverterFactory();
    const wordReplacerFactory  = new GenreWordReplacerFactory();
    const wordConverter        = wordConverterFactory.createGenreWordConverter(conversionMap, conversionMode);
    const wordReplacer         = wordReplacerFactory.createGenreWordReplacer(window.location.toString());

    if (wordReplacer)
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
        const msgTypeGetGenreConversionMap  = MessageType.GetGenreWordConversionMap;
        const msgTypeGenGenreConversionMode = MessageType.GetGenerWordConversionMode;
        const msgDataGetGenreConversionMap  = new MessageDataGetGenreWordConversionMap();
        const msgDataGetGenreConversionMode = new MessageDataGetGenreWordConversionMode();
        
        Promise.all([
            chrome.runtime.sendMessage(
                new Message(
                    msgTypeGetGenreConversionMap,
                    msgDataGetGenreConversionMap
                )
            ),
            chrome.runtime.sendMessage(
                new Message(
                    msgTypeGenGenreConversionMode,
                    msgDataGetGenreConversionMode
                )
            )
        ])
        .then((results: Array<any>) => {
            const conversionMap  = results[0] as GenreWordConversionMap;
            const conversionMode = results[1] as GenreWordConversionMode;
        
            const wordConverterFactory = new GenreWordConverterFactory();
            const wordReplacerFactory  = new GenreWordReplacerFactory();
            const wordConverter        = wordConverterFactory.createGenreWordConverter(conversionMap, conversionMode);
            const wordReplacer         = wordReplacerFactory.createGenreWordReplacer(window.location.toString());
        
            if (wordReplacer)
                wordReplacer.replaceGenreWords(document, wordConverter);
        })
        .catch((err) => {
            console.log(err);
        });
    }
});
/*
    「他のジャンルで探す」などの場合、サーバーから取得したデータを基にダイアログを作成している
    なので、このような場合にも表記を変えるため、mutatioObserver で対象のノード――検索モーダル――を監視する必要がある 
*/
const mutationObserverTarget  = document.getElementById('container')!.children[3];
const mutationObserverOptions = {childList: true};
const mutationObserver       = new MutationObserver((
    mutations: MutationRecord[],
    observer : MutationObserver
) => {
    console.log('mutationObserver', mutations, observer);

    const msgTypeGetGenreConversionMap  = MessageType.GetGenreWordConversionMap;
    const msgTypeGenGenreConversionMode = MessageType.GetGenerWordConversionMode;
    const msgDataGetGenreConversionMap  = new MessageDataGetGenreWordConversionMap();
    const msgDataGetGenreConversionMode = new MessageDataGetGenreWordConversionMode();
    
    Promise.all([
        chrome.runtime.sendMessage(
            new Message(
                msgTypeGetGenreConversionMap,
                msgDataGetGenreConversionMap
            )
        ),
        chrome.runtime.sendMessage(
            new Message(
                msgTypeGenGenreConversionMode,
                msgDataGetGenreConversionMode
            )
        )
    ])
    .then((results: Array<any>) => {
        const conversionMap  = results[0] as GenreWordConversionMap;
        const conversionMode = results[1] as GenreWordConversionMode;
    
        const wordConverterFactory = new GenreWordConverterFactory();
        const wordReplacerFactory  = new GenreWordReplacerFactory();
        const wordConverter        = wordConverterFactory.createGenreWordConverter(conversionMap, conversionMode);
        const wordReplacer         = wordReplacerFactory.createGenreWordReplacer(window.location.toString());
    
        if (wordReplacer)
            wordReplacer.replaceGenreWords(document, wordConverter);
    })
    .catch((err) => {
        console.log(err);
    });
});
mutationObserver.observe(
    mutationObserverTarget,
    mutationObserverOptions
);