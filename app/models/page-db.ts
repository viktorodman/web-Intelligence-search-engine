import Page from "./page";

export default class PageDB {
    private _wordTold: Map<string, number> = new Map<string,number>();
    private _pages: Page[] = [];

    public addPage(page: Page, wordsFromFile: string[]): void {
        const wordIds: number[] = []

        for (const word of wordsFromFile) {
            const wordID = this.getIdForWord(word);
            page.addWord(wordID)
        }

        this._pages.push(page);
    }

    public getIdForWord(word: string): number {
        if (this._wordTold.has(word)) {
            return this._wordTold.get(word) || -1;
        } else {
            const id = this._wordTold.size;
            this._wordTold.set(word, id);
            return id;
        }
    }
}