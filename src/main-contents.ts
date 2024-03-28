
import { MessageGetGenreWordConversionMap } from "./message";
import { GenreWordConversionMap } from "./core/genre-word-conversion-map";
import { GenreWordReplacer } from './core/genre-word-replacer';

browser.runtime.sendMessage(
    new MessageGetGenreWordConversionMap()
)
.then((conversionMap: GenreWordConversionMap) => {
    const wordReplacer = new GenreWordReplacer();

    wordReplacer.replaceGenreWords(
        document,
        conversionMap
    );
})
.catch((err) => {
    console.log(err);
});