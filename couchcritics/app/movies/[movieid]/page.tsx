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

async function getReviews(id : string){ //media id
  try {
    const pb = new PocketBase('http://127.0.0.1:8090')
    const reviews = await pb.collection('reviews').getList(1, 5, { filter: pb.filter("movie = {:id} ", { id: id}) });
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



export default function movieDetails ({ params }: { params: { movieid: string } }) {
  const [movieDetails, setMovieDetails] = useState(null);
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
        "movie": params.movieid,
        "tvshow": null,
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

    getMovie(params.movieid)
    .then(movie => {
      if (!movie) {
        return;
      }else{
        setMovieDetails(movie);
      }
    })
    .then(movie => {
      getReviews(params.movieid)
      .then(reviews => {
        setReviews(reviews);
      });
    });

  }, [params.movieid, reload]);

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
                <Link href="/movies" id='nav-Movies'>Movies</Link>
                <Link href="/tvshows" id='nav-TvShows'>TV Shows</Link>
                <div className="flex space-x-2 items-center">
                <SearchBar />
                <Link href="/profile">
                  <FontAwesomeIcon icon={faUser} style={{ width: '1em', height: '1em', marginBottom: '5px'}} />
                </Link>
                </div>
                {session && !session.isLoggedIn && <Link href ="/login" className='text-green'>Login</Link>}
              </div>
            </nav>
        <div className='MovieInfo'>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} id='CoverContainer'>
          <div id='movie'>
            <img src={`../${movieDet.image_path}`} alt={movieDet.title} style={{ width: '250px', height: '350px' }} />
          </div>
        </div>
        <div id='MovieDetails'>
          <h1>{movieDet.title}</h1>
          <div id='description'><p><strong>Description:</strong> {movieDet.description}</p></div>
          <div id='otherDetails'>
            <p> <FontAwesomeIcon icon={faFilm} style={{ width: '1em', height: '1em', marginRight: '3px', color: "#b32407" }} />: {movieDet.genre}</p>
            <p> <FontAwesomeIcon icon={faStar} style={{ width: '1em', height: '1em', marginRight: '3px', color: '#FFD43B' }} />: {movieDet.rating}</p>
            <p><FontAwesomeIcon icon={faCalendar} style={{ width: '1em', height: '1em', marginRight: '3px', color: "#7a959e" }} />: {movieDet.release}</p>
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
            {session && !session.isLoggedIn && <Link href ="/login" className='text-green mt-5'>Login to Review</Link>}
            <div id="reloadrev">
            {reviews && reviews.length > 0 ? (
              reviews.map((review, index) => (
                <div id='reviewind' className='mt-2 mb-6'key={index}>
                  <div id="revheader" className='small-font mb-2'>
                    <p>Review by: {review.username} | <FontAwesomeIcon icon={faStar} style={{ width: '1em', height: '1em', marginRight: '3px', color: '#FFD43B' }} />{review.rating}</p>
                    <p>{new Date(review.created).toLocaleDateString()}</p>
                  </div>
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