'use client'
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import PocketBase from 'pocketbase';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchVisible, setSearchVisible] = useState(false);

  async function getSearch(searchTerm: string){
    try {
      const pb = new PocketBase('http://127.0.0.1:8090')
      const resultList = await pb.collection('movies').getList(1, 1, { filter: pb.filter("title ~ {:title} ", { title: searchTerm}) });
      return resultList?.items as any[];
    } catch (error) {
      console.error('An error occurred while fetching', error);
      return [];
    }
  }
  

  const handleSearch = (event) => {
    event.preventDefault();
    console.log(`Searching for "${searchTerm}" ...`);
    getSearch(searchTerm).then((result) => {
      if (result.length > 0){
        console.log(result[0].title);
      }else{
        console.log("No results found");
      }
    });

  };

  return (
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
  {isSearchVisible && (
    <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center' }}>
      <input 
        type="text" 
        id="searchBar" 
        placeholder="Search..." 
        value={searchTerm} 
        onChange={e => setSearchTerm(e.target.value)} 
        style={{ width: '200px', height: '30px', border: '1px solid black', marginLeft: '10px' }}
      />
      <button type="submit"></button>
    </form>
  )}
</div>
  );
};

export default SearchBar;