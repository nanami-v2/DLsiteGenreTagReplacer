
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
                /*
                    何故か「ファイル容量」の箇所にもgenreクラスがかかっているので、
                    aタグか否かでジャンルタグかどうかを判定
                */
                if (genreTags[j].tagName !== 'A' || !genreTags[j].textContent)
                    continue;

                const newWord = genreTags[j].textContent!;
                const entry   = genreWordConvertionMap.entries.find((e) => e.newWord === newWord);
                const oldWord = (entry) ? entry.oldWord : null;

                if (oldWord)
                    genreTags[j].textContent = oldWord;
            }
        }
    }
}