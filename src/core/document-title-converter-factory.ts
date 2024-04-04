
import { GenreWordConversionMap } from "./genre-word-conversion-map";
import { GenreWordConversionMode } from "./genre-word-conversion-mode";
import { DocumentTitleConverter } from './document-title-converter';
import { DocumentTitleConverterToOldWords } from './document-title-converter/to-old-words';
import { DocumentTitleConverterToNewWords } from "./document-title-converter/to-new-words";

export class DocumentTitleConverterFactory {
    public createDocumentTitleConverter(
        conversionMap : GenreWordConversionMap,
        conversionMode: GenreWordConversionMode
    ): DocumentTitleConverter {
        return (conversionMode === GenreWordConversionMode.ToOldWords)
            ? new DocumentTitleConverterToOldWords(conversionMap)
            : new DocumentTitleConverterToNewWords(conversionMap);
    }
}