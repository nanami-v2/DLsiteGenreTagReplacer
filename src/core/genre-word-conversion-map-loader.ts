import { GenreWordConversionMap, GenreWordConversionMapEntry } from "./genre-word-conversion-map";

export class GenreWordConversionMapLoader {
    public loadConversionMap(langCode: string): Promise<GenreWordConversionMap | null> {
        if (!(langCode === 'ja-jp' || langCode === 'en-us'))
            return Promise.resolve(null);

        const filePath = (langCode === 'ja-jp')
            ? '/assets/genre-word-conversion-map-ja.json'
            : '/assets/genre-word-conversion-map-en.json';

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