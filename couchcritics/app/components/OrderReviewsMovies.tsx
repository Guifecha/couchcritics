'use client'
import React, { useEffect, useState } from 'react';
import PocketBase from 'pocketbase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { createRoot } from 'react-dom/client';

const OrderReviewsMovies = ({movieId}) => {
    const [isFilterVisible, setFilterVisible] = useState(true);
    const [sortOption, setSortOption] = useState('');
    const [reviews, setReviews] = useState([]);

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
      useEffect(() => {
        getReviews(movieId).then((fetchedReviews) => {
                    if (fetchedReviews) {
                        let sortedReviews;
                        if (sortOption === 'highestRating') {
                            sortedReviews = fetchedReviews.sort((a, b) => b.rating - a.rating);
                        } else if (sortOption === 'lowestRating') {
                            sortedReviews = fetchedReviews.sort((a, b) => a.rating - b.rating);
                        } else if (sortOption === 'newestReview') {
                            sortedReviews = fetchedReviews.sort((a, b) => new Date(b.created) - new Date(a.created));
                        } else if (sortOption === 'earliestReview') {
                            sortedReviews = fetchedReviews.sort((a, b) => new Date(a.created) - new Date(b.created));
                        } else {
                            sortedReviews = fetchedReviews;
                        }
                        console.log(sortedReviews);
                        setReviews(sortedReviews);
                        const panel = document.getElementById("reviewpanel");
                        panel.innerHTML = '';
                        if (sortedReviews) {
                            sortedReviews.forEach((review, index) => {
                                const reviewDiv = document.createElement('div');
                                const link = document.createElement('a');
                                //link.href = `/reviews/${review.id}`;
                                const ReviewComponent = () => (
                                    <div id='reviewind' className='mt-5' key={index}>
                                        <div id="revheader" className='small-font mb-2'>
                                            <p>{review.username} | 
                                                <FontAwesomeIcon icon={faStar} style={{ width: '1em', height: '1em', marginRight: '3px', color: '#FFD43B' }} />
                                                {review.rating}
                                            </p>
                                            <p>{new Date(review.created).toLocaleDateString()}</p>
                                        </div>
                                        <p>{review.review}</p>
                                    </div>
                                );
                                const root = createRoot(reviewDiv);
                                root.render(<ReviewComponent />);
                                link.appendChild(reviewDiv);
                                panel.appendChild(link);
                            });
                        }
                    }
                });
            }, [sortOption]); // re-run the effect when `sortOption` changes

      return (
        <div id='filter'>
            <form style={{ display: 'flex', alignItems: 'center', color: 'black' }}>
                <select 
                    id="sortDropdown" 
                    className={isFilterVisible ? 'visible' : ''}
                    onChange={e => setSortOption(e.target.value)}
                    style={{ width: '200px', height: '30px', border: '1px solid black', marginLeft: '10px' }}
                >
                    <option value="">Sort By...</option>
                    <option value="highestRating">Highest Rating</option>
                    <option value="lowestRating">Lowest Rating</option>
                    <option value="newestReview">Newest Review</option>
                    <option value="earliestReview">Earliest Review</option>
                </select>
            </form>
        </div>
    );
};

export default OrderReviewsMovies;