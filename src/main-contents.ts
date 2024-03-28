
import { AppMessageGetGenreWordConversionMap } from "./app-message";
import { GenreWordConversionMap } from "./core/genre-word-conversion-map";
import { GenreWordReplacer } from './core/genre-word-replacer';

browser.runtime.sendMessage(
    new AppMessageGetGenreWordConversionMap()
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
})