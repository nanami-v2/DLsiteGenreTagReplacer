
import { MessageGetGenreWordConversionMap, MessageGetGenreWordConversionMode } from "./message";
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