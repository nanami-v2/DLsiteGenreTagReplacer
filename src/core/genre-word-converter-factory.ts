
import { GenreWordConversionMap } from "./genre-word-conversion-map";
import { GenreWordConversionMode } from "./genre-word-conversion-mode";
import { GenreWordConverter } from "./genre-word-converter";
import { GenreWordConverterToOldWord } from "./genre-word-converter/to-old-word";
import { GenreWordConverterToNewWord } from "./genre-word-converter/to-new-word";


export class GenreWordConverterFactory {
    public createGenreWordConverter(
        conversionMap : GenreWordConversionMap,
        conversionMode: GenreWordConversionMode
    ): GenreWordConverter {
        return (conversionMode === GenreWordConversionMode.ToOldWords)
            ? new GenreWordConverterToOldWord(conversionMap)
            : new GenreWordConverterToNewWord(conversionMap);
    }
}