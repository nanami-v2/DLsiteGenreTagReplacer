
import { GenreWordConversionMap } from "./core/genre-word-conversion-map";
import { GenreWordConversionMode } from "./core/genre-word-conversion-mode";

export class BackgroundScriptData {
    conversionMap : GenreWordConversionMap  = new GenreWordConversionMap();
    conversionMode: GenreWordConversionMode = GenreWordConversionMode.ToOldWords;
};