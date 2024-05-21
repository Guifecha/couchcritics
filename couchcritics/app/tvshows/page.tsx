import React from 'react'
import Navbar from '../components/Navbar'
import PocketBase from 'pocketbase';
import Link from 'next/link';
import FilterAndOrderTvshows from '../components/FilterAndOrderTvshows';

export const dynamic = 'auto',
  dynamicParams = true,
  revalidate = 0,
  fetchCache = 'auto',
  runtime = 'nodejs',
  preferredRegion = 'auto'


async function getTvShows(){
  try{
    const pb = new PocketBase('http://127.0.0.1:8090')
    const resultList = await pb.collection('tvshows').getList(1, 50, {
    });
    return resultList?.items as any[];
  } catch (error) {
    console.error('An error occurred while fetching', error);
    return [];
  }
}

// fetch a paginated records list


export default async function tvshows(){
  const tvshows = await getTvShows();

  return (
    <main className="flex min-h-screen flex-col items-center">
      <Navbar />
      <div className='Filterdiv' style={{marginTop: "30px"}}>
      <h1 className="text-6xl font-bold text-center mb-5" id="Welcome">
        TV SHOWS
      </h1>
        <FilterAndOrderTvshows/>
      </div>
      <div id="tvshowpanel" className="grid grid-cols-3 gap-4 mt-20">
      </div>
    </main>
  );
}
