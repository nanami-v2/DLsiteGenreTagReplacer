
import { GenreWordConverter } from "./genre-word-converter";

export interface GenreWordReplacer {
    replaceGenreWords(
        htmlDocument      : Document,
        genreWordConverter: GenreWordConverter
    ): void;
}