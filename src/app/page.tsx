import BlurredSVG from "../components/BlurredSVG"; // Assuming you saved the SVG component in the same folder

export default function Home() {
  return (
    <main
      style={{
        background:
          "linear-gradient(135deg, #1A1B2A 0%, #2B2D42 40%, #3E4157 100%)",
      }}
      className="relative flex min-h-screen flex-col items-center justify-between p-24"
    >
      {/* Video Element */}
      <video
        className="absolute top-0 left-0 w-screen h-screen object-cover opacity-75 z-10"
        src="/WeebWatch.mp4"
        muted
        loop
        autoPlay
      />

      <div className="z-30 space-y-12 m-auto">
        <h1 className="text-9xl text-white font-extrabold">
          Weeb<span className="text-[#E63946]">.</span>watch
        </h1>
        <div>
          <label htmlFor="search" className="sr-only">
            Search
          </label>
          <input
            id="search"
            name="search"
            type="text"
            placeholder="Enter an anime title..."
            className="block w-full rounded-md border-0 p-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      {/* SVG Overlay */}
      <div className="absolute top-0 left-0 w-screen h-screen z-20 pointer-events-none">
        <BlurredSVG />
      </div>
    </main>
  );
}
