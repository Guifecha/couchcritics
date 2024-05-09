'use client'
import React, { useEffect, useState } from 'react';
import PocketBase from 'pocketbase';

const FilterAndOrderTvShows = () => {
    const [isFilterVisible, setFilterVisible] = useState(false);
    const [sortOption, setSortOption] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('');
    const [tvShows, setTvShows] = useState([]);
    
    const getMovies = async () => {
        try {
            const pb = new PocketBase('http://127.0.0.1:8090')
            const resultList = await pb.collection('tvshows').getList(1, 50);
            return resultList?.items as any[];
        } catch (error) {
            console.error('An error occurred while fetching', error);
            return [];
        }
    };

    const getFilter = async (genre) => {
        try {
            const pb = new PocketBase('http://127.0.0.1:8090')
            const resultList = await pb.collection('tvshows').getList(1, 50, { filter: pb.filter("genre = {:genre}", { genre: genre }) });
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
        const fetchTvShows = selectedGenre ? getFilter : getMovies;
        fetchTvShows(selectedGenre).then((fetchedTvShows) => {
            let sortedTvShows;
            if (sortOption === 'highestRating') {
                sortedTvShows = fetchedTvShows.sort((a, b) => b.rating - a.rating);
            } else if (sortOption === 'lowestRating') {
                sortedTvShows = fetchedTvShows.sort((a, b) => a.rating - b.rating);
            } else if (sortOption === 'newestRelease') {
                sortedTvShows = fetchedTvShows.sort((a, b) => new Date(b.release) - new Date(a.release));
            } else if (sortOption === 'earliestRelease') {
                sortedTvShows = fetchedTvShows.sort((a, b) => new Date(a.release) - new Date(b.release));
            } else {
                sortedTvShows = fetchedTvShows;
            }
            if (sortedTvShows.length > 0) {
                setTvShows(sortedTvShows);
                const panel = document.getElementById("tvshowpanel");
                panel.innerHTML = '';
                sortedTvShows.forEach(tvShow => {
                    console.log(tvShow.title);
                    const tvShowDiv = document.createElement('div');
                    const link = document.createElement('a');
                    link.href = `/tvshows/${tvShow.id}`;
                    link.innerHTML =  `
                        <div key=${tvShow.id} class="bg-black text-white p-1 rounded-lg text-center movie-container" id="movie">
                        <img src=${tvShow.image_path} alt=${tvShow.title}  style="width: 250px; height: 350px;" />
                        <p>${tvShow.title}</p>
                        <div class='hoverInfo' >
                          <p>Genre: ${tvShow.genre}</p>
                          <p>Rating: ${tvShow.rating}</p>
                          <p>Year: ${tvShow.release}</p>
                        </div>`;
                    tvShowDiv.appendChild(link);
                    panel.appendChild(tvShowDiv);
                });
            }
        });
    }, [selectedGenre, sortOption]);

    const genres = ['Action','Comedy','Drama'];
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
                <option value="highestRating">Highest Rating</option>
                <option value="lowestRating">Lowest Rating</option>
                <option value="newestRelease">Newest Release</option>
                <option value="earliestRelease">Oldest Release</option>
                </select>
            </form>

            
        </div>
    );
};

export default FilterAndOrderTvShows;