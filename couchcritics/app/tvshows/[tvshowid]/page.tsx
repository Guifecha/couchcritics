'use client'
import React, { useEffect, useState } from 'react';
import PocketBase from 'pocketbase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilm, faCalendar, faStar, faUser, faXmark} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import SearchBar from '@/app/components/SearchBar';
import { getSessionData } from '@/actions';

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

async function getTvShowReviews(id : string){ //media id
  try {
    const pb = new PocketBase('http://127.0.0.1:8090')
    const reviews = await pb.collection('reviews').getList(1, 5, { filter: pb.filter("tvshow = {:id} ", { id: id}) });
    const reviewsWithUsers = await Promise.all(reviews.items.map(async review => {
      const username = await getUser(review.user);
      review.username = username;
      return review;
    }));
    return reviewsWithUsers;
  } catch (error) {
    console.error('An error occurred while fetching', error);
    return null;
  }
}

async function getUser(userid : string){
  try {
    const pb = new PocketBase('http://127.0.0.1:8090')
    const user = await pb.collection('users').getList(1, 1, { filter: pb.filter("id = {:id} ", { id: userid}) });
    return user.items[0].username;
  } catch (error) {
    console.error('An error occurred while fetching', error);
    return null;
  }
}

export default function TvShowDetails ({ params }: { params: { tvshowid: string } }) {
  const [tvshowDetails, settvshowDetails] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [session, setSession] = useState<SessionData | null>(null);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [reload, setReload] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleButtonClick = () => {
    if (buttonClicked == true) {
      setButtonClicked(false);
      setShowForm(false);
    }
    else{
      setButtonClicked(true);
      setShowForm(true);
    }
  };

  const handleModalClose = () => {
    setButtonClicked(false);
    setShowForm(false);
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!session.isLoggedIn) {
      return;
    }
    
    const review = event.target.elements.review.value;
    const rating = event.target.elements.rating.value;

    const submitReview = async () => {
      const pb = new PocketBase('http://127.0.0.1:8090');

      const data = {
        "user":  session.userId,
        "tvshow": params.tvshowid,
        "movie": null,
        "review": review,
        "rating": rating
      };
      console.log(data)
      const record = await pb.collection('reviews').create(data);  

    };
    await submitReview();
    console.log("Review submitted");

    setShowSuccess(true); // Add this line
    setTimeout(() => setShowSuccess(false), 2000); // hide after 3 seconds
    setShowForm(false);
    setButtonClicked(false);
    setReload(!reload);
  };

  useEffect(() => {
    getSessionData().then(sessionData => {
      setSession(sessionData);
    });

    getTvShow(params.tvshowid)
    .then(tvshow => {
      if (!tvshow) {
        return;
      }else{
        settvshowDetails(tvshow);
      }
    })
    .then(tvshow => {
      getTvShowReviews(params.tvshowid)
      .then(reviews => {
        setReviews(reviews);
      });
    });

  }, [params.tvshowid, reload]);


  if (tvshowDetails === null) {
    return <div>Loading...</div>;
  } else if (tvshowDetails.items.length === 0) {
    return <div>No TV Show Found...</div>;
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
          </div>
          
        </div>
        <div id='reviews'>
            <h1>Reviews</h1>
          <div className='RevContent'>
            {session && session.isLoggedIn && <button onClick={handleButtonClick} className='AddReview'>Add review</button>}
            {showForm && (
            <div className="modal">
            <form id="subreview" onSubmit={handleSubmit} className="modal-content">
            <button type="button" className="close-button" onClick={handleModalClose}><FontAwesomeIcon icon={faXmark} style={{ width: '1em', height: '1em' }} /></button>
              <label>
                Review:
                <textarea name="review" className='custom-textarea' required />
              </label>
              <label>
                Rating:
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <input type="number" className='custom-input' name="rating" min="0" max="10" step="0.1" required />
                  <span style={{marginLeft: '10px'}}>/10</span>
                </div>
              </label>
              <button type="submit" id="submit">Submit</button>
            </form>
          </div>
            )}
            {showSuccess && (
              <div className="success-message">
                Review submitted successfully!
              </div>
            )}
            {session && !session.isLoggedIn && <Link href ="/login" className='text-green'>Login to Review</Link>}
            <div id="reloadrev">
            {reviews && reviews.length > 0 ? (
              reviews.map((review, index) => (
                <div id='reviewind' className='mt-5'key={index}>
                  <p className='small-font mb-2'>Review by: {review.username} | <FontAwesomeIcon icon={faStar} style={{ width: '1em', height: '1em', marginRight: '3px', color: '#FFD43B' }} />{review.rating}</p>
                  <p>{review.review}</p>
                </div>
              ))
            ) : (
              <p>No reviews available.</p>
            )}
            </div>
          </div>
          </div>
      </main>
    )
  }
}