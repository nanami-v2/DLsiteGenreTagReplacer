
import { GenreWordConversionMap } from "./genre-word-conversion-map";

export class GenreWordReplacer {
    public replaceGenreWords(
        htmlDocument          : Document,
        genreWordConvertionMap: GenreWordConversionMap
    ) {
        /*
            特にいい感じの方法が思いつかなかったので地道に頑張る
            ...DLsite側の変更に対して脆弱だけど、しょうがない
        */
        const genreContainers     = htmlDocument.getElementsByClassName('main_genre');
        const genreContainerCount = genreContainers.length;

        for (let i = 0; i < genreContainerCount; ++i) {
            const genreTags     = genreContainers[i].children;
            const genreTagCount = genreTags.length;
    
            for (let j = 0; j < genreTagCount; ++j) {
                if (!genreTags[j].textContent)
                    continue;

                const newWord = genreTags[j].textContent!;
                const oldWord = genreWordConvertionMap.mapToOldWord.get(newWord);

                console.log(newWord, oldWord);

                if (oldWord)
                    genreTags[j].textContent = oldWord;
            }
        }
    }
}