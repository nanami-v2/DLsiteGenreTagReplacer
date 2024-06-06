
import { GenreWordConverter } from "./genre-word-converter";

export class DocumentTitleReplacer {
    public replaceDocumentTitle(
        htmlDocument      : Document,
        genreWordConverter: GenreWordConverter
    ): void {
        if (htmlDocument.documentElement.lang === 'ja-jp')
            return onJapanesePage(htmlDocument, genreWordConverter);

        if (htmlDocument.documentElement.lang === 'en-us')
            return onEnglishPage(htmlDocument, genreWordConverter);
    }
}

function onJapanesePage(
    htmlDocument      : Document,
    genreWordConverter: GenreWordConverter
): void {
    /*
        ジャンルに対するタブ名として

        - 「ざぁ～こ♡」
        - 異種えっち トランス/暗示

        といった2パターンがあるようなので、それぞれで処理を分ける
    */
    const matches = htmlDocument.title.match('「\(.+\)」');
    const matched = (matches !== null);

    if (matched) {
        const word          = matches[1];
        const convertedWord = genreWordConverter.convertGenreWord(word);
        
        if (convertedWord)
            htmlDocument.title = htmlDocument.title.replace(word, convertedWord);
    }
    else {
        const words          = htmlDocument.title.split(' ');
        const convertedWords = words.map((word) => {
            const convertedWord      = genreWordConverter.convertGenreWord(word);
            const convertedWordExists = (convertedWord !== null);

            return (convertedWordExists) ? convertedWord : word;
        });
        htmlDocument.title = convertedWords.join(' ');
    }
}

function onEnglishPage(
    htmlDocument      : Document,
    genreWordConverter: GenreWordConverter
): void {
    /*
        日本語版と違い、ジャンルタグ名に対して

        - [Petite]

        という[]で囲った形式しか見当たらなかったので1パターンっぽい
    */
    const matches = htmlDocument.title.match(/\[(.+)\]/);
    const matched = (matches !== null);

    if (matched) {
        const word          = matches[1];
        const convertedWord = genreWordConverter.convertGenreWord(word);

        if (convertedWord)
            htmlDocument.title = htmlDocument.title.replace(word, convertedWord);
    }
}