
import { GenreWordConversionMap } from "../genre-word-conversion-map";
import { SearchTextConverter } from "../search-text-converter";

export class SearchTextConverterToNewWords implements SearchTextConverter {
    constructor(conversionMap: GenreWordConversionMap) {
        this.conversionMap_ = conversionMap;
    }
    public convertSearchText(searchText: string): string {
        const searchWords          = searchText.split(' ');
        const convertedSearchWords = searchWords.map((searchWord) => {
            const entry               = this.conversionMap_.entries.find((e) => e.oldWord === searchWord);
            const convertedSearchWord = (entry) ? entry.oldWord : searchWord;

            return convertedSearchWord;
        });
        
        return convertedSearchWords.join(' ');
    }
    private conversionMap_: GenreWordConversionMap;
}