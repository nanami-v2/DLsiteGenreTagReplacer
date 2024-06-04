
export class SessionStorage {
    public loadAllTabIds(): Promise<Array<number>> {
        return (
            chrome.storage.session.get()
            .then((result) => {
                const tabIds = new Array<number>();

                for (const [k, v] of Object.entries(result))
                    if (k.includes('tabId-'))
                        tabIds.push(v);
                
                return Promise.resolve(tabIds);
            })
        );
    }
    public saveTabId(tabId: number): Promise<void> {
        /*
            ストレージへのアクセスは並行して行われるため、
            「load & store」という戦略は使えない――「Lost Update」が生じてしまうので。

            なのでデータ構造もそれに制約を受け、tabIdを配列形式で保存しておくということができない。
        */
        return chrome.storage.session.set(
            {[`tabId-${tabId}`]: tabId}
        );
    }
    public deleteTabId(tabId: number): Promise<void> {
        /*
            ストレージへのアクセスは並行して行われるため、
            「load & store」という戦略は使えない――「Lost Update」が生じてしまうので。

            なのでデータ構造もそれに制約を受け、tabIdを配列形式で保存しておくということができない。
        */
        return chrome.storage.session.remove(
            `tabId-${tabId}`
        );
    }
}