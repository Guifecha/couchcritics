'use client'
import React, { useState } from 'react';
import PocketBase from 'pocketbase';

const OrderButtonMovies = () => {
    const [isFilterVisible, setFilterVisible] = useState(false);
    const [sortOption, setSortOption] = useState('');
    async function getMoviesByRating(){
        try {
            const pb = new PocketBase('http://127.0.0.1:8090')
            const resultList = await pb.collection('movies').getList(1, 50);
            const sortedMovies = resultList?.items.sort((a, b) => b.rating - a.rating);
            return sortedMovies as any[];
        } catch (error) {
            console.error('An error occurred while fetching', error);
            return [];
        }
    }

    async function getMoviesByRelease(){
        try {
            const pb = new PocketBase('http://127.0.0.1:8090')
            const resultList = await pb.collection('movies').getList(1, 50);
            const sortedMovies = resultList?.items.sort((a, b) => new Date(b.release) - new Date(a.release));
            return sortedMovies as any[];
        } catch (error) {
            console.error('An error occurred while fetching', error);
            return [];
        }
    }

    const handleOrder = (sortOption) => {
        console.log(`Ordering ...`);
        const getMoviesFunction = sortOption === 'rating' ? getMoviesByRating : getMoviesByRelease;
        getMoviesFunction().then((result) => {
            if (result.length > 0){
                const panel = document.getElementById("moviepanel");
                panel.innerHTML = '';
                result.forEach(movie => {
                    console.log(movie.title);
                    const movieDiv = document.createElement('div');
                    const link = document.createElement('a');
                    link.href = `/movies/${movie.id}`;
                    link.innerHTML =  `
                        <div key=${movie.id} class="bg-black text-white p-1 rounded-lg text-center movie-container" id="movie">
                        <img src=${movie.image_path} alt=${movie.title}  style="width: 250px; height: 350px;" />
                        <p>${movie.title}</p>
                        <div class='hoverInfo' >
                        <p>Genre: ${movie.genre}</p>
                        <p>Rating: ${movie.rating}</p>
                        <p>Year: ${movie.release}</p>
                        </div>`;
                    movieDiv.appendChild(link);
                    panel.appendChild(movieDiv);
                })
            }
        });
    };

    return (
        <div id='filter'>
  <input 
    type="checkbox" 
    id="filterToggle" 
    className="hidden" 
    checked={isFilterVisible}
    onChange={() => setFilterVisible(!isFilterVisible)}
  />
  <label htmlFor="filterToggle">
    Sort
  </label>
  <form style={{ display: 'flex', alignItems: 'center', color: 'black' }}>
    <select 
      id="sortDropdown" 
      className={isFilterVisible ? 'visible' : ''}
      onChange={e => {
          handleOrder(e.target.value);    
      }}
      style={{ width: '200px', height: '30px', border: '1px solid black', marginLeft: '10px' }}
    >
      <option value="">Sort By...</option>
      <option value="rating">Highest Rating</option>
      <option value="release">Release Date</option>
    </select>
    
    <button type="submit"></button>
  </form> 
</div>
    );
};

export default OrderButtonMovies;