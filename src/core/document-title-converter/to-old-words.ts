
import { DocumentTitleConverter } from "../document-title-converter";
import { GenreWordConversionMap } from "../genre-word-conversion-map";

export class DocumentTitleConverterToOldWords implements DocumentTitleConverter {
    constructor(conversionMap: GenreWordConversionMap) {
        this.conversionMap_ = conversionMap;
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
            const entry = this.conversionMap_.entries.find((e) => e.newWord === word);

            return (entry) ? documentTitle.replace(word, entry.oldWord) : documentTitle;
        }
        else {
            const words          = documentTitle.split(' ');
            const convertedWords = words.map((word) => {
                const entry         = this.conversionMap_.entries.find((e) => e.newWord === word);
                const convertedWord = (entry) ? entry.oldWord : word;

                return convertedWord;
            });

            return convertedWords.join(' ');
        }
    }
    private conversionMap_: GenreWordConversionMap;
}