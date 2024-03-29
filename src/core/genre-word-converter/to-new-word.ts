
import { GenreWordConverter } from "../genre-word-converter";
import { GenreWordConversionMap } from "../genre-word-conversion-map";

export class GenreWordConverterToNewWord implements GenreWordConverter {
    constructor(conversionMap: GenreWordConversionMap) {
        this.conversionMap_ = conversionMap;
    }
    public convertGenreWord(word: string): string | null {
        const entry   = this.conversionMap_.entries.find((e) => e.oldWord === word);
        const newWord = (entry) ? entry.newWord : null;

        return newWord;
    }
    private conversionMap_ : GenreWordConversionMap;
}