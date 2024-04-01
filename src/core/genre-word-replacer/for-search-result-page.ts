
import { GenreWordReplacer } from "../genre-word-replacer";
import { GenreWordConverter } from "../genre-word-converter";

export class GenreWordReplacerForSearchResultPage implements GenreWordReplacer {
    public replaceGenreWords(
        htmlDocument      : Document,
        genreWordConverter: GenreWordConverter
    ): void {
        /*
            画面上部の検索タグ
        
            ```html
            <ul class="search_tag_items>
              <li>
                <a href="#"></a>
              </li>
            </ul>
            ```
        
            …という構造になっている
        */
        const searchTagItems = htmlDocument.getElementsByClassName('search_tag_items');
        const searchTagCount = searchTagItems.length;
    
        for (let i = 0; i < searchTagCount; ++i) {
            const liTags     = searchTagItems[i].children;
            const liTagCount = liTags.length;
    
            for (let j = 0; j < liTagCount; ++j) {
                const aTag          = liTags[j].children[0];
                const currentWord   = (aTag) ? aTag.textContent! : '';
                const convertedWord = (aTag) ? genreWordConverter.convertGenreWord(currentWord) : null;
    
                if (aTag && convertedWord)
                    aTag.textContent = convertedWord;
            }
        }
        /*
            画面左側の検索タグ
            
            ```html
            <li class="left_refine_list_item refine_checkbox">
              <a href="#"></a>
            </li>
            ```
    
            …という構造になっている
        */
        const leftRefineListItems     = htmlDocument.getElementsByClassName('left_refine_list_item');
        const leftRefineListItemCount = leftRefineListItems.length;
    
        for (let i = 0; i < leftRefineListItemCount; ++i) {
            const aTags     = leftRefineListItems[i].children;
            const aTagCount = aTags.length;
    
            for (let j = 0; j < aTagCount; ++j) {
                /*
                    なんか atag じゃない事例もあったのでその対処
                */
                if (aTags[j].tagName !== 'A')
                    continue;

                const currentWord   = aTags[j].textContent!
                const convertedWord = genreWordConverter.convertGenreWord(currentWord);
    
                if (convertedWord)
                    aTags[j].textContent = convertedWord;
            }
        }
    }
}