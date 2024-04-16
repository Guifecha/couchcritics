import Image from "next/image";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <Navbar />
        <h1 className="text-6xl font-bold text-center" id="Welcome">
          Welcome to Couch Critics
        </h1>
        <p className="text-xl text-center my-4">
          The best place to find the latest movie reviews
        </p>
        <Image
          src="/popcorn.svg"
          alt="Popcorn"
          width={300}
          height={300}
          className="rounded-full"
        />
      </main>
    </>
  );
}