
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

                return res.json();
            })
            .then((entries: Array<GenreWordConversionMapEntry>) => {
                return Promise.resolve(
                    new GenreWordConversionMap(entries)
                );
            })
        );
    }
}