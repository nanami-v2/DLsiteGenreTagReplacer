import { GenreWordConversionMap, GenreWordConversionMapEntry } from "./core/genre-word-conversion-map";
import { GenreWordConversionMode } from "./core/genre-word-conversion-mode";

export class Storage {
    public init(defaultConversionMode: GenreWordConversionMode): Promise<void> {
        return (
            chrome.storage.local
            .clear()
            .then(() => {
                return chrome.storage.local.set({'conversionMode': defaultConversionMode});
            })
        );
    }
    public loadConversionMap(): Promise<GenreWordConversionMap> {
        return (
            fetch(chrome.runtime.getURL('/assets/genre-word-conversion-map-ja.json'))
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
    public loadConversionMode(): Promise<GenreWordConversionMode> {
        return (
            chrome.storage.local
            .get('conversionMode')
            .then((result) => {
                if (result['conversionMode'] === undefined)
                    return Promise.resolve(GenreWordConversionMode.ToOldWords);
                else
                    return Promise.resolve(result['conversionMode'] as GenreWordConversionMode);
            })
        );
    }
    public loadAllTabIds(): Promise<Array<number>> {
        return (
            chrome.storage.session
            .get()
            .then((result) => {
                const tabIds = new Array<number>();

                for (const [k, v] of Object.entries(result))
                    if (k.includes('tabId-'))
                        tabIds.push(v);
                
                return Promise.resolve(tabIds);
            })
        );
    }
    public saveConversionMode(conversionMode: GenreWordConversionMode): Promise<void> {
        return (
            chrome.storage.local
            .set({'conversionMode': conversionMode})
        );
    }
    public saveTabId(tabId: number): Promise<void> {
        /*
            ストレージへのアクセスは並行して行われるため、
            「load & store」という戦略は使えない――「Lost Update」が生じてしまうので。

            なのでデータ構造もそれに制約を受け、tabIdを配列形式で保存しておくということができない。
        */
        return (
            chrome.storage.session
            .set({[`tabId-${tabId}`]: tabId})
        );
    }
    public deleteTabId(tabId: number): Promise<void> {
        /*
            ストレージへのアクセスは並行して行われるため、
            「load & store」という戦略は使えない――「Lost Update」が生じてしまうので。

            なのでデータ構造もそれに制約を受け、tabIdを配列形式で保存しておくということができない。
        */
        return (
            chrome.storage.session
            .remove(`tabId-${tabId}`)
        );
    }
}