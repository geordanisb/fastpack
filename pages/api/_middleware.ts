import { NextResponse, NextRequest } from 'next/server'
import prisma from '@/src/lib/prisma'

export async function middleware(req:NextRequest, ev:any) {
    // const prisma = new PrismaClient()
    
    // const items = await prisma.item.findFirst()
    const { pathname } = req.nextUrl;
    //api/auth/signin/email
    // if (pathname == '/api/auth/signin/email') {
    //     return NextResponse.redirect('/hello-nextjs')
    // }
    return NextResponse.next()
}