import React from "react";
import { useItems } from "@/src/hooks/useItems";//fetch from database or client cache
import CustomTable from '@/components/CustomTable';
import { useRouter } from "next/router";

const List: React.FC = ()=>{
    const router = useRouter();
    const {data: items} = useItems();
    const actions = {//actions for actions buttons on CustomTable
        details: async (id: number)=>{
            router.push(`/item/${id}`);
            console.log('details',id)
        },
        edit: async (id: number)=>{
            router.push(`/item/edit/${id}`)
            console.log('/item/edit/',id)
        },
        remove: async (id: number)=>{

            console.log('remove',id)
        },
    };
    
        return <CustomTable columns={['id','name','size']} data={items} actions={actions} />
        
};
export default List