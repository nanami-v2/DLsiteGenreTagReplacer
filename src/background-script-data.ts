
import { GenreWordConversionMap } from "./core/genre-word-conversion-map";
import { GenreWordConversionMode } from "./core/genre-word-conversion-mode";

export class BackgroundScriptData {
    genreWordConversionMap : GenreWordConversionMap = new GenreWordConversionMap();
    genreWordConversionMode: GenreWordConversionMode.ToOldWords;
};