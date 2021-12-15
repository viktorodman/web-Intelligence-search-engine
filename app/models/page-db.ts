import Page from "./page";

export default class PageDB {
    private _wordTold: Map<string, number> = new Map<string, number>();
    private _pages: Set<Page> = new Set<Page>();

    public set pages(newPages: Set<Page>) {
        this._pages = newPages;
    }
    
    /* public getPagesNamesWithWord(word: string): string[] {
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
    } */

    public getPagesWithWord(phrase: string): Set<Page> {
        const pagesIncludingWord:Set<Page> =  new Set<Page>();
        const wordsInPhrase: string[] = phrase.split(" "); 
        let allWordsExists: boolean = true;

        for (const word of wordsInPhrase) {
            if (!this._wordTold.has(word)) allWordsExists = false;
        }

        
        if (allWordsExists) {
            for (let page of this._pages) {
                let includesAllWords = true;
                for (const word of wordsInPhrase) {
                        const wordIndex = this.getIdForWord(word);
                        if (!page.containsWord(wordIndex)) includesAllWords = false;

                        if (includesAllWords) pagesIncludingWord.add(page); 
                    }
                }
        }
       

        

        return pagesIncludingWord
    }

    public includesWord(word: string): boolean {
        return (this._wordTold.has(word)); 
    }

    public addPage(page: Page, wordsFromFile: string[]): void {
        for (const word of wordsFromFile) {
            const wordID = this.getIdForWord(word);
            page.addWord(wordID)
        }

        this._pages.add(page);
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

    public noPages(): number {
        return this._pages.size;
    }

    public getNumberOfWords(): number {
        return this._wordTold.size
    }

    public getPageAtIndex(index: number): Page {
        if (index >= this._pages.size) {
            throw new Error("Index is out of bound");
        }

        
        return Array.from(this._pages)[index];
    }
}