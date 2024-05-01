import React from 'react'
import Navbar from '../components/Navbar'

import PocketBase from 'pocketbase';
import { getSession } from '@/actions';
import { redirect } from 'next/navigation';

export const dynamic = 'auto',
  dynamicParams = true,
  revalidate = 0,
  fetchCache = 'auto',
  runtime = 'nodejs',
  preferredRegion = 'auto'


// profile return function
export default async function profile(){
    const session = await getSession();
    if(!session.isLoggedIn){
        redirect("/login");
    }
    
    return (
        <main className="flex min-h-screen flex-col items-center">
            <Navbar />
            <div className="flex flex-col items-center">
                <h1 className='text-4xl mt-10'>Welcome to your profile, <b>{session.username}</b></h1>
            </div>
        </main>
    );
}