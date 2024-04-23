import React from 'react'
import Navbar from '../components/Navbar'

import PocketBase from 'pocketbase';

export const dynamic = 'auto',
  dynamicParams = true,
  revalidate = 0,
  fetchCache = 'auto',
  runtime = 'nodejs',
  preferredRegion = 'auto'


async function getMovies(){
  try {
    const pb = new PocketBase('http://127.0.0.1:8090')
    const resultList = await pb.collection('movies').getList(1, 50, {});
    return resultList?.items as any[];
  } catch (error) {
    console.error('An error occurred while fetching', error);
    return [];
  }
}

// fetch a paginated records list


export default async function movies(){
  const movies = await getMovies();
  console.log(movies);

  return (
    <main className="flex min-h-screen flex-col items-center p-5">
      <Navbar />
      <h1 className="text-6xl font-bold text-center" id="Welcome">
        MOVIES
      </h1>
      <div className="grid grid-cols-3 gap-4 mt-8">
        {movies.map(movie => (
          <div key={movie.id} className="bg-gray-200 text-gray-800 p-4 rounded-lg">
            <h2 className="text-xl font-bold ">{movie.title}</h2>
            <p>Rating: {movie.rating}</p>
            <p>Genre: {movie.genre}</p>
            
          </div>
        ))}
      </div>
    </main>
  );
}
