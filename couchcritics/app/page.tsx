import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-6xl font-bold text-center">
        Welcome to Couch Critics
      </h1>
      <Image
        src="/popcorn.svg"
        alt="Popcorn"
        width={300}
        height={300}
        className="rounded-full"
      />
      <p className="text-xl text-center">
        The best place to find the latest movie reviews
      </p>
    </main>
  );
}
