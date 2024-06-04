import { GenreWordConversionMode } from "./genre-word-conversion-mode";

export class ContextMenu {
    public create(
        defaultConversionMode: GenreWordConversionMode
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            chrome.contextMenus.create(
                {
                    type               : 'normal',
                    id                 : '43ae9812-9ca5-425d-b12f-c617f91f9095', /* GUID */
                    title              : getTitleTextForNextFlip(defaultConversionMode),
                    contexts           : ['page'],
                    documentUrlPatterns: ['*://www.dlsite.com/*']
                },
                () => resolve()
            );
        });
    }
    public updateTitleText(
        contextMenuItemId    : string | number,
        currentConversionMode: GenreWordConversionMode
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            chrome.contextMenus.update(
                contextMenuItemId,
                {
                    title: getTitleTextForNextFlip(currentConversionMode)
                },
                () => resolve()
            );
        });
    }
}


function getTitleTextForNextFlip(
    currentConversionMode: GenreWordConversionMode
): string {
    /* 次のモードを暗示するテキスト */
    return (currentConversionMode === GenreWordConversionMode.ToOldWords)
        ? '新タグ名で表示'
        : '旧タグ名で表示';
}
