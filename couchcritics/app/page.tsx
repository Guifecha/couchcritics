
import Navbar from "./components/Navbar";
import PopularMovies from "./components/PopularMovies";
import PopularShows  from "./components/PopularShows";

export default function Home() {  
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-between  ">
        <Navbar/>
        <div className="WelcomeDiv ">
          <h1 className="text-6xl font-bold text-center" id="Welcome">
            Welcome to Couch Critics
          </h1>
          <p className="text-xl text-center my-1" id="Description">
            The best place to find the latest movie reviews
          </p>
        </div>
        <PopularMovies />
        <PopularShows />

      </main>
    </>
  );
}