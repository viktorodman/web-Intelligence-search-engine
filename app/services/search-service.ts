import Page from "../models/page";
import PageDB from "../models/page-db";
import PageScore from "../models/page-score";
import Score from "../models/score";
import { SearchResult } from "../types/search-result";
import { readFilenamesInDirs, readRowsFromFile, readWordsFromFile } from "../utils/file-reader";

export default class SearchService {
    private DIR_PATH_WORDS: string = "data/Words";
    private DIR_PATH_LINKS: string = "data/Links";
    private GAMES_DIR_PATH: string = "data/Words/Games";
    private PROGRAMMING_DIR_PATH: string = "data/Words/Programming";
    private MAX_ITERATIONS: number = 20; 

    public async searchWord(searchPhrase: string):Promise<any> {
        const pageDB: PageDB = await this.createPageDB();
        const pageDBIncludingWord: PageDB = pageDB.getPagesWithWord(searchPhrase);
        const result: PageScore[] = this.query(pageDBIncludingWord, searchPhrase);
        

        return this.createResults(result);
    }

    private createResults(scores: PageScore[]): SearchResult {
        const searchResults: SearchResult = {
            numOfResults: scores.length,
            queryTime: 0,
            searchScores: scores.map(s => ({ 
                score: s.score, 
                content: s.content, 
                link: `https://en.wikipedia.org${s.page?.url}`, 
                location: s.location, 
                pageRank: s.pageRank
            })).slice(0, 5)
        }

        return searchResults
    }

    private query(pageDB: PageDB, searchPhrase: string) {
        const result: PageScore[] = []


        const scores: Score = new Score();


        for (let i = 0; i < pageDB.pages.length; i++) {
            const p: Page = pageDB.pages[i];
            scores.content[i] = this.getFrequencyScore(p, searchPhrase, pageDB);
            scores.location[i] = this.getDocumentLocation(p, searchPhrase, pageDB);
        }

        this.normalize(scores.content, false);
        this.normalize(scores.location, true);

        for (let i = 0; i < pageDB.pages.length; i++) {
            /* const p: Page = pageDB.getPageAtIndex(i); */
            const p: Page = pageDB.pages[i];
            if (scores.content[i] > 0) {
                /* const score = (((1 * scores.content[i]) + 0.8) * scores.location[i]) */
                const contentScore = 1 * scores.content[i];
                const locScore = 0.8 * scores.location[i];
                const pageRank = 0.5 * p.pageRank;

                const score = contentScore + locScore + pageRank
                /* const score = (this.getFrequencyScore(p, searchPhrase, pageDB) + (0.8 * this.getDocumentLocation(p, searchPhrase, pageDB)) + (0.5 * p.pageRank)); */
                result.push(new PageScore(p, score, contentScore, locScore, pageRank));
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

    private calculatePageRank(pageDB: PageDB) {
        let ranks: number[] = []
        for (let i = 0; i < this.MAX_ITERATIONS; i++) {
            ranks = [];

            for (let j = 0; j < pageDB.pages.length; j++) {
                ranks.push(this.iteratePR(pageDB.pages[j], pageDB));
            }
            
            for (let k = 0; k < pageDB.pages.length; k++) {
                pageDB.pages[k].pageRank = ranks[k];
            }
        }

        this.normalize(ranks, false);


        for (let i = 0; i < pageDB.pages.length; i++) {
            pageDB.pages[i].pageRank = ranks[i];
        }
    }

    private iteratePR(page: Page, pageDB: PageDB) {
        let pr: number = 0;


        for (let i = 0; i < pageDB.pages.length; i++) {
            const currentPage = pageDB.pages[i];
            if (currentPage.hasLinkTo(page)) {
                pr += (currentPage.pageRank / currentPage.getNoLinks());
            }
        }

        pr = 0.85 * pr + 0.15;
        
        return pr;
    }


    private getFrequencyScore(p: Page, searchPhrase: string, pageDB: PageDB): number {
        const qws: string[] = searchPhrase.split(" ");
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
                        score += i + 1;
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
                score += Math.abs((loc1 - loc2));
            }
        }

        return score;
    }

    private async createPageDB(): Promise<PageDB> {
        const directories = await readFilenamesInDirs([this.GAMES_DIR_PATH, this.PROGRAMMING_DIR_PATH]);

        const pageDB: PageDB = new PageDB();

        for (const directory of directories) {
            for (const filename of directory.filenames) {
                const page: Page = new Page(`/wiki/${filename}`);
                const wordsFromFile = await readWordsFromFile(`${directory.dirPath}/${filename}`);
                const links = await readRowsFromFile(`${this.DIR_PATH_LINKS}/${directory.dirName}/${filename}`);
                pageDB.addPage(page, wordsFromFile, links);
            }
        }
        
        let startTime = process.hrtime();
        this.calculatePageRank(pageDB);

        const test = process.hrtime(startTime)

        console.log(Number((test[0] + (test[1] / 1e9)).toFixed(5)))
    
        return pageDB;
    }
}