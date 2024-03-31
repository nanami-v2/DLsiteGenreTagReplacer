import { GenreWordConversionMap } from "./genre-word-conversion-map";
import { GenreWordConversionMode } from "./genre-word-conversion-mode";
import { SearchTextConverter } from "./search-text-converter";
import { SearchTextConverterToOldWords } from "./search-text-converter/to-old-words";
import { SearchTextConverterToNewWords } from "./search-text-converter/to-new-words";

export class SearchTextConverterFactory {
    createSearchTextConverter(
        conversionMap : GenreWordConversionMap,
        conversionMode: GenreWordConversionMode
    ): SearchTextConverter {
        return (conversionMode === GenreWordConversionMode.ToOldWords)
            ? new SearchTextConverterToOldWords(conversionMap)
            : new SearchTextConverterToNewWords(conversionMap);
    }
}