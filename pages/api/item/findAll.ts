// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Item } from '@prisma/client'
import {findAll} from '@/src/facades/item'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Item[]>
) {
  try{
    const data = await findAll();
    // throw new Error('err')
    res.status(200).json(data);
  }
  catch(e){
    res.statusMessage = 'server error';
    res.status(500).end();
  }
}
