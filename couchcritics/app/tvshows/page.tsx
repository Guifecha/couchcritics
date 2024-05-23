import React from 'react'
import Navbar from '../components/Navbar'
import PocketBase from 'pocketbase';
import Link from 'next/link';
import FilterAndOrderTvshows from '../components/FilterAndOrderTvshows';

export default async function tvshows(){

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
