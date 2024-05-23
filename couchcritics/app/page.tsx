
import Navbar from "./components/Navbar";
import PopularMovies from "./components/PopularMovies";
import PopularShows  from "./components/PopularShows";

export default function Home() {  
  return (
    <>
    <main id="main" className="flex flex-col items-center justify-between">
        <Navbar/>
        <div className="WelcomeDiv">
          <h1 className="text-6xl font-bold text-center" id="Welcome">
            Welcome to Couch Critics
          </h1>
          <p className="text-xl text-center" id="Description">
            find the latest movies and tv shows reviews
          </p>
        </div>
        <PopularMovies />
        <PopularShows />
      </main>
    </>
  );
}
