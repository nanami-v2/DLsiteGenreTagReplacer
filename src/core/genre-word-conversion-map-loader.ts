
import {
    GenreWordConversionMap,
    GenreWordConversionMapEntry
} from "./genre-word-conversion-map";

export class GenreWordConversionMapLoader {
    public loadGenreWordConversionMap(filePath: string): Promise<GenreWordConversionMap> {
        return (
            fetch(chrome.runtime.getURL(filePath))
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

                    conversionMap.entries.push(
                        new GenreWordConversionMapEntry(
                            oldWord,
                            newWord
                        )
                    );
                }
                return Promise.resolve(conversionMap);
            })
            .catch((err) => { throw err; })
        );
    }
}