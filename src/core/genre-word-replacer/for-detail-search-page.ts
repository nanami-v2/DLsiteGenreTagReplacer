
import { GenreWordReplacer } from "../genre-word-replacer";
import { GenreWordConverter } from "../genre-word-converter";

export class GenreWordReplacerForDetailSearchPage implements GenreWordReplacer {
    public replaceGenreWords(
        htmlDocument      : Document,
        genreWordConverter: GenreWordConverter
    ): void {
        /*
            「ジャンルを選択」で登場するダイアログの中身は

            ```html
            <li class="refine_checkbox">
              <a></a>
            </li>
            ```
        
            …という構造になっている。
            なお検索結果ページとは違い、ページ構成時に静的に確保されている模様。
        */
        const liTags     = htmlDocument.getElementsByClassName('refine_checkbox');
        const liTagCount = liTags.length;

        for (let i = 0; i < liTagCount; ++i) {
            const aTag          = (liTags[i].children.length > 0) ? liTags[i].children[0] : null;
            const currentWord   = (aTag) ? aTag.textContent! : '';
            const convertedWord = (currentWord) ? genreWordConverter.convertGenreWord(currentWord) : null;

            if (aTag && convertedWord)
                aTag.textContent = convertedWord;
        }
        /*
            ダイアログ経由でジャンルを選択すると、

            ```html
            <li class="select_label">
                XXX
                <input type="hidden">
            </li>
            ```
            
            という形で追加されるので、それに対する対応
        */
        const selectedLabels     = htmlDocument.getElementsByClassName('select_label');
        const selectedLabelCount = selectedLabels.length;

        for (let i = 0; i < selectedLabelCount; ++i) {
            if (selectedLabels[i].tagName !== 'LI')
                continue;
            /*
                innterTextで書き換えるとhiddenTagが消えてしまい、絞り込みが意味を成さなくなる
                よってfirstChildで直接テキストノードを弄って更新する
            */
            const currentWord   = (selectedLabels[i] as HTMLLIElement).innerText!;
            const convertedWord = genreWordConverter.convertGenreWord(currentWord);

            if (convertedWord)
                selectedLabels[i].firstChild!.nodeValue = convertedWord;
        }
    }
}