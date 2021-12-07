export default class Page {
    private _url: string;
    private _words: number[] = []

    constructor(url: string) {
        this._url = url
    }

    public addWord (word: number): void {
        this._words.push(word);
    } 
}