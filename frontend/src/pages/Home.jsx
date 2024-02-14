function Home() {
  return (
    <>
      <div className="absolute inset-x-44 top-64 " id="home">
        <div className="flex flex-col items-center justify-center text-white">
          <h1 className="font-bold text-2xl mb-6">
            Welcome to Dryice support center!{" "}
          </h1>
          <a
            href="/new-ticket"
            class="bg-blue-500 px-6 py-3 shadow-sm hover:bg-blue-700 rounded-full text-white text-base font-semibold w-64 text-center"
          >
            <span className="relative">Create Ticket</span>
          </a>

          {/* <p className="mt-8 text-gray-700 dark:text-gray-300">
            Welcome to our cutting-edge ticketing and support system. We are
            dedicated to providing you with top-tier customer service and
            assistance. Our innovative solutions and passionate team are here to
            make your experience as smooth as possible, so you can focus on what
            you do best.
          </p> */}
        </div>
        <div className="bg-white p-8 mt-44 sm:flex justify-between gap-4 rounded-lg border">
          <div className="text-left">
            <h6 className="text-base font-semibold">Unmatched Reliability</h6>
            <p className="mt-2">Count on us for uninterrupted service.</p>
          </div>
          <div className="text-left">
            <h6 className="text-base font-semibold">
              Exceptional User Experience
            </h6>
            <p className="mt-2">
              Easy-to-use interface for a seamless experience.
            </p>
          </div>
          <div className="text-left">
            <h6 className="text-base font-semibold">24/7 Expert Support</h6>
            <p className="mt-2">Round-the-clock assistance from our experts.</p>
          </div>
        </div>
      </div>
    </>
  );
}
export default Home;
