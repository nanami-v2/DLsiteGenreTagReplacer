import { GenreWordConversionMap, GenreWordConversionMapEntry } from "./genre-word-conversion-map";

export class GenreWordConversionMapLoader {
    public loadConversionMap(langCode: string): Promise<GenreWordConversionMap | null> {
        const filePath = (
            (langCode === 'en-US') ? '/genre-word-conversion-map/en.json'    :
            (langCode === 'ja-JP') ? '/genre-word-conversion-map/ja.json'    :
            (langCode === 'zh-TW') ? '/genre-word-conversion-map/zh_TW.json' : null
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
                    new GenreWordConversionMap(entries)
                );
            })
        );
    }
}