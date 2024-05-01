'use client'
import React, { useEffect, useState } from 'react';
import PocketBase from 'pocketbase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilm, faCalendar, faStar, faUser} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import SearchBar from '@/app/components/SearchBar';
import { getSessionData } from '@/actions';

type SessionData = {
  isLoggedIn: boolean;
  userId: string | undefined;
  username: string | undefined;
};

async function getMovie(id : string){
  try {
    const pb = new PocketBase('http://127.0.0.1:8090')
    const movie = await pb.collection('movies').getList(1, 1, { filter: pb.filter("id = {:id} ", { id: id}) });
    return movie;
  } catch (error) {
    console.error('An error occurred while fetching', error);
    return null;
  }
}

export default function movieDetails ({ params }: { params: { movieid: string } }) {
  const [movieDetails, setMovieDetails] = useState(null);
  const [session, setSession] = useState<SessionData | null>(null);

  useEffect(() => {
    getSessionData().then(sessionData => {
      console.log("session:");
      console.log(sessionData);
      setSession(sessionData);
    });

    getMovie(params.movieid).then(movie => {
      if (!movie) {
        return;
      }else{
        setMovieDetails(movie);
      }
    });
  }, [params.movieid]);

  console.log(movieDetails);
  if (movieDetails === null) {
    return <div>Loading...</div>;
  } else if (movieDetails.items.length === 0) {
    return <div>No Movie Found...</div>;
  }
  else{
    const movieDet = movieDetails.items[0];
    return (
      <main className="flex min-h-screen flex-col items-center ">
            <nav className="flex justify-between w-full p-6 px-60">
              <Link href="/"><h1 className="text-2xl font-bold">Couch Critics</h1></Link>
              <div className="flex space-x-20 items-baseline" >
                {session && !session.isLoggedIn && <Link href ="/login" className='text-green'>Login</Link>}
                {session && session.isLoggedIn && <Link href="/" className='text-red'></Link>}
                <Link href="/movies" id='nav-Movies'>Movies</Link>
                <Link href="/tvshows" id='nav-TvShows'>TV Shows</Link>
                <SearchBar />
                <Link href="/profile">
                  <FontAwesomeIcon icon={faUser} style={{ width: '1em', height: '1em'}} />
                </Link>
              </div>
            </nav>
        <div className='MovieInfo'>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} id='CoverContainer'>
          <h1>{movieDet.title}</h1>
          <div id='movie'>
            <img src={`../${movieDet.image_path}`} alt={movieDet.title} style={{ width: '250px', height: '350px' }} />
          </div>
        </div>
        <div id='MovieDetails'>
          <div id='description'><p><strong>Description:</strong> {movieDet.description}</p></div>
          <div id='otherDetails'>
            <p> <FontAwesomeIcon icon={faFilm} style={{ width: '1em', height: '1em', marginRight: '3px', color: "#b32407" }} />: {movieDet.genre}</p>
            <p> <FontAwesomeIcon icon={faStar} style={{ width: '1em', height: '1em', marginRight: '3px', color: '#FFD43B' }} />: {movieDet.rating}</p>
            <p><FontAwesomeIcon icon={faCalendar} style={{ width: '1em', height: '1em', marginRight: '3px', color: "#7a959e" }} />: {movieDet.release}</p>
          </div>
          {session && session.isLoggedIn && <button className=''>Add a review</button>}
          {session && !session.isLoggedIn && <button className=''>Login to review</button>}
        </div>
        </div>
      </main>
    )
  }
}