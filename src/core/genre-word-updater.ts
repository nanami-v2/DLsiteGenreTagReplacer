
import { GenreWordConversionMap } from "./genre-word-conversion-map";

export class GenreWordUpdater {
    public updateGenreWords(
        htmlDocument          : Document,
        genreWordConvertionMap: GenreWordConversionMap
    ) {
        const genreContainers     = htmlDocument.getElementsByClassName('main_genre');
        const genreContainerCount = genreContainers.length;

        for (let i = 0; i < genreContainerCount; ++i) {
            const genreTags     = genreContainers[i].children;
            const genreTagCount = genreTags.length;
    
            for (let j = 0; j < genreTagCount; ++j) {
                if (!genreTags[j].textContent)
                    continue;

                const oldWord = genreTags[j].textContent!;
                const newWord = genreWordConvertionMap.toNewWord(oldWord);

                console.log(oldWord, newWord);

                if (newWord)
                    genreTags[j].textContent = newWord;
            }
        }
    }
}