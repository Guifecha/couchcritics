import React from 'react'
import Navbar from '../components/Navbar'

import PocketBase from 'pocketbase';
import Link from 'next/link';
import FilterButtonMovies from '../components/FilterButtonMovies';
import OrderButtonMovies from '../components/OrderButtonMovies';

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
  return (
    <main className="flex min-h-screen flex-col items-center ">
      <Navbar />
      <div className='Filterdiv' style={{marginTop: "30px"}}>
          <h1 className="text-6xl font-bold text-center mb-5" id="Welcome">
            MOVIES
          </h1>
          <FilterButtonMovies />
          <OrderButtonMovies />
        </div>
      <div id="moviepanel" className="grid grid-cols-3 gap-4 mt-20">
        {movies.map(movie => (
          <div>
            <Link href={`/movies/${movie.id}`}>
            <div key={movie.id} className="bg-black text-white p-1 rounded-lg text-center movie-container" id="movie">
            <img src={movie.image_path} alt={movie.title}  style={{ width: '250px', height: '350px' }} />
            <p>{movie.title}</p>
            <div className='hoverInfo' >
              <p>Genre: {movie.genre}</p>
              <p>Rating: {movie.rating}</p>
              <p>Year: {movie.release}</p>
            </div>
          </div>
          </Link>
        </div>
        ))}
      </div>
    </main>
  );
}
