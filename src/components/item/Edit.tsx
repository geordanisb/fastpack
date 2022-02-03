import React,{useEffect, useState} from "react";
import { useItem} from "@/src/hooks/useItem";
import {Form, Button,Spinner} from 'react-bootstrap'
import { useRouter } from "next/router";
import {useMutation, useQueryClient} from 'react-query';
import { Prisma } from "@prisma/client";

interface Props {
    id: number;
}
const Edit: React.FC<Props> = ({id})=>{
    const router = useRouter();
    const {data: item} = useItem(id,{
      enabled:!!id
    });
    const [data,setData] = useState<Prisma.ItemUpdateInput>();
    useEffect(()=>{
      console.log(item)
    },[item])
    const queryClient = useQueryClient();
    const {mutate,isLoading} = useMutation(async () => {
      if(item){
        const res = await fetch(`/api/item/${item.id}`,{
            method:'PATCH',
            headers: {
                "Content-type": "application/json",
            },
            body:JSON.stringify(data),
        });
        if(res.ok){
            return res.json();
        }

      }
    },
    {
        onMutate: async () => {
          if(item){
            const snapshot = queryClient.getQueryData(['ITEM',item.id]);
            return { snapshot };

          }
        },
        onSettled: (_comment, error, _variables, context) => {
          if (context) {
            const { snapshot } = context;
            if (error && item) {
              queryClient.setQueryData(['ITEM',item.id], snapshot);
            }
            if (context && item) queryClient.invalidateQueries(['ITEM',item.id]);
          }
        },
      });
      const submitHandler = (e:React.MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault();debugger;
        mutate();
      }
      const onChangeFieldName = (e:React.ChangeEvent<HTMLInputElement>)=>{
        setData((spec)=>({
          ...spec,
          "name":e.target.value,
        }));
        console.log(data)
      }
      const onChangeFieldCreatedAt = (e:React.ChangeEvent<HTMLInputElement>)=>{
        setData((spec)=>({
          ...spec,
          "createdAt":e.target.value,
        }));
        console.log(data)
      }
    if(item)
        return <Form>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" defaultValue={item.name} onChange={onChangeFieldName} />          
        </Form.Group>
      
        <Form.Group className="mb-3" controlId="createdAt">
          <Form.Label>Created at</Form.Label>
          <Form.Control type="date" defaultValue={new Date(item.createdAt).toISOString().slice(0,10)} onChange={onChangeFieldCreatedAt}/>
        </Form.Group>

        <aside className="d-flex justify-content-end">
          <Button className="me-3" onClick={()=>router.back()}>Go back</Button>
          <Button variant="warning" onClick={submitHandler}>
            Submit
          </Button>
        </aside>
      </Form>
    return <Spinner animation="grow"/>;
};
export default Edit