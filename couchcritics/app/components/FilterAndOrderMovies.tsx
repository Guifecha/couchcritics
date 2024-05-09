'use client'
import React, { useEffect, useState } from 'react';
import PocketBase from 'pocketbase';

const FilterAndOrderMovies = () => {
    const [isFilterVisible, setFilterVisible] = useState(false);
    const [sortOption, setSortOption] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('');
    const [movies, setMovies] = useState([]);
    
    const getMovies = async () => {
        try {
            const pb = new PocketBase('http://127.0.0.1:8090')
            const resultList = await pb.collection('movies').getList(1, 50);
            return resultList?.items as any[];
        } catch (error) {
            console.error('An error occurred while fetching', error);
            return [];
        }
    };

    const getFilter = async (genre) => {
        try {
            const pb = new PocketBase('http://127.0.0.1:8090')
            const resultList = await pb.collection('movies').getList(1, 50, { filter: pb.filter("genre = {:genre}", { genre: genre }) });
            return resultList?.items as any[];
        } catch (error) {
            console.error('An error occurred while fetching', error);
            return [];
        }
    };

    const handleFilterAndOrder = (genre, sortOption) => {
        setSelectedGenre(genre);
        setSortOption(sortOption);
    };
    
    useEffect(() => {
        console.log(`Filtering by "${selectedGenre}" and ordering by "${sortOption}" ...`);
    const fetchMovies = selectedGenre ? getFilter : getMovies;
    fetchMovies(selectedGenre).then((fetchedMovies) => {
        let sortedMovies;
        if (sortOption === 'rating') {
            sortedMovies = fetchedMovies.sort((a, b) => b.rating - a.rating);
        } else if (sortOption === 'release') {
            sortedMovies = fetchedMovies.sort((a, b) => new Date(b.release) - new Date(a.release));
        } else {
            sortedMovies = fetchedMovies;
        }
        if (sortedMovies.length > 0) {
            setMovies(sortedMovies);
            const panel = document.getElementById("moviepanel");
            panel.innerHTML = '';
            sortedMovies.forEach(movie => {
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
            });
        }
    });
}, [selectedGenre, sortOption]);
    const genres = ['Action','Adventure','Animation','Comedy','Crime','Drama','Romance'];
        return (
        <div id='filter'>
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
                    <option value="">Select Genre...</option>
                    {genres.map((genre) => (
                    <option key={genre} value={genre}>{genre}</option>
                    ))}

                    
                </select>
            </form>

            
            <form style={{ display: 'flex', alignItems: 'center', color: 'black' }}>
            <select 
    id="sortDropdown" 
    className={isFilterVisible ? 'visible' : ''}
    onChange={e => handleFilterAndOrder(selectedGenre, e.target.value)}
    style={{ width: '200px', height: '30px', border: '1px solid black', marginLeft: '10px' }}
>
                    <option value="">Sort By...</option>
                    <option value="rating">Highest Rating</option>
                    <option value="release">Release Date</option>
                </select>
            </form>

            
        </div>
    );
};

export default FilterAndOrderMovies;