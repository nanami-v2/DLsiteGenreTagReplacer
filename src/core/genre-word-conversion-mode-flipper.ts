
import { GenreWordConversionMode } from "./genre-word-conversion-mode";

export class GenreWordConversionModeFlipper {
    public flipConversionMode(
        conversionMode: GenreWordConversionMode
    ): GenreWordConversionMode {
        return (conversionMode === GenreWordConversionMode.ToOldWords)
            ? GenreWordConversionMode.ToNewWords
            : GenreWordConversionMode.ToOldWords;
    }
}