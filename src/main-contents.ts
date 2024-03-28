
import { MessageGetGenreWordConversionMap } from "./message";
import { GenreWordConversionMap } from "./core/genre-word-conversion-map";
import { GenreWordConversionMode } from "./core/genre-word-conversion-mode";
import { GenreWordReplacer } from './core/genre-word-replacer';

chrome.runtime.sendMessage(
    new MessageGetGenreWordConversionMap()
)
.then((conversionMap: GenreWordConversionMap) => {
    const wordReplacer = new GenreWordReplacer();

    wordReplacer.replaceGenreWords(
        document,
        conversionMap,
        GenreWordConversionMode.ToOldWords
    );
})
.catch((err) => {
    console.log(err);
});