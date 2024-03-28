
import { GenreWordConversionMap } from "./genre-word-conversion-map";
import { GenreWordConversionMode } from "./genre-word-conversion-mode";

export class GenreWordReplacer {
    public replaceGenreWords(
        htmlDocument           : Document,
        genreWordConvertionMap : GenreWordConversionMap,
        genreWordConversionMode: GenreWordConversionMode
    ) {
        /*
            特にいい感じの方法が思いつかなかったので地道に頑張る
            ...DLsite側の変更に対して脆弱だけど、しょうがない
        */
        const genreTagContainers     = htmlDocument.getElementsByClassName('main_genre');
        const genreTagContainerCount = genreTagContainers.length;

        for (let i = 0; i < genreTagContainerCount; ++i) {
            const genreTags     = genreTagContainers[i].children;
            const genreTagCount = genreTags.length;
    
            for (let j = 0; j < genreTagCount; ++j) {
                /*
                    何故か「ファイル容量」の箇所にもgenreクラスがかかっているので、
                    aタグか否かでジャンルタグかどうかを判定
                */
                if (genreTags[j].tagName !== 'A' || !genreTags[j].textContent)
                    continue;

                const currentWord   = genreTags[j].textContent!
                const convertedWord = converGenretWord(
                    currentWord,
                    genreWordConvertionMap,
                    genreWordConversionMode
                );

                if (convertedWord)
                    genreTags[j].textContent = convertedWord;
            }
        }
    }
}

function converGenretWord(
    word              : string,
    wordConvertionMap : GenreWordConversionMap,
    wordConversionMode: GenreWordConversionMode
): string | null {
    if (wordConversionMode === GenreWordConversionMode.ToOldWords) {
        const entry   = wordConvertionMap.entries.find((e) => e.newWord === word);
        const oldWord = (entry) ? entry.oldWord : null;

        return oldWord;
    }
    else {
        const entry   = wordConvertionMap.entries.find((e) => e.oldWord === word);
        const newWord = (entry) ? entry.newWord : null;

        return newWord;
    }
}