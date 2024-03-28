
export class GenreWordConversionMapEntry {
    oldWord: string = "";
    newWord: string = "";

    constructor(oldWord: string, newWord: string) {
        this.oldWord = oldWord;
        this.newWord = newWord;
    }
}

export class GenreWordConversionMap {
    entries: Array<GenreWordConversionMapEntry> = [];
}