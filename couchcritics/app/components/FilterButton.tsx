'use client'
import React, { useState } from 'react';
import PocketBase from 'pocketbase';
import Link from 'next/link';

const FilterButton = () => {
    const [movies, setMovies] = useState([]);
    const [genre, setGenre] = useState('');
    const [isFilterVisible, setFilterVisible] = useState(false);
  
    async function getFilter(genre: string){
      try {
        const pb = new PocketBase('http://127.0.0.1:8090')
        const resultList = await pb.collection('movies').getList(1, 50, { filter: pb.filter("genre = {:genre}", { genre: genre }) });
        return resultList?.items as any[];
        } catch (error) {
        console.error('An error occurred while fetching', error);
        return [];
        }
    }

    const handleFilter = (newGenre) => {
        console.log(`Filtering by "${newGenre}" ...`);
        getFilter(newGenre).then((result) => {
          if (result.length > 0){
            setMovies(result);
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
        }});
      };

    const genres = ['Action','Adventure','Animation','Comedy','Crime','Drama','Romance']; // Replace this with your array of genres

return (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <input 
      type="checkbox" 
      id="filterToggle" 
      className="hidden" 
      checked={isFilterVisible}
      onChange={() => setFilterVisible(!isFilterVisible)}
    />
    <label htmlFor="filterToggle">
      Filter
    </label>
    <form style={{ display: 'flex', alignItems: 'center', color: 'black' }}>
      <select 
        id="genreDropdown" 
        className={isFilterVisible ? 'visible' : ''}
        value={genre} 
        onChange={e => {
            setGenre(e.target.value);
            handleFilter(e.target.value);    
        }}
        style={{ width: '200px', height: '30px', border: '1px solid black', marginLeft: '10px' }}
      >
        <option value="">Select Genre...</option>
        {genres.map((genre) => (
          <option key={genre} value={genre}>{genre}</option>
        ))}
      </select>
      
      <button type="submit"></button>
    </form> 
  </div>
);
}
export default FilterButton;

