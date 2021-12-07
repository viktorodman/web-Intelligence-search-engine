// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import Score from '../../../models/score';
import SearchService from '../../../services/search-service';

type Data = {
  name: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<any[]>) {
    const  word  = req.query.word as string;
    const searchService: SearchService = new SearchService();

    
    const data = await searchService.searchWord(word);
    
    const test = data.map(d => d.page?.url);

    res.status(200).json(test)
}
