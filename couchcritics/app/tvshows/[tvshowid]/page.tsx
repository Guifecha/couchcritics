'use client'
import React, { useEffect, useState } from 'react';
import PocketBase from 'pocketbase';
import Navbar from '@/app/components/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilm, faCalendar, faStar} from '@fortawesome/free-solid-svg-icons';


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

  useEffect(() => {
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
        <Navbar />
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
        </div>
        </div>
      </main>
    )
  }
}