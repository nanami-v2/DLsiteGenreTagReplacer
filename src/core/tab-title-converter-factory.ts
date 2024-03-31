
import { GenreWordConversionMap } from "./genre-word-conversion-map";
import { GenreWordConversionMode } from "./genre-word-conversion-mode";
import { TabTitleConverter } from './tab-title-converter';
import { TabTitleConverterToOldWords } from './tab-title-converter/to-old-words';
import { TabTitleConverterToNewWords } from "./tab-title-converter/to-new-words";

export class TabTitleConverterFactory {
    public createTabTitleConverter(
        conversionMap : GenreWordConversionMap,
        conversionMode: GenreWordConversionMode
    ): TabTitleConverter {
        return (conversionMode === GenreWordConversionMode.ToOldWords)
            ? new TabTitleConverterToOldWords(conversionMap)
            : new TabTitleConverterToNewWords(conversionMap);
    }
}