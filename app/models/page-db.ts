import Page from "./page";

export default class PageDB {
    private _wordTold: Map<string, number> = new Map<string,number>();
    private _pages: Page[] = [];


    public getPagesWithWord(word: string) {
        const pagesWithWord: string[] = [];
        
        if (this._wordTold.has(word)) {
            const wordIndex = this.getIdForWord(word);

            for (const page of this._pages) {
                if (page.containsWord(wordIndex)) {
                    pagesWithWord.push(page.url);
                }
            }
        }

        return pagesWithWord;
    }

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
            this._wordTold.set(word.toLowerCase(), id);
            return id;
        }
    }
}