import React from 'react'

const Navbar = () => {
  return (
    <nav className="flex justify-between w-full">
        <h1 className="text-2xl font-bold">Couch Critics</h1>
        <div className="flex space-x-4">
          <a href="/Movies">MOVIES</a>
          <a href="/Shows">TV SHOWS</a>
        </div>
      </nav>
  )
}

export default Navbar
