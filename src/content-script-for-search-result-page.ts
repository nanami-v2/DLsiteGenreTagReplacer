
import { Message } from "./message";
import { GenreWordConversionMap } from "./core/genre-word-conversion-map";
import { GenreWordConversionMode } from "./core/genre-word-conversion-mode";
import { GenreWordConverterFactory } from "./core/genre-word-converter-factory";
import { GenreWordReplacerFactory } from "./core/genre-word-replacer-factory";
import { MessageType } from "./message-type";
import { MessageData,  MessageDataEchoMessage,  MessageDataGetGenreWordConversionMap, MessageDataGetGenreWordConversionMode, MessageDataReplaceGenreWord } from "./message-data";

chrome.runtime.onMessage.addListener((
    message      : any,
    messageSender: chrome.runtime.MessageSender,
    sendResponse : (response: any) => void
) => {
    switch ((message as Message).type) {
        case MessageType.ReplaceGenreWord:
            doReplaceGenreWords();
    }
});
/*
    「他のジャンルで探す」などの場合、サーバーから取得したデータを基にダイアログを作成している
    なので、このような場合にも表記を変えるため、mutatioObserver で対象のノード――検索モーダル――を監視する必要がある 

    なお、下記は検索結果ページの一例であって、
    
    - 「同人」の検索結果ページ
    - 「美少女ゲーム」の検索結果ページ

    とでは微妙に構造が違う。が、いずれにしてもid="wrapper"の次に検索結果ダイアログを挿入するつくりにはなっている。
  
    ```html
    <body>
      <div id="container">
        <div id="top_header"></div>
        <div id="header"></div>
        <div id="top_wrapper"></div>
        <div id="wrapper"></div>
        <div></div>
      </div>
    </body>
    ```      
*/
const mutationObserverTarget  = document.getElementById('wrapper')!.nextSibling!;
const mutationObserverOptions = {childList: true};
const mutationObserver       = new MutationObserver((
    mutations: MutationRecord[],
    observer : MutationObserver
) => {
    console.log('mutationObserver', mutations, observer);

    doReplaceGenreWords();
});
mutationObserver.observe(
    mutationObserverTarget,
    mutationObserverOptions
);
/*
    初回はオートで実行
*/
doReplaceGenreWords();


function doReplaceGenreWords() {
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