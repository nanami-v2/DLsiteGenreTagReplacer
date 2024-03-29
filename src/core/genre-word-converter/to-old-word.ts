
import { GenreWordConverter } from "../genre-word-converter";
import { GenreWordConversionMap } from "../genre-word-conversion-map";

export class GenreWordConverterToOldWord implements GenreWordConverter {
    constructor(conversionMap: GenreWordConversionMap) {
        this.conversionMap_ = conversionMap;
    }
    public convertGenreWord(word: string): string | null {
        const entry   = this.conversionMap_.entries.find((e) => e.newWord === word);
        const oldWord = (entry) ? entry.oldWord : null;

        return oldWord;
    }
    private conversionMap_ : GenreWordConversionMap;
}