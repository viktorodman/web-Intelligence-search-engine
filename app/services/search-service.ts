import Page from "../models/page";
import PageDB from "../models/page-db";
import Score from "../models/score";
import { readFilenamesInDirs, readWordsFromFile } from "../utils/file-reader";

export default class SearchService {
    private GAMES_DIR_PATH: string = "data/Words/Games";
    private PROGRAMMING_DIR_PATH: string = "data/Words/Programming";

    public async searchWord(word: string):Promise<Score[]> {
        const pageDB: PageDB = await this.createPageDB();

        const pagesWithWord = pageDB.getPagesWithWord(word);

        pageDB.pages = pagesWithWord;

        const result: Score[] = this.query(pageDB, word); 

        return result;
    }

    private query(pageDB: PageDB, word: string) {
        const result: Score[] = []
        const scores: Score = new Score();

        for (let i = 0; i < pageDB.noPages(); i++) {
            const p: Page = pageDB.getPageAtIndex(i);
            scores.content[i] = this.getFrequencyScore(p, word, pageDB);
            scores.location[i] = this.getFrequencyScore(p, word, pageDB);
        }

        this.normalize(scores.content, false);
        this.normalize(scores.location, true);

        for (let i = 0; i < pageDB.noPages(); i++) {
            const p: Page = pageDB.getPageAtIndex(i);
            
            for (let j = 0; j < scores.content.length; j++) {                
                if (scores.content[j] > 0) {
                    const score = ((1 * scores.content[j]) + (0.5 * scores.location[j]))
                    result.push(new Score(p, score))
                }
            }
        }

        result.sort((a, b) => b.score - a.score)

        return result;
    }


    public normalize(scores: number[], smallIsBetter: boolean) {
        if(smallIsBetter) {
            const min_val = Math.min(...scores);

            for (let i = 0; i < scores.length; i++) {
                scores[i] = (min_val / (Math.max(scores[i], 0.00001)));
            }
        } else {
            let max_val = Math.max(...scores);
            max_val = Math.max(max_val, 0.00001);

            for (let i = 0; i < scores.length; i++) {
                scores[i] = (scores[i] / max_val);
            }
        }
    }


    private getFrequencyScore(p: Page, word: string, pageDB: PageDB): number {
        const qws: string[] = word.split(" ");
        let score: number = 0;

        for (const q of qws) {
            if (pageDB.includesWord(q)) {
                const queryIndex = pageDB.getIdForWord(q);
                for (const wordIndex of p.words) {
                    if (wordIndex === queryIndex) {
                        score += 1;
                    }
                }   
            }
        }

        return score;
    }

    private getDocumentLocation(p: Page, queryWord: string, pageDB: PageDB): number {
        const qws = queryWord.split(" ");
        let score = 0;

        for (const q of qws) {
            let found: boolean = false;
            if (pageDB.includesWord(q)) {
                const queryIndex = pageDB.getIdForWord(q);
                for (let i = 0; i < p.words.length; i++) {
                    const word = p.words[i];

                    if (word === queryIndex) {
                        found = true;
                        break;
                    }
                }
            }
            if (!found) score += 100000;
        }

        return score;
    }

    private getWordDistance(p: Page, queryWord: string, pageDB: PageDB): number {
        const qws: string[] = queryWord.split(" ");
        let score: number = 0;

        for (let i = 0; i < qws.length -1; i++) {
            const loc1 = this.getDocumentLocation(p, qws[i], pageDB);
            const loc2 = this.getDocumentLocation(p, qws[i +1], pageDB);
            
            if (loc1 === 100000 || loc2 === 100000) {
                score += 100000;
            } else {
                Math.abs((loc1 - loc2));
            }
        }

        return score;
    }

    private async createPageDB(): Promise<PageDB> {
        const filenames = await readFilenamesInDirs([this.GAMES_DIR_PATH, this.PROGRAMMING_DIR_PATH]);
        const pageDB: PageDB = new PageDB();

        for (const filename of filenames) {
            const page: Page = new Page(filename);
            const wordsFromFile = await readWordsFromFile(filename);
            pageDB.addPage(page, wordsFromFile)
        }
    
        return pageDB;
    }
}