import React from 'react'
import Navbar from '../components/Navbar'

import PocketBase from 'pocketbase';
import Link from 'next/link';
import FilterAndOrderMovies from '../components/FilterAndOrderMovies';


// fetch a paginated records list


export default async function movies(){
  return (
    <main className="flex min-h-screen flex-col items-center ">
      <Navbar />
      <div className='Filterdiv' style={{marginTop: "30px"}}>
          <h1 className="text-6xl font-bold text-center mb-5" id="Welcome">
            MOVIES
          </h1> 
        <FilterAndOrderMovies/>
        </div>
      <div id="moviepanel" className="grid grid-cols-3 gap-4 mt-20">
      </div>
    </main>
  );
}
