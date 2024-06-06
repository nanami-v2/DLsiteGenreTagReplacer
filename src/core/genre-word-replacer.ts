
import { GenreWordConverter } from "./genre-word-converter";
import { GenreWordReplaceTargetPage } from "./genre-word-replace-target-page";

export class GenreWordReplacer {
    constructor(targetPage: GenreWordReplaceTargetPage) {
        this.target_ = targetPage;
    }
    public replaceGenreWords(
        htmlDocument      : Document,
        genreWordConverter: GenreWordConverter
    ): void {
        switch (this.target_) {
            case GenreWordReplaceTargetPage.GenreListPage:
                return onGenreListPage(htmlDocument, genreWordConverter);
            case GenreWordReplaceTargetPage.ProductPage:
                return onProductPage(htmlDocument, genreWordConverter);
            case GenreWordReplaceTargetPage.SearchResultPage:
                return onSearchResultPage(htmlDocument, genreWordConverter);
            case GenreWordReplaceTargetPage.DetailSearchPage:
                return onDetailSearchPage(htmlDocument, genreWordConverter);
        }
    }
    private target_: GenreWordReplaceTargetPage;
}

function onGenreListPage(htmlDocument: Document, genreWordConverter: GenreWordConverter): void {
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

function onProductPage(htmlDocument: Document, genreWordConverter: GenreWordConverter): void {
    /*
        画面上部のジャンルタグ一覧は

        ```html
        <div class="main_genre">
          <a href="..."></a>
        </div>
        ```

        となっている
    */
    const genreTagContainers     = htmlDocument.getElementsByClassName('main_genre');
    const genreTagContainerCount = genreTagContainers.length;

    for (let i = 0; i < genreTagContainerCount; ++i) {
        const genreTags     = genreTagContainers[i].children;
        const genreTagCount = genreTags.length;
        /*
            何故か「ファイル容量」の箇所にも main_genre クラスがかかっているので、
            最初のもの――本当の意味でジャンルタグになっているもの――だけに限定
        */
        for (let j = 0; j < genreTagCount; ++j) {
            if (genreTags[j].tagName !== 'A' || !genreTags[j].textContent)
                continue;

            const currentWord   = genreTags[j].textContent!
            const convertedWord = genreWordConverter.convertGenreWord(currentWord);

            if (convertedWord)
                genreTags[j].textContent = convertedWord;
        }
    }
}

function onSearchResultPage(htmlDocument: Document, genreWordConverter: GenreWordConverter): void {
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

function onDetailSearchPage(htmlDocument: Document, genreWordConverter: GenreWordConverter): void {
    /*
    「ジャンルを選択」で登場するダイアログの中身は

    ```html
    <li class="refine_checkbox">
      <a></a>
    </li>
    ```

    …という構造になっている
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