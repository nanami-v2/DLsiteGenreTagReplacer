
import { GenreWordReplacer } from "./genre-word-replacer";
import { GenreWordReplacerForProductPage } from "./genre-word-replacer/for-product-page";
import { GenreWordReplacerForGenreListPage } from "./genre-word-replacer/for-genre-list-page";
import { GenreWordReplacerForSearchResultPage } from "./genre-word-replacer/for-search-result-page";

export class GenreWordReplacerFactory {
    public createGenreWordReplacer(pageUrl: string): GenreWordReplacer | null {
        if (pageUrl.includes('work/=/product_id'))
            return new GenreWordReplacerForProductPage();

        if (pageUrl.includes('/genre/list'))
            return new GenreWordReplacerForGenreListPage();

        if (pageUrl.includes('/from/work.genre'))
            return new GenreWordReplacerForSearchResultPage();

        return null;
    }
}