
import { GenreWordConversionMap } from "./core/genre-word-conversion-map";
import { GenreWordConversionMapLoader } from "./core/genre-word-conversion-map-loader";
import { GenreWordReplacer } from './core/genre-word-replacer';
import {
    AppMessageGetGenreWordConversionMap,
} from "./app-message";

console.log('FFFFFFFFFFFFFFFFF');

browser.runtime.sendMessage(
    new AppMessageGetGenreWordConversionMap()
)
.then((conversionMap: GenreWordConversionMap) => {
    console.log('BBBBBBBBBB');
    const wordReplacer = new GenreWordReplacer();

    wordReplacer.replaceGenreWords(
        document,
        conversionMap
    );
})
.catch((err) => {
    console.log(err);
})