
export class GenreWordConversionMapEntry {
    oldWord: string;
    newWord: string;

    constructor(
        oldWord: string = '',
        newWord: string = ''
    ) {
        this.oldWord = oldWord;
        this.newWord = newWord;
    }
}

export class GenreWordConversionMap {
    langCode: string;
    entries : Array<GenreWordConversionMapEntry>;

    constructor(
        langCode: string,
        entries : Array<GenreWordConversionMapEntry>
    ) {
        this.langCode = langCode;
        this.entries  = entries;
    }
}