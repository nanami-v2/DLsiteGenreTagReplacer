
import { GenreWordReplacer } from "../genre-word-replacer";
import { GenreWordConverter } from "../genre-word-converter";

export class GenreWordReplacerForDetailSearchPage implements GenreWordReplacer {
    public replaceGenreWords(
        htmlDocument      : Document,
        genreWordConverter: GenreWordConverter
    ): void {
        /*
            「ジャンルを選択」で登場するダイアログの中身は
        
            <li class="refine_checkbox">
              <a></a>
            </li>
        
            …という構造になっている。
            なお検索結果ページとは違い、ページ構成時に静的に確保されている模様。
        */
        const liTags     = htmlDocument.getElementsByClassName('refine_checkbox');
        const liTagCount = liTags.length;

        console.log(liTags);

        for (let i = 0; i < liTagCount; ++i) {
            const aTag = (liTags[i].children.length > 0) ? liTags[i].children[0] : null;
            const word = (aTag) ? aTag.textContent! : '';

            if (aTag)
                aTag.textContent = genreWordConverter.convertGenreWord(word);
        }
    }
}