import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faUser } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  return (
    <nav className="flex justify-between w-full p-20 px-60">
      <h1 className="text-2xl font-bold">Couch Critics</h1>
      <div className="flex space-x-10 items-baseline" >
        <a href="/Movies">MOVIES</a>
        <a href="">TV SHOWS</a>
        <input type="checkbox" id="searchToggle" className="hidden" />
        <label htmlFor="searchToggle">
          <FontAwesomeIcon icon={faMagnifyingGlass} style={{ width: '1em', height: '1em' }} />
        </label>
        <input type="text" id="searchBar" className="hidden" placeholder="Search..." />
        <a href="/Account">
          <FontAwesomeIcon icon={faUser} style={{ width: '1em', height: '1em'}} />
        </a>
      </div>
    </nav>
  );
};

export default Navbar;