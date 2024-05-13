import React, { useEffect, useState } from 'react';
import PocketBase from 'pocketbase';
import Link from 'next/link';


async function getTvShows(){
  try{
    const pb = new PocketBase('http://127.0.0.1:8090')
    const fn = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
    const resultList = await pb.collection('tvshows').getList(fn, 4, {});
    return resultList?.items as any[];
  } catch (error) {
    console.error('An error occurred while fetching', error);
    return [];
  }
}

export default async function tvshows(){
  const tvshows = await getTvShows();

  return (
    <div className='PopularShows pt-20 pl-60 pr-60'>
    <h1 className='font-bold' id='PopularShows'>Popular Shows</h1>
    <main className="flex min-h-screen flex-row" style={{marginTop: "5%"}}>
      <div id="tvshowpanel" className="flex flex-wrap justify-start">
        {tvshows.map(show => (
          <div>
          <Link href={`/tvshows/${show.id}`}>
          <div key={show.id} className="bg-black text-white p-1 text-center rounded-lg movie-container" id='PopularShow'>
            <img src={show.image_path} alt={show.title}  style={{ width: '220px', height: '320px' }} />
            <p>{show.title}</p>
            <div className='hoverInfo' >
              <p>Genre: {show.genre}</p>
              <p>Rating: {show.rating}</p>
              <p>Year: {show.release}</p>
          </div>
          </div>
          </Link>
          </div>
        ))}
      </div>
    </main>
    </div>
  );
}
