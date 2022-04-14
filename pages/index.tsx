import React,{useState,useRef} from "react";
import Layout from "@/src/components/Layout";
import ItemList from '@/components/item/List';
import { useItems } from "@/src/hooks/useItems";//items are already cached by ItemList
import { Button } from "react-bootstrap";
import {Item} from '@prisma/client';
import { useSession, signIn, signOut } from "next-auth/react"
import { useMutation } from "react-query";
import {useAppDispatch, useAppSelector} from '@/src/app/hooks'
import { incremented, amountAdded } from "@/src/features/counter/counter-slice";

import {Form} from 'react-bootstrap'

const Index: React.FC = ()=>{
    const { data: session } = useSession()
    const [line,setLine] = useState<string>('');
    const {data:items} = useItems();
    const value = useAppSelector((state)=>state.counter.value);
    const dispatch = useAppDispatch()
    const formRef=useRef<HTMLFormElement>(null)
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

    interface MutationProps{
        identifier:string;
        password:string;
    }
    const {mutate,isLoading:isMutating} = useMutation(async (props:MutationProps)=>{
        const {identifier,password} = props;
        const res = await fetch('/api/userCustomData',{
            method:'POST',
            headers:{
                'Content-type':'application/json'
            },
            body:JSON.stringify({
                identifier,
                password
            })
        })
        if(res.ok){
            const data = await res.json()
            signIn('email',{email:identifier})
            // return data;
        }
        else{
            alert(res.statusText)
        }
        return null;
    })

    const handleSubmitSignUp = (e:React.MouseEvent<HTMLButtonElement>)=>{
        //mutate user custom data
        const form = formRef.current

        if(form){
            mutate({
                identifier:form.email.value,
                password:form.password.value,
            })
            
        }
    }

    const handleSubmitSignIn = (e:React.MouseEvent<HTMLButtonElement>)=>{
        //mutate user custom data
        const form = formRef.current
debugger;
        if(form){
            // signIn()
            signIn('credentials' ,{
                email:form.email.value,
                password:form.password.value
            })
            
        }
    }
    
    const renderLogInOrOut = ()=>{
        if (session) {
            return (
              <>
                Signed in as {session.user?.email} <br />
                <button onClick={() => signOut()}>Sign out</button>
              </>
            )
          }
          return (
            <>
              Not signed in <br />
              <Form ref={formRef} >
                    <Form.Group controlId='email'>
                        <Form.Control type="text" placeholder="Email"/>
                    </Form.Group>

                    <Form.Group controlId='password'>
                        <Form.Control type="text" placeholder="Password"/>
                    </Form.Group>
                    <Button onClick={handleSubmitSignUp}>Sign up</Button>
                    <Button onClick={handleSubmitSignIn}>Sign in</Button>
              </Form>
              {/* <form action='/api/logIn' method="POST"> */}
              {/* api/auth/signin/email */}
                {/* <input type="password" required placeholder="Password (required)" name="password"/>
                <input type="text" required placeholder="Email required" name="email"/>
              </form> */}
              {/* <button type="submit" onClick={() => signIn()} >Sign in</button> */}
            </>
          )
    }
    return <Layout><>
    <div className="my-5">
    {renderLogInOrOut()}

    </div>
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