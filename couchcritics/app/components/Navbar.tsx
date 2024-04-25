import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faUser } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import SearchBar from './SearchBar.client';

const Navbar = () => {
  return (
    <nav className="flex justify-between w-full p-20 px-60">
      <Link href="/"><h1 className="text-2xl font-bold">Couch Critics</h1></Link>
      <div className="flex space-x-20 items-baseline" >
        <Link href="/movies">Movies</Link>
        <Link href="/tvshows">TV Shows</Link>
        <SearchBar />
        <a href="/account">
          <FontAwesomeIcon icon={faUser} style={{ width: '1em', height: '1em'}} />
        </a>
      </div>
    </nav>
  );
};

export default Navbar;