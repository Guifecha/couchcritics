import React from 'react'
import Navbar from '../components/Navbar'
import FilterAndOrderReviewsProfile from '../components/FilterAndOrderReviewsProfile';
import Link from 'next/link';

import PocketBase from 'pocketbase';
import { getSession } from '@/actions';
import { redirect } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';


export const dynamic = 'auto',
  dynamicParams = true,
  revalidate = 0,
  fetchCache = 'auto',
  runtime = 'nodejs',
  preferredRegion = 'auto'


async function getReviews(userId : string){ //media id
try {
    const pb = new PocketBase('http://127.0.0.1:8090')
    const reviews = await pb.collection('reviews').getList(1, 5, { filter: pb.filter("user = {:userId} ", { userId: userId}) });
    console.log(reviews);
    const reviewsWithNames = await Promise.all(reviews.items.map(async review => {
        let name;
        if (review.movie) {
          name = await getMovie(review.movie);
        } else if (review.tvshow) {
          name = await getTVShow(review.tvshow);
        }
        review.name = name;
        return review;
      }));
    return reviewsWithNames;
} catch (error) {
    console.error('An error occurred while fetching', error);
    return null;
}
}

async function getMovie(movieid : string){
    try {
      const pb = new PocketBase('http://127.0.0.1:8090')
      const movie = await pb.collection('movies').getList(1, 1, { filter: pb.filter("id = {:id} ", { id: movieid}) });
      console.log(movie.items[0].title);
      return movie.items[0].title;
    } catch (error) {
      console.error('An error occurred while fetching', error);
      return null;
    }
  }

async function getTVShow(tvshowid : string){
    try {
        const pb = new PocketBase('http://127.0.0.1:8090')
        const tvshow = await pb.collection('tvshows').getList(1, 1, { filter: pb.filter("id = {:id} ", { id: tvshowid}) });
        console.log(tvshow.items[0].title);
        return tvshow.items[0].title;
      } catch (error) {
        console.error('An error occurred while fetching', error);
        return null;
      }
    }


    async function getUser(userid : string){
      try {
        const pb = new PocketBase('http://127.0.0.1:8090')
        const user = await pb.collection('users').getList(1, 1, { filter: pb.filter("id = {:id} ", { id: userid}) });
        return user.items[0];
      } catch (error) {
        console.error('An error occurred while fetching', error);
        return null;
      }
    }

// profile return function
export default async function profile(){
    const session = await getSession();
    if(!session.isLoggedIn){
        redirect("/login");
    }

    console.log(session);

    const reviews = await getReviews(session.userId);
    const user = await getUser(session.userId);
    console.log("USER",user);
    const date = new Date(user.created).toLocaleDateString();
    return (
      <main className="flex min-h-screen flex-col items-center">
      <Navbar />
      <div className="flex flex-col items-center">
          <h1 className='text-4xl mt-10'>Welcome to your profile, <b>{session.username}</b></h1>
          <div id="reviews" className='mt-10 flex'>
              <div id='profile-info'>
                  <h2>Favorite Genre: <strong>{user.favgenre}</strong></h2>
                  <h2>Birthday date: <strong>{user.birthday}</strong></h2>
                  <h2>Joined us in: <strong>{date}</strong></h2>
                  <h2> Description: <strong>{user.description}</strong></h2>
              </div>
              <Link href="/reviews" id='MyReviews'>My Reviews</Link>
          </div>
      </div>
  </main>
    );
}