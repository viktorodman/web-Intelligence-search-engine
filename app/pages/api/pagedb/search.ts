// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import SearchService from '../../../services/search-service';

type Data = {
  name: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<string[]>) {
    const searchService: SearchService = new SearchService();

    const data = await searchService.searchWord("hej");


    res.status(200).json(data)
}
