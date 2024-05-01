'use client'
import React, { useEffect, useState } from 'react';
import PocketBase from 'pocketbase';
import Navbar from '@/app/components/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilm, faCalendar, faStar, faUser} from '@fortawesome/free-solid-svg-icons';
import { getSessionData } from '@/actions';
import Link from 'next/link';
import SearchBar from '@/app/components/SearchBar';

type SessionData = {
  isLoggedIn: boolean;
  userId: string | undefined;
  username: string | undefined;
};

async function getTvShow(id : string){
  try {
    const pb = new PocketBase('http://127.0.0.1:8090')
    const tvshow = await pb.collection('tvshows').getList(1, 1, { filter: pb.filter("id = {:id} ", { id: id}) });
    return tvshow;
  } catch (error) {
    console.error('An error occurred while fetching', error);
    return null;
  }
}
 
export default function tvShowDetails ({ params }: { params: { tvshowid: string } }) {
  const [tvshowDetails, settvshowDetails] = useState(null);
  const [session, setSession] = useState<SessionData | null>(null);

  useEffect(() => {
    getSessionData().then(sessionData => {
      console.log("session:");
      console.log(sessionData);
      setSession(sessionData);
    });

    getTvShow(params.tvshowid).then(tvshow => {
      if (!tvshow) {
        return;
      }else{
        settvshowDetails(tvshow);
      }
    });
  }, [params.tvshowid]);

  console.log(tvshowDetails);
  if (tvshowDetails === null) {
    return <div>Loading...</div>;
  } else if (tvshowDetails.items.length === 0) {
    return <div>No tvshow Found...</div>;
  }
  else{
    const tvshowDet = tvshowDetails.items[0];
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
        <div className='tvshowInfo'>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} id='CoverContainer'>
          <div id='show'>
            <img src={`../${tvshowDet.image_path}`} alt={tvshowDet.title} style={{ width: '250px', height: '350px' }} />
          </div>
        </div>
        <div id='tvshowDetails'>
          <h1>{tvshowDet.title}</h1>
          <div id='description'><p><strong>Description:</strong> {tvshowDet.description}</p></div>
          <div id='otherDetails'>
          <p> <FontAwesomeIcon icon={faFilm} style={{ width: '1em', height: '1em', marginRight: '3px', color: "#b32407" }} />: {tvshowDet.genre}</p>
            <p> <FontAwesomeIcon icon={faStar} style={{ width: '1em', height: '1em', marginRight: '3px', color: '#FFD43B' }} />: {tvshowDet.rating}</p>
            <p><FontAwesomeIcon icon={faCalendar} style={{ width: '1em', height: '1em', marginRight: '3px', color: "#7a959e" }} />: {tvshowDet.release}</p>
          </div>
          {session && session.isLoggedIn && <button className=''>Add a review</button>}
          {session && !session.isLoggedIn && <button className=''>Login to review</button>}
        </div>
        </div>
      </main>
    )
  }
}