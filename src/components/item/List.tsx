import React, { useEffect } from "react";
import { useItems } from "@/src/hooks/useItems";//fetch from database or client cache
import CustomTable from '@/components/CustomTable';
import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "react-query";
import { Item } from "@prisma/client";

const List: React.FC = ()=>{
    const router = useRouter();
    const queryClient = useQueryClient()
    const {data: items} = useItems();
    useEffect(()=>{
        if(items){
            debugger;
        }
    },[items])
    const {mutate:removeItem} = useMutation(async (id:number)=>{
        const res = await fetch(`/api/item/${id}`,{
            method:'DELETE'
        });
        if(res.ok){
            return res.json();
        }
    },{
        onMutate(id){
            queryClient.cancelQueries(['ITEMS'])
            const snapshot = queryClient.getQueryData<Item[]>(['ITEMS']);
            if(snapshot){
                const sc = [...snapshot];
                const idx = sc?.findIndex(i=>i.id===id)
                if(idx>-1){
                    sc.splice(idx,1);
                }
                queryClient.setQueryData(['ITEMS'],sc);
            }
            return {snapshot}
        },
        onSettled(data,error,variables,context){
            debugger;
            type ctx = {snapshot:Item[]}
            if(error){
                queryClient.setQueryData(['ITEMS'],(context as ctx)?.snapshot);
            }
        }
    })
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
            removeItem(id)
            console.log('remove',id)
        },
    };
    
        return <CustomTable columns={['id','name','size']} data={items} actions={actions} />
        
};
export default List