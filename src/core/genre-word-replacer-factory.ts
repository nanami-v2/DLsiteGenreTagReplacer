
import { GenreWordReplacer } from "./genre-word-replacer";
import { GenreWordReplacerForProductPage } from "./genre-word-replacer/for-product-page";
import { GenreWordReplacerForGenreListPage } from "./genre-word-replacer/for-genre-list-page";
import { GenreWordReplacerForSearchResultPage } from "./genre-word-replacer/for-search-result-page";
import { GenreWordReplacerForDetailSearchPage } from "./genre-word-replacer/for-detail-search-page";
import { GenreWordReplaceTargetPage } from "./genre-word-replace-target-page";

export class GenreWordReplacerFactory {
    public createGenreWordReplacer(
        targetPage: GenreWordReplaceTargetPage
    ): GenreWordReplacer {
        switch (targetPage) {
            case GenreWordReplaceTargetPage.GenreListPage:
                return new GenreWordReplacerForGenreListPage();
            case GenreWordReplaceTargetPage.ProductPage:
                return new GenreWordReplacerForProductPage();
            case GenreWordReplaceTargetPage.SearchResultPage:
                return new GenreWordReplacerForSearchResultPage();
            case GenreWordReplaceTargetPage.DetailSearchPage:
                return new GenreWordReplacerForDetailSearchPage();
        }
    }
}