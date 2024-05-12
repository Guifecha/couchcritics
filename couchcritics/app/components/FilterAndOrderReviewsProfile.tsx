'use client'
import React, { useEffect, useState } from 'react';
import PocketBase from 'pocketbase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { createRoot } from 'react-dom/client';

const FilterAndOrderReviewsProfile = ({userId}: {userId: string}) => {
    const [isFilterVisible, setFilterVisible] = useState(false);
    const [sortOption, setSortOption] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [reviews, setReviews] = useState([]);
    const sortedReviews = reviews;

    const getReviews = async () => {
        try {
            const pb = new PocketBase('http://127.0.0.1:8090')
            const resultList = await pb.collection('reviews').getList(1, 5, { filter: pb.filter("user = {:userId} ", { userId: userId}) });
            const reviews = resultList?.items as any[];
            for (let review of reviews) {
                if (review.movie) {
                    review.movieTitle = await getMovie(review.movie);
                } else if (review.tvshow) {
                    review.tvshowTitle = await getTVShow(review.tvshow);
                }
            }
            return reviews;
        } catch (error) {
            console.error('An error occurred while fetching', error);
            return [];
        }
    };

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
    };
    
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

    const getFilter = async (type) => {
        try {
            const pb = new PocketBase('http://127.0.0.1:8090');
            let filter;
            if (type === "") {
                filter = pb.filter('user = {:userId}', { userId: userId });
            }
            else if (type === 'Movie') {
                filter = pb.filter('movie != "" && user = {:userId}', { userId: userId });
            } else if (type === 'TV Show') {
                filter = pb.filter('tvshow != "" && user = {:userId}', { userId: userId });
            }
            const resultList = await pb.collection('reviews').getList(1, 50, { filter: filter });
            const reviews = resultList?.items as any[];
            for (let review of reviews) {
                if (review.movie) {
                    review.movieTitle = await getMovie(review.movie);
                } else if (review.tvshow) {
                    review.tvshowTitle = await getTVShow(review.tvshow);
                }
            }
            return reviews;
        } catch (error) {
            console.error('An error occurred while fetching', error);
            return [];
        }
    };

    const handleFilterAndOrder = (type, sortOption) => {
        setSelectedType(type);
        setSortOption(sortOption);
    };

    useEffect(() => {
        console.log(`Filtering by "${selectedType}" and ordering by "${sortOption}" ...`);
        const fetchReviews = selectedType ? getFilter : getReviews;
        fetchReviews(selectedType).then((fetchedReviews) => {
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
            setReviews(sortedReviews);
            const panel = document.getElementById("reviewpanel");
            panel.innerHTML = '';
            if (sortedReviews.length === 0) {
                const noReviewsMessage = document.createElement('p');
                noReviewsMessage.textContent = 'No reviews available.';
                panel.appendChild(noReviewsMessage);
            } else {
                sortedReviews.forEach((review, index) => {
                    const reviewDiv = document.createElement('div');
                    const link = document.createElement('a');
                    if (review.movie) {
                        link.href = `/movies/${review.movie}`;
                    }
                    if (review.tvshow) {
                        link.href = `/tvshows/${review.tvshow}`;
                    }
                    const ReviewComponent = () => (
                        <div id='reviewind' className='mt-5' key={index}>
                            <div id="revheader" className='small-font mb-2'>
                                <p>{review.tvshow ? review.tvshowTitle : review.movieTitle} | 
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
        });
    }, [selectedType, sortOption]);

    const types = ['Movie', 'TV Show'];

return (
    <div id='filter'>
        {sortedReviews.length > 0 && (
            <>
                <input 
                    type="checkbox" 
                    id="filterToggle" 
                    className="hidden" 
                    checked={isFilterVisible}
                    onChange={() => setFilterVisible(!isFilterVisible)}
                />
                <form style={{ display: 'flex', alignItems: 'center', color: 'black' }}>
                    <select 
                        id="filterDropdown" 
                        className={isFilterVisible ? 'visible' : ''}
                        onChange={e => handleFilterAndOrder(e.target.value, sortOption)}
                        style={{ width: '200px', height: '30px', border: '1px solid black', marginLeft: '10px' }}
                    >
                        <option value="">All</option>
                        {types.map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </form>
                <form style={{ display: 'flex', alignItems: 'center', color: 'black' }}>
                    <select 
                        id="sortDropdown" 
                        className={isFilterVisible ? 'visible' : ''}
                        onChange={e => handleFilterAndOrder(selectedType, e.target.value)}
                        style={{ width: '200px', height: '30px', border: '1px solid black', marginLeft: '10px' }}
                    >
                        <option value="">Sort By...</option>
                        <option value="highestRating">Highest Rating</option>
                        <option value="lowestRating">Lowest Rating</option>
                        <option value="newestReview">Newest Review</option>
                        <option value="earliestReview">Earliest Review</option>
                    </select>
                </form>
            </>
        )}
    </div>
);
};

export default FilterAndOrderReviewsProfile;