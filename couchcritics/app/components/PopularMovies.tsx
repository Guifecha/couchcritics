import React from 'react';

const PopularMovies = () => {
  return (
    <div className='PopularMovies p-20 px-60'>
      <h1 className='font-bold' id='PopularMovies'>Popular Movies</h1>
      <div className="flex justify-start    ">
  <div className="m-10 font-bold">
    <p>Black Widow</p>
  </div>
  <div className="m-10 font-bold">
    <p>Jungle Cruise</p>
  </div>
  <div className="m-10 font-bold">
    <p>The Tomorrow War</p>
  </div>
  <div className="m-10 font-bold">
    <p>Luca</p>
  </div>
</div>
    </div>
  );
};

export default PopularMovies;