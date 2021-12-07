export default class Page {
    private _url: string;
    private _words: number[] = []

    constructor(url: string) {
        this._url = url
    }

    public get url(): string {
        return this._url;
    }

    public get words(): number[] {
        return this._words;
    }

    public addWord (word: number): void {
        this._words.push(word);
    }
    
    public containsWord(word: number): boolean {
        for (const wordInList of this._words) {
            if (wordInList === word) return true;
        }

        return false;
    }
}