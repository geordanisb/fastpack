import React,{useState} from "react";
import Layout from "@/src/components/Layout";
import ItemList from '@/components/item/List';
import { useItems } from "@/src/hooks/useItems";//items are already cached by ItemList
import { Button } from "react-bootstrap";
import {Item} from '@prisma/client';

import {useAppDispatch, useAppSelector} from '@/src/app/hooks'
import { incremented, amountAdded } from "@/src/features/counter/counter-slice";

const Index: React.FC = ()=>{
    const [line,setLine] = useState<string>('');
    const {data:items} = useItems();
    const value = useAppSelector((state)=>state.counter.value);
    const dispatch = useAppDispatch()
    const cc = (items:Item[],boxCapacity=10)=>{
        let dp = Array(boxCapacity+1).fill(-1);
        dp[0]=0;
        let itemCountAndbiggerOne: Record<string,[number,number]>={0:[0,0]};
        for(let i = 1; i< boxCapacity+1;i++){
            for(let item of items){
                if(i-item.size >= 0){
                    if(dp[i] <= 1+dp[i-item.size]){
                        dp[i] = 1+dp[i-item.size];
                        itemCountAndbiggerOne[`${i}`] = [dp[i],item.size];
                    }
                    else{
                        itemCountAndbiggerOne[`${i}`] = [dp[i-item.size],item.size];
                    }
                    // dp[i] = Math.min(dp[i], 1+dp[i-c])
                }
            }
        }console.log(itemCountAndbiggerOne)
        return dp[boxCapacity]!==boxCapacity+1 ? itemCountAndbiggerOne : -1
    }

    const createLine = (e:React.FormEvent<HTMLButtonElement>)=>{
        e.preventDefault();
        setLine('');
        if(items){
            console.log(cc(items))
        }
        // const sum = (list:Item[]) => {
        //     return list.reduce((p,c)=>{
        //         return p + c.size;
        //     },0);
        // };
        // if(items){
        //     let ltg = (list:Item[])=>[...list].sort((a,b)=>a.size > b.size && 1 || -1);//sorted asc
        //     let gtl = ltg(items).reverse();//sorted desc;
        //     const res = [];
        //     let idx = 0;debugger;
        //     while(gtl.length){
        //         let g = gtl.shift()!;
        //         res.push([g]);
        //         let completed = false;
        //         let cursor = 0;
        //         let l = ltg(gtl);
        //         while(!completed && (cursor < l.length)){
        //             let totalSize = sum(res[idx]);
        //             if((totalSize + l[cursor].size) <= 10){
        //                 res[idx].push(l[cursor]);
        //                 l.splice(cursor,1);
        //                 if(sum(res[idx])===10)
        //                     completed = true;
        //             }
                    
        //             cursor++;
        //         }
        //         idx ++;
        //         gtl = ltg(l).reverse();
        //     }
        //     console.log(res);
        //     setLine(res.reduce((p,c)=>{
        //         return p + c.map(i=>`${i.name}`).join('') + '/'
        //     },""));
        // }
    }
    return <Layout><>
        <Button onClick={()=>dispatch(amountAdded(3))}>{value}
</Button>
    <br/>
            <Button size="lg" onClick={createLine}>Create line for currents Items</Button>
        {line && <span><b>Line</b>: {line}</span>}
        <ItemList/>
    </>
    </Layout>;
};
export default Index