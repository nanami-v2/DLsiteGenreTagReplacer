
import { MessageGetGenreWordConversionMap } from "./message";
import { GenreWordConversionMap } from "./core/genre-word-conversion-map";
import { GenreWordConversionMode } from "./core/genre-word-conversion-mode";
import { GenreWordReplacer } from './core/genre-word-replacer';
import { GenreWordConverter } from "./core/genre-word-converter";

chrome.runtime.sendMessage(
    new MessageGetGenreWordConversionMap()
)
.then((conversionMap: GenreWordConversionMap) => {
    const wordConverter = new GenreWordConverter(GenreWordConversionMode.ToOldWords, conversionMap);
    const wordReplacer  = new GenreWordReplacer();

    wordReplacer.replaceGenreWords(document, wordConverter);
})
.catch((err) => {
    console.log(err);
});