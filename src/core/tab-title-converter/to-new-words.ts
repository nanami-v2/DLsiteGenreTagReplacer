
import { TabTitleConverter } from "../tab-title-converter";
import { GenreWordConversionMap } from "../genre-word-conversion-map";

export class TabTitleConverterToNewWords implements TabTitleConverter {
    constructor(conversionMap: GenreWordConversionMap) {
        this.conversionMap_ = conversionMap;
    }
    public convertTabTitle(tabTitle: string): string {
        const matches = tabTitle.match('「\(.+\)」');
        const matched = (matches !== null);

        if (matched) {
            const word  = matches[1];
            const entry = this.conversionMap_.entries.find((e) => e.oldWord === word);

            return tabTitle.replace(word, entry!.newWord);
        }
        else {
            const words          = tabTitle.split(' ');
            const convertedWords = words.map((word) => {
                const entry   = this.conversionMap_.entries.find((e) => e.oldWord === word);
                const newWord = (entry) ? entry.newWord : word;

                return newWord;
            });
            return convertedWords.join(' ');
        }
    }
    private conversionMap_: GenreWordConversionMap;
}