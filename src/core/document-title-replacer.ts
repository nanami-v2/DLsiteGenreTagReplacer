
import { GenreWordConversionMap } from "./genre-word-conversion-map";
import { GenreWordConversionMode } from "./genre-word-conversion-mode";

export class DocumentTitleReplacer {
    constructor(
        conversionMap : GenreWordConversionMap,
        conversionMode: GenreWordConversionMode
    ) {
        this.conversionMap_ = conversionMap;
        this.conversionMode_ = conversionMode;
    }
    public replaceDocumentTitle(htmlDocument: Document): void {
        /*
            ジャンルに対するタブ名として

            - 「ざぁ～こ♡」
            - 異種えっち トランス/暗示

            といった2パターンがあるようなので、それぞれで処理を分ける
        */
        const matches = htmlDocument.title.match('「\(.+\)」');
        const matched = (matches !== null);

        if (matched) {
            const word  = matches[1];
            const entry = (this.conversionMode_ === GenreWordConversionMode.ToOldWords)
                ? this.conversionMap_.entries.find((e) => e.newWord === word)
                : this.conversionMap_.entries.find((e) => e.oldWord === word);

            if (!entry)
                return;

            htmlDocument.title = (this.conversionMode_ === GenreWordConversionMode.ToOldWords)
                ? htmlDocument.title.replace(word, entry.oldWord)
                : htmlDocument.title.replace(word, entry.newWord);
        }
        else {
            const words          = htmlDocument.title.split(' ');
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
            htmlDocument.title = convertedWords.join(' ');
        }
    }
    private conversionMap_ : GenreWordConversionMap;
    private conversionMode_: GenreWordConversionMode;
}