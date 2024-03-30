
import { ContentScriptAction } from "./content-script-action";
import { ContentScriptActionForGenreListPage } from './content-script-action/for-genre-list-page'
import { ContentScriptActionForSearchResultPage } from "./content-script-action/for-search-result-page";
import { ContentScriptActionForProductPage } from "./content-script-action/for-product-page";

export class ContentScriptActionFactory {
    public createContentScriptAction(
        pageUrl: string
    ): ContentScriptAction | null {
        if (pageUrl.includes('/genre/list'))
            return new ContentScriptActionForGenreListPage();
        
        if (pageUrl.includes('/work/=/product_id'))
            return new ContentScriptActionForProductPage();

        if (pageUrl.includes('/work.genre'))
            return new ContentScriptActionForSearchResultPage();

        return null;
    }
}