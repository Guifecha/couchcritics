import React from 'react'
import Navbar from '../components/Navbar'

import PocketBase from 'pocketbase';

export const dynamic = 'auto',
  dynamicParams = true,
  revalidate = 0,
  fetchCache = 'auto',
  runtime = 'nodejs',
  preferredRegion = 'auto'


// profile return function
export default async function profile(){
    return (
        <main className="flex min-h-screen flex-col items-center p-5">
            <Navbar />
        </main>
    );
}