'use client'
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import PocketBase from 'pocketbase';
import { useEffect } from 'react';
import Link from 'next/link';

async function getSearch(searchTerm: string){
  if(searchTerm === ''){
    return [];
  }
  try {
    const pb = new PocketBase('http://127.0.0.1:8090')
    const resultList = await pb.collection('movies').getList(1, 2, { filter: pb.filter("title ~ {:title} ", { title: searchTerm}) });
    return resultList?.items as any[];
  } catch (error) {
    console.error('An error occurred while fetching', error);
    return [];
  }
}

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [submit, setSubmit] = useState(false);
  const [results, setResults] = useState([]);
  const [isSearchVisible, setSearchVisible] = useState(false);

  const handleSearch = (event) => {
    event.preventDefault();
    setSubmit(!submit); // Toggle the submit state to trigger the effect
  };

  useEffect(() => {
    if (submit) {
      console.log('Form was submitted. Search term:', searchTerm);
      getSearch(searchTerm).then((result) => {
        if (result.length > 0){
          console.log(result[0].title);
          setResults(result);
        }else{
          console.log("No results found");
          setResults(['none']);
        }
      });
    }
  }, [submit]); // Run the effect when the form is submitted

  return (
    <div className="search-container">
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <input 
        type="checkbox" 
        id="searchToggle" 
        className="hidden" 
        checked={isSearchVisible}
        onChange={() => setSearchVisible(!isSearchVisible)}
      />
      <label htmlFor="searchToggle">
        <FontAwesomeIcon icon={faMagnifyingGlass} style={{ width: '1em', height: '1em', marginRight: '23px' }} />
      </label>
      <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center' }}>
        <input 
          type="text" 
          id="searchBar" 
          className={isSearchVisible ? 'visible' : ''}
          placeholder="Search..." 
          value={searchTerm} 
          onChange={e => setSearchTerm(e.target.value)} 
          style={{ width: '200px', height: '30px', border: '1px solid black', marginLeft: '10px' }}
        />
        <button type="submit"></button>
      </form>
    </div>
    {results.length > 0 && results[0] !== 'none' && isSearchVisible ? (
      <div>
      {results.map((result, index) => (
      <div className="results-card" id="results-card">
        <div key={index} style={{ display: 'flex', justifyContent: 'space-between'}}>
            <div>
              <h3>{result.title}</h3>
              <Link href={`/movies/${result.id}`}>View</Link>
            </div>
          <img src={`../${result.image_path}`} alt={result.title} style={{ width: '55px', height: '75px' }} />
        </div>
      </div>
      ))}
    </div>
  ) : results[0] === 'none' && isSearchVisible &&(
    <div id="results-card">No results found...</div>
  )}
</div>
  );
};

export default SearchBar;