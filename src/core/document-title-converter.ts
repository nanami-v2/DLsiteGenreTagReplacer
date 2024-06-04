
import { GenreWordConversionMap } from "./genre-word-conversion-map";
import { GenreWordConversionMode } from "./genre-word-conversion-mode";

export class DocumentTitleConverter {
    constructor(
        conversionMap : GenreWordConversionMap,
        conversionMode: GenreWordConversionMode
    ) {
        this.conversionMap_ = conversionMap;
        this.conversionMode_ = conversionMode;
    }
    public convertDocumentTitle(documentTitle: string): string {
        /*
            ジャンルに対するタブ名として

            - 「ざぁ～こ♡」
            - 異種えっち トランス/暗示

            といった2パターンがあるようなので、それぞれで処理を分ける
        */
        const matches = documentTitle.match('「\(.+\)」');
        const matched = (matches !== null);

        if (matched) {
            const word  = matches[1];
            const entry = (this.conversionMode_ === GenreWordConversionMode.ToOldWords)
                ? this.conversionMap_.entries.find((e) => e.newWord === word)
                : this.conversionMap_.entries.find((e) => e.oldWord === word);

            if (!entry)
                return documentTitle;

            return (this.conversionMode_ === GenreWordConversionMode.ToOldWords)
                ? documentTitle.replace(word, entry.oldWord)
                : documentTitle.replace(word, entry.newWord);
        }
        else {
            const words          = documentTitle.split(' ');
            const convertedWords = words.map((word) => {
                const entry = (this.conversionMode_ === GenreWordConversionMode.ToOldWords)
                    ? this.conversionMap_.entries.find((e) => e.newWord === word)
                    : this.conversionMap_.entries.find((e) => e.oldWord === word);

                if (!entry)
                    return word;

                return (this.conversionMode_ === GenreWordConversionMode.ToOldWords)
                    ? entry.oldWord
                    : entry.newWord;
            });
            return convertedWords.join(' ');
        }
    }
    private conversionMap_ : GenreWordConversionMap;
    private conversionMode_: GenreWordConversionMode;
}