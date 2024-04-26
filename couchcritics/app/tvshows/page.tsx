import React from 'react'
import Navbar from '../components/Navbar'

import PocketBase from 'pocketbase';

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
      <h1 className="text-6xl font-bold text-center" id="Welcome">
        TV SHOWS
      </h1>
      <div className="grid grid-cols-3 gap-4 mt-8">
        {tvshows.map(show => (
          <div key={show.id} className="bg-black text-white p-1 text-center rounded-lg show-container" id='show'>
            <img src={show.image_path} alt={show.title}  style={{ width: '250px', height: '350px' }} />
            <p className="text-bold">{show.title}</p>
            <div className='hoverInfo' >
              <p>Genre: {show.genre}</p>
              <p>Rating: {show.rating}</p>
              <p>Year: {show.release}</p>
          </div>
          </div>
        ))}
      </div>
    </main>
  );
}
