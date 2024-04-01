
import { GenreWordReplacer } from "../genre-word-replacer";
import { GenreWordConverter } from "../genre-word-converter";

export class GenreWordReplacerForProductPage implements GenreWordReplacer {
    public replaceGenreWords(
        htmlDocument      : Document,
        genreWordConverter: GenreWordConverter
    ): void {
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
}