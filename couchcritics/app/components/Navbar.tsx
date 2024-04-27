import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faUser } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import SearchBar from './SearchBar';

const Navbar = () => {
  return (
    <nav className="flex justify-between w-full p-6 px-60">
      <Link href="/"><h1 className="text-2xl font-bold">Couch Critics</h1></Link>
      <div className="flex space-x-20 items-baseline" >
        <Link href="/movies" id='nav-Movies'>Movies</Link>
        <Link href="/tvshows" id='nav-TvShows'>TV Shows</Link>
        <SearchBar />
        <Link href="/profile">
          <FontAwesomeIcon icon={faUser} style={{ width: '1em', height: '1em'}} />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;