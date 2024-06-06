
import { ContentScriptAction } from "./content-script-action";
import { ContentScriptActionForGenreListPage } from './content-script-action/for-genre-list-page'
import { ContentScriptActionForSearchResultPage } from "./content-script-action/for-search-result-page";
import { ContentScriptActionForProductPage } from "./content-script-action/for-product-page";
import { ContentScriptActionForAdvancedSearchPage } from "./content-script-action/for-advanced-search-page";
import { ContentScriptActionForOtherPage } from './content-script-action/for-other-page';

export class ContentScriptActionFactory {
    public createContentScriptAction(
        pageUrl: string
    ): ContentScriptAction {
        if (pageUrl.includes('/genre/list'))
            return new ContentScriptActionForGenreListPage();
        
        if (pageUrl.includes('/work/=/product_id'))
            return new ContentScriptActionForProductPage();

        if (pageUrl.includes('/work.genre')    ||
            pageUrl.includes('from/fs.header') ||
            pageUrl.includes('from/fs.detail'))
            return new ContentScriptActionForSearchResultPage();

        if (pageUrl.includes('/fs'))
            return new ContentScriptActionForAdvancedSearchPage();

        return new ContentScriptActionForOtherPage();
    }
}