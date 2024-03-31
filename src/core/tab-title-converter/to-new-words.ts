
import { TabTitleConverter } from "../tab-title-converter";
import { GenreWordConversionMap } from "../genre-word-conversion-map";

export class TabTitleConverterToNewWords implements TabTitleConverter {
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
            const entry = this.conversionMap_.entries.find((e) => e.oldWord === word);

            return (entry) ? tabTitle.replace(word, entry.newWord) : tabTitle;
        }
        else {
            const words          = tabTitle.split(' ');
            const convertedWords = words.map((word) => {
                const entry         = this.conversionMap_.entries.find((e) => e.oldWord === word);
                const convertedWord = (entry) ? entry.newWord : word;

                return convertedWord;
            });

            return convertedWords.join(' ');
        }
    }
    private conversionMap_: GenreWordConversionMap;
}