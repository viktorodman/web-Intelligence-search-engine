import SearchService from '../services/db-services'
import { Response } from 'express'
import PageDB from '../models/page-db';

export default class DBController {
    private searchService = new SearchService()

    public searchDB(req: any, res: Response, pageDB: PageDB) {
        try {
            console.log(req.query.phrase)
        const  searchPhrase  = req.query.phrase as string;
 
        let startTime = process.hrtime();
    
        const data = this.searchService.searchWord(searchPhrase, pageDB);
        const test = process.hrtime(startTime)
    
        data.queryTime = Number((test[0] + (test[1] / 1e9)).toFixed(5))
    
        res.status(200).json(data);
        } catch (error) {
            res.status(400).json([])
        }
    }
}