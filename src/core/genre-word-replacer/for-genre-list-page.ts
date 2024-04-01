
import { GenreWordReplacer } from "../genre-word-replacer";
import { GenreWordConverter } from "../genre-word-converter";

export class GenreWordReplacerForGenreListPage implements GenreWordReplacer {
    public replaceGenreWords(
        htmlDocument      : Document,
        genreWordConverter: GenreWordConverter
    ): void {
        /*
            ```html
            <li class="versatility_linklist_item">
              <a href="...">
                <span class="number"></span>
              </a>
            </li>
            ```
        
            という形式になっている
        */
        const linkListItems     = htmlDocument.getElementsByClassName('versatility_linklist_item');
        const linkListItemCount = linkListItems.length;
        
        for (let i = 0; i < linkListItemCount; ++i) {
            const aTags     = linkListItems[i].children;
            const aTagCount = aTags.length;
        
            for (let j = 0; j < aTagCount; ++j) {
                const aTag          = aTags[j];
                const currentWord   = (aTag) ? aTag.childNodes[0].textContent! : '';
                const convertedWord = (aTag) ? genreWordConverter.convertGenreWord(currentWord) : null;
            
                if (convertedWord)
                    aTag.childNodes[0].textContent = convertedWord;
            }
        }
    }
}