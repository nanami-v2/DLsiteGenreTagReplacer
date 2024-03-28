
import { GenreWordConverter } from "./genre-word-converter";

export class GenreWordReplacer {
    public replaceGenreWords(
        htmlDocument      : Document,
        genreWordConverter: GenreWordConverter
    ): void {
        /*
            特にいい感じの方法が思いつかなかったので地道に頑張る
            ...DLsite側の変更に対して脆弱だけど、しょうがない

            NOTE
            何故か「ファイル容量」の箇所にもgenreクラスがかかっているので、
            最初のもの――本当の意味でジャンルタグになっているもの――だけに限定
        */
        const genreTagContainers = htmlDocument.getElementsByClassName('main_genre');
        const genreTags          = genreTagContainers[0].children;
        const genreTagCount      = genreTags.length;
    
        for (let i = 0; i < genreTagCount; ++i) {
            if (!genreTags[i].textContent)
                continue;

            const currentWord   = genreTags[i].textContent!
            const convertedWord = genreWordConverter.convertGenreWord(currentWord);

            if (convertedWord)
                genreTags[i].textContent = convertedWord;
        }
    }
}