import React,{useEffect, useState} from "react";
import { useItem} from "@/src/hooks/useItem";
import {Form, Button,Spinner} from 'react-bootstrap'
import { useRouter } from "next/router";
import {useMutation, useQueryClient} from 'react-query';
import { Prisma } from "@prisma/client";


const Create: React.FC = ()=>{
    const router = useRouter();    
    const [data,setData] = useState<Prisma.ItemCreateInput>({name:'',size:1});
    const queryClient = useQueryClient();
    const {mutate} = useMutation(async () => {
      
    const res = await fetch(`/api/item/create`,{
        method:'POST',
        headers: {
            "Content-type": "application/json",
        },
        body:JSON.stringify(data),
    });
    if(res.ok){
        return res.json();
    }
    return null;
      
    },
    {
        onMutate: async () => {
            const snapshot = queryClient.getQueryData('ITEMS');
            return { snapshot };
        },
        onSettled: (_comment, error, _variables, context) => {
          if (context) {
            const { snapshot } = context;
            if (error) {
              queryClient.setQueryData('ITEMS', snapshot);
            }
            else queryClient.invalidateQueries('ITEMS');
            setData({name:'',size:1});
          }
        },
      });
      const submitHandler = (e:React.MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault();
        mutate();
        
      }
      const onChangeFieldName = (e:React.ChangeEvent<HTMLInputElement>)=>{
        setData((spec)=>({
          ...spec,
          "name":e.target.value,
        }));
        console.log(data)
      }
      const onChangeFieldSize = (e:React.ChangeEvent<HTMLInputElement>)=>{
        let size = parseInt(e.target.value);
        if(!(size > 1 && size <= 10))
          size = 1;
        setData((spec)=>({
          ...spec,
          size,
        }));
        console.log(data)
      }
    
        return <Form>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" value={data.name} onChange={onChangeFieldName} />          
        </Form.Group>
      
        <Form.Group className="mb-3" controlId="createdAt">
          <Form.Label>Size {data.size}</Form.Label>
          <Form.Range min={1} max={10} value={data.size} onChange={onChangeFieldSize}/>
        </Form.Group>

        <aside className="d-flex justify-content-end">
          <Button className="me-3" onClick={()=>router.back()}>Go back</Button>
          <Button variant="warning" onClick={submitHandler}>
            Submit {/* {isLoading && <Spinner animation="grow"/>}
 */}          </Button>
        </aside>
      </Form>
};
export default Create