import React from "react";
import { useItem} from "@/src/hooks/useItem";
import {Card, Button,Spinner} from 'react-bootstrap'
import { useRouter } from "next/router";

interface Props {
    id: number;
}
const Details: React.FC<Props> = ({id})=>{
    const router = useRouter();
    const {data: item} = useItem(id,{
        enabled:!!id
    });
    if(item)
        return <Card>
        <Card.Header>Details</Card.Header>
        <Card.Body>
          <Card.Title>{item.name}</Card.Title>
          <Card.Text>
            Created at: {item.createdAt}
          </Card.Text>
          <Card.Text>
            Updated at: {item.updatedAt}
          </Card.Text>
          <Button variant="primary" onClick={()=>router.back()}>Go back</Button>
        </Card.Body>
      </Card>
    return <Spinner animation="grow"/>;
};
export default Details