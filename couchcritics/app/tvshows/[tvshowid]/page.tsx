'use client'
import React, { useEffect, useState } from 'react';
import PocketBase from 'pocketbase';
import Navbar from '@/app/components/Navbar';

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
        <img src={`../${tvshowDet.image_path}`} alt={tvshowDet.title}  style={{ width: '250px', height: '350px' }} />
          <h1>{tvshowDet.title}</h1>
          <p>Genre: {tvshowDet.genre}</p>
          <p>Rating: {tvshowDet.rating}</p>
          <p>Year: {tvshowDet.release}</p>
        </div>
      </main>
    )
  }
}