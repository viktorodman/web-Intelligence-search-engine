import Page from "../models/page";
import PageDB from "../models/page-db";
import { readFilenamesInDirs, readRowsFromFile, readWordsFromFile } from "./file-reader";

export const createDB = async () => {
    const GAMES_DIR_PATH = "data/Words/Games";
    const DIR_PATH_LINKS: string = "data/Links";
    const PROGRAMMING_DIR_PATH: string = "data/Words/Programming";



    const directories = await readFilenamesInDirs([GAMES_DIR_PATH, PROGRAMMING_DIR_PATH]);

    const pageDB: PageDB = new PageDB();

    for (const directory of directories) {
        for (const filename of directory.filenames) {
            const page: Page = new Page(`/wiki/${filename}`);
            const wordsFromFile = await readWordsFromFile(`${directory.dirPath}/${filename}`);
            const links = await readRowsFromFile(`${DIR_PATH_LINKS}/${directory.dirName}/${filename}`);
            pageDB.addPage(page, wordsFromFile, links);
        }
    }
    
    calculatePageRank(pageDB);

    return pageDB;
}

export const normalize = (scores: number[], smallIsBetter: boolean) => {
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

const calculatePageRank = (pageDB: PageDB) => {
    const MAX_ITERATIONS = 20;
    let ranks: number[] = []

    for (let i = 0; i < MAX_ITERATIONS; i++) {
        ranks = [];

        for (let j = 0; j < pageDB.pages.length; j++) {
            ranks.push(iteratePR(pageDB.pages[j], pageDB));
        }
        
        for (let k = 0; k < pageDB.pages.length; k++) {
            pageDB.pages[k].pageRank = ranks[k];
        }
    }

    normalize(ranks, false);


    for (let i = 0; i < pageDB.pages.length; i++) {
        pageDB.pages[i].pageRank = ranks[i];
    }
}

const iteratePR = (page: Page, pageDB: PageDB) => {
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