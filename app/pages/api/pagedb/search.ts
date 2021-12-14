// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import Score from '../../../models/score';
import SearchService from '../../../services/search-service';

type Data = {
  name: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
    const  searchPhrase  = req.query.phrase as string;
    const searchService: SearchService = new SearchService();
    let startTime = process.hrtime();

    const data = await searchService.searchWord(searchPhrase);
    const test = process.hrtime(startTime)

    data.queryTime = Number((test[0] + (test[1] / 1e9)).toFixed(5))

    res.status(200).json(data);
}
