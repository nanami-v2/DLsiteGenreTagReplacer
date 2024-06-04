
import { GenreWordConversionMode } from "./genre-word-conversion-mode";

export class LocalStorage {
    public clear(): Promise<void> {
        return chrome.storage.local.clear();
    }
    public loadConversionMode(): Promise<GenreWordConversionMode | null> {
        return (
            chrome.storage.local.get('conversionMode')
            .then((result) => {
                if (result['conversionMode'] === undefined)
                    return Promise.resolve(null);
                else
                    return Promise.resolve(result['conversionMode'] as GenreWordConversionMode);
            })
        );
    }
    public saveConversionMode(conversionMode: GenreWordConversionMode): Promise<void> {
        return chrome.storage.local.set(
            {'conversionMode': conversionMode}
        );
    }
}