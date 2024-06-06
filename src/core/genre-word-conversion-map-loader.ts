import { GenreWordConversionMap, GenreWordConversionMapEntry } from "./genre-word-conversion-map";

export class GenreWordConversionMapLoader {
    public loadConversionMap(langCode: string): Promise<GenreWordConversionMap | null> {
        const filePath = (
            (langCode === 'ja-jp') ? '/assets/genre-word-conversion-map-ja.json':
            (langCode === 'en-us') ? '/assets/genre-word-conversion-map-en.json'
                                   : null
        );

        if (!filePath)
            return Promise.resolve(null);

        return (
            fetch(chrome.runtime.getURL(filePath))
            .then((res: Response) => {
                if (!res.ok)
                    throw new Error(res.statusText);

                return res.json();
            })
            .then((entries: Array<GenreWordConversionMapEntry>) => {
                return Promise.resolve(
                    new GenreWordConversionMap(langCode, entries)
                );
            })
        );
    }
}