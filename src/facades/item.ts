import { Prisma, Item } from "@prisma/client";
import prisma from '@/src/lib/prisma'

export const findAll = ():Promise<Item[]>=>{
    return prisma.item.findMany();
}

export const find = (id: number):Promise<Item|null>=>{
    return prisma.item.findFirst({where:{
        id,
    }});
}

export const create = (data: Prisma.ItemCreateInput): Promise<Item>=>{
    return prisma.item.create({data});
}

export const remove = (id: number):Promise<Item>=>{
    return prisma.item.delete({where:{id}});
}

export const update = (id: number, data: Prisma.ItemUpdateInput)=>{
    return prisma.item.update({
        where:{id},
        data
    })    
}