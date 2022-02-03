import React, { useEffect, useState } from "react";
import Layout from "@/src/components/Layout";
import { Spinner } from "react-bootstrap";
import ItemDetail from '@/components/item/Details';
import { useRouter } from "next/router";

const Index: React.FC = ()=>{
    const router = useRouter();
    const [id,setId] = useState<number>();
    useEffect(()=>{
        if(router && router.query.id){
            setId(parseInt(router.query.id.toString()));
        }
    },[router])

    return <Layout>
        {!!id && <ItemDetail id={id} /> || <Spinner animation="grow" />}
        
    </Layout>;
};
export default Index