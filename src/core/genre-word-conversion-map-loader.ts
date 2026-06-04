import { GenreWordConversionMap, GenreWordConversionMapEntry } from "./genre-word-conversion-map";

export class GenreWordConversionMapLoader {
    public loadConversionMap(langCode: string): Promise<GenreWordConversionMap | null> {
        /*
            DLsite.comの言語コードに対応
        */
        const filePath = (
            (langCode === 'en-US' || langCode === 'en-us') ? '/genre-word-conversion-map/en-US.json' :
            (langCode === 'ja-JP' || langCode === 'ja-jp') ? '/genre-word-conversion-map/ja-JP.json' :
            (langCode === 'zh-TW' || langCode === 'zh-tw') ? '/genre-word-conversion-map/zh-TW.json' : null
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