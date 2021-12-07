import Page from "../models/page";
import PageDB from "../models/page-db";
import { readFilenamesInDirs, readWordsFromFile } from "../utils/file-reader";

export default class SearchService {
    private GAMES_DIR_PATH: string = "data/Words/Games";
    private PROGRAMMING_DIR_PATH: string = "data/Words/Programming";

    public async searchWord(word: string):Promise<string[]> {
        const pageDB: PageDB = this.createPageDB();

        return []
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