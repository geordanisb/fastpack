// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Item } from '@prisma/client'
import {find, update, remove} from '@/src/facades/item'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Item|null>
) {
  if(req.method == 'GET'){
    try{
      const {id} = req.query;
      const data = await find(parseInt(id.toString()));
      res.status(200).json(data);
    }
    catch(e){
      res.statusMessage = 'server error';
      res.status(500).end();
    }
  }
  else if(req.method == 'PATCH'){debugger;
    try{
      const {id} = req.query;
      const {name,createdAt} = req.body;
      const data = {
        ... name && {name},
        ... createdAt && {createdAt:new Date(createdAt)}, 
      }
      const w = await update(parseInt(id.toString()),data);
      res.status(200).json(w);
    }
    catch(e){
      res.statusMessage = 'server error';
      res.status(500).end();
    }
  }
  else if(req.method == 'DELETE'){
    try{
      const {id} = req.query;
      const w = await remove(parseInt(id.toString()));
      res.status(200).json(w);
    }
    catch(e){
      res.statusMessage = 'server error';
      res.status(500).end();
    }
  }
}
