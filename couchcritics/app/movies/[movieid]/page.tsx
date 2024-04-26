'use client'
import React, { useEffect, useState } from 'react';
import PocketBase from 'pocketbase';
import Navbar from '@/app/components/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilm, faCalendar, faStar} from '@fortawesome/free-solid-svg-icons';

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

  useEffect(() => {
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
        <Navbar />
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
        </div>
        </div>
      </main>
    )
  }
}