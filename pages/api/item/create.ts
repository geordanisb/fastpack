// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Item } from '@prisma/client'
import {create} from '@/src/facades/item'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Item>
) {
  try{
    const {name,size} = req.body;
    const item = await create({name,size:parseInt(size)});
    res.status(200).json(item);
  }
  catch(e){
    res.statusMessage = 'server error';
    res.status(500).end();
  }
}
