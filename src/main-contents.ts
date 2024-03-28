
import { GenreWordConversionMap } from "./core/genre-word-conversion-map";
import { GenreWordConversionMapLoader } from "./core/genre-word-conversion-map-loader";
import { GenreWordReplacer } from './core/genre-word-replacer';

const conversionMapLoader   = new GenreWordConversionMapLoader();
const conversionMapFilePath = '/assets/genre-word-conversion-map.json';

conversionMapLoader.load(
    conversionMapFilePath
)
.then((conversionMap) => {
    const wordReplacer = new GenreWordReplacer();

    wordReplacer.replaceGenreWords(
        document,
        conversionMap
    );
})
.catch((err) => {
    console.log(err);
});