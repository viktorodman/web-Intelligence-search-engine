// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import SearchService from '../../../services/search-service';

type Data = {
  name: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<string[]>) {
    const  word  = req.query.word as string;
    const searchService: SearchService = new SearchService();

    console.log(word);

    const data = await searchService.searchWord(word);


    res.status(200).json(data)
}
