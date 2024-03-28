
import { GenreWordConverter } from "./genre-word-converter";

export class GenreWordReplacer {
    public replaceGenreWords(
        htmlDocument      : Document,
        genreWordConverter: GenreWordConverter
    ): void {
        replaceGenreWordsOfProductPage(htmlDocument, genreWordConverter);
        replaceGenreWordsOfSearchResultPage(htmlDocument, genreWordConverter);
    }
}

function replaceGenreWordsOfProductPage(
    htmlDocument      : Document,
    genreWordConverter: GenreWordConverter
): void {
    /*
        特にいい感じの方法が思いつかなかったので地道に頑張る
        ...DLsite側の変更に対して脆弱だけど、しょうがない
    */
    const genreTagContainers     = htmlDocument.getElementsByClassName('main_genre');
    const genreTagContainerCount = genreTagContainers.length;

    for (let i = 0; i < genreTagContainerCount; ++i) {
        const genreTags     = genreTagContainers[i].children;
        const genreTagCount = genreTags.length;
        /*
            何故か「ファイル容量」の箇所にもgenreクラスがかかっているので、
            最初のもの――本当の意味でジャンルタグになっているもの――だけに限定
        */
        for (let j = 0; j < genreTagCount; ++j) {
            if (genreTags[j].tagName !== 'A' || !genreTags[j].textContent)
                continue;

            const currentWord   = genreTags[j].textContent!
            const convertedWord = genreWordConverter.convertGenreWord(currentWord);

            if (convertedWord)
                genreTags[j].textContent = convertedWord;

            console.log(currentWord, convertedWord);
        }
    }
}

function replaceGenreWordsOfSearchResultPage(
    htmlDocument      : Document,
    genreWordConverter: GenreWordConverter
): void {
    /*
        画面上部の検索タグ

        <ul class="search_tag_items>
          <li>
            <a href="#"></a>
          </li>
        </ul>

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

            console.log(aTag, currentWord);

            if (convertedWord)
                aTag.textContent = convertedWord;
        }
    }
    /*
        画面左側の検索タグ
        
        <li class="left_refine_list_add">
          <a href="#"></a>
        </li>
  
        あるいは

        <li class="left_refine_list_item refine_checkbox">
          <a href="#"></a>
        </li>

        …という構造になっている
    */
    const leftRefineListItems     = htmlDocument.getElementsByClassName('left_refine_list_item');
    const leftRefineListItemCount = leftRefineListItems.length;

    for (let i = 0; i < leftRefineListItemCount; ++i) {
        const aTags     = leftRefineListItems[i].children;
        const aTagCount = aTags.length;

        for (let j = 0; j < aTagCount; ++j) {
            const aTag          = aTags[j];
            const currentWord   = (aTag) ? aTag.textContent! : '';
            const convertedWord = (aTag) ? genreWordConverter.convertGenreWord(currentWord) : null;

            console.log('XXXX', aTags[j], currentWord);

            if (convertedWord)
                aTag.textContent = convertedWord;
        }
    }
}