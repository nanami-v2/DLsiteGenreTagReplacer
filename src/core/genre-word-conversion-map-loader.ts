
import { GenreWordConversionMap } from "./genre-word-conversion-map";

export class GenreWordConversionMapLoader {
    public load(filePath: string): Promise<GenreWordConversionMap> {
        return (
            fetch(browser.runtime.getURL(filePath))
            .then((res: Response) => {
                if (!res.ok)
                    throw new Error(res.statusText);

                return res.json() as Promise<Array<any>>;
            })
            .then((entries: Array<any>) => {
                const conversionMap = new GenreWordConversionMap();

                for (const entry of entries) {
                    const oldWord: string = entry.oldWord;
                    const newWord: string = entry.newWord;

                    conversionMap.mapToNewWord.set(oldWord, newWord);
                    conversionMap.mapToOldWord.set(newWord, oldWord);
                }
                return Promise.resolve(conversionMap);
            })
            .catch((err) => { throw err; })
        );
    }
}