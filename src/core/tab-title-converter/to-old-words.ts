
import { TabTitleConverter } from "../tab-title-converter";
import { GenreWordConversionMap } from "../genre-word-conversion-map";

export class TabTitleConverterToOldWords implements TabTitleConverter {
    constructor(conversionMap: GenreWordConversionMap) {
        this.conversionMap_ = conversionMap;
    }
    public convertTabTitle(tabTitle: string): string {
        /*
            ジャンルに対するタブ名として

            - 「ざぁ～こ♡」
            - 異種えっち トランス/暗示

            といった2パターンがあるようなので、それぞれで処理を分ける
        */
        const matches = tabTitle.match('「\(.+\)」');
        const matched = (matches !== null);

        if (matched) {
            const word  = matches[1];
            const entry = this.conversionMap_.entries.find((e) => e.newWord === word);

            return (entry) ? tabTitle.replace(word, entry.oldWord) : tabTitle;
        }
        else {
            const words          = tabTitle.split(' ');
            const convertedWords = words.map((word) => {
                const entry   = this.conversionMap_.entries.find((e) => e.newWord === word);
                const oldWord = (entry) ? entry.oldWord : word;

                return oldWord;
            });

            return convertedWords.join(' ');
        }
    }
    private conversionMap_: GenreWordConversionMap;
}