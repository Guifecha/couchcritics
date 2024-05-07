'use client'
import React, { useState } from 'react';
import PocketBase from 'pocketbase';


const FilterButtonTvshows = () => {
    const [tvshows, setTvshows] = useState([]);
    const [genre, setGenre] = useState('');
    const [isFilterVisible, setFilterVisible] = useState(false);
  
    async function getFilter(genre: string){
      try {
        const pb = new PocketBase('http://127.0.0.1:8090')
        const resultList = await pb.collection('tvshows').getList(1, 50, { filter: pb.filter("genre = {:genre}", { genre: genre }) });
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
            setTvshows(result);
            const panel = document.getElementById("tvshowpanel");
            panel.innerHTML = '';
            result.forEach(tvshow => {
              console.log(tvshow.title);
              const tvshowDiv = document.createElement('div');
              const link = document.createElement('a');
              link.href = `/tvshows/${tvshow.id}`;
              link.innerHTML =  `
                <div key=${tvshow.id} class="bg-black text-white p-1 rounded-lg text-center movie-container" id="movie">
                <img src=${tvshow.image_path} alt=${tvshow.title}  style="width: 250px; height: 350px;" />
                <p>${tvshow.title}</p>
                <div class='hoverInfo' >
                  <p>Genre: ${tvshow.genre}</p>
                  <p>Rating: ${tvshow.rating}</p>
                  <p>Year: ${tvshow.release}</p>
                </div>`;
              tvshowDiv.appendChild(link);
              panel.appendChild(tvshowDiv);
          })
        }});
      };

    const genres = ['Action','Comedy','Drama']; // Replace this with your array of genres

return (
  <div  id='filter'>
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
export default FilterButtonTvshows;

