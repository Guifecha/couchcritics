import React, { useEffect, useState } from 'react';
import PocketBase from 'pocketbase';
import Link from 'next/link';


async function getMovies(){
  try {
  const pb = new PocketBase('http://127.0.0.1:8090')
  const fn = Math.floor(Math.random() * (6 - 1 + 1)) + 1;
  const resultList = await pb.collection('movies').getList(fn, 4, {});
    console.log("RESULTADOS",resultList);
    return resultList?.items as any[];
  } catch (error) {
    console.error('An error occurred while fetching', error);
    return [];
  }
}

export default async function movies(){
  const movies = await getMovies();
  return (
    <div className='PopularMovies p-20 px-60 pb-20'>
    <h1 className='font-bold' id='PopularMovies'>Popular Movies</h1>
    <main className="flex min-h-screen flex-row" style={{marginTop: "5%"}}>
      <div className="flex flex-wrap justify-start">
        {movies.map(movie => (
          <div>
            <Link href={`/movies/${movie.id}`}>
              <div key={movie.id} className="bg-black text-white p-1 rounded-lg text-center movie-container" id="PopularMovie">
                <img src={movie.image_path} alt={movie.title}  style={{ width: '220px', height: '320px' }} />
                <div id="infot2">
                    <p>{movie.genre}</p>
                    <p>{movie.rating} &#11088;</p>
                    <p>{movie.release}</p>
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

