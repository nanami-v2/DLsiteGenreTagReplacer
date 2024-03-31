
import { TabTitleConverter } from "../tab-title-converter";
import { GenreWordConversionMap } from "../genre-word-conversion-map";

export class TabTitleConverterToNewWords implements TabTitleConverter {
    constructor(conversionMap: GenreWordConversionMap) {
        this.conversionMap_ = conversionMap;
    }
    public convertTabTitle(tabTitle: string): string {
        let newTitle = tabTitle;
        /*
            parseするのも面倒なので計算量は多いけど力技で突破
        */
        for (const entry of this.conversionMap_.entries)
            newTitle = newTitle.replace(entry.oldWord, entry.newWord);

        return newTitle;
    }
    private conversionMap_: GenreWordConversionMap;
}