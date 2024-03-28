
export class GenreWordConversionMap {
    public addRecord(oldWord: string, newWord: string): void {
        this.mapToNewWord_.set(oldWord, newWord);
        this.mapToOldWord_.set(newWord, oldWord);
    }
    public toOldWord(newWord: string): string | null {
        const oldWord = this.mapToOldWord_.get(newWord);
        const found   = (oldWord === undefined);

        return (found) ? oldWord! : null;
    }
    public toNewWord(oldWord: string): string | null {
        const newWord = this.mapToNewWord_.get(oldWord);
        const found   = (newWord === undefined);

        return (found) ? newWord! : null;
    }
    public size(): number {
        return this.mapToNewWord_.size;
    }
    private mapToOldWord_: Map<string, string> = new Map<string, string>();
    private mapToNewWord_: Map<string, string> = new Map<string, string>();
}