import React, { useEffect, useState } from "react";
import Layout from "@/src/components/Layout";
import { Spinner } from "react-bootstrap";
import ItemCreate from '@/components/item/Create';
import { useRouter } from "next/router";

const Index: React.FC = ()=>{
    const router = useRouter();

    return <Layout>
        <ItemCreate />        
    </Layout>;
};
export default Index