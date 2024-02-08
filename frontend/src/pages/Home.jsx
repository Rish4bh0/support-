function Home() {
  return (
    <>
      <div className="relative" id="home">
        <div
          aria-hidden="true"
          className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40 dark:opacity-20"
        >
          <div className="blur-[106px] h-56 bg-gradient-to-br from-primary to-purple-400 dark:from-blue-700" />
          <div className="blur-[106px] h-32 bg-gradient-to-r from-cyan-400 to-sky-300 dark:to-indigo-600" />
        </div>
        <div className="flex flex-col items-center justify-center text-white">
          <h1 className="font-bold text-2xl md:text-2xl xl:text-4xl mb-6">
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

          <div className="py-8 mt-16 sm:flex justify-between gap-4">
            <div className="text-left">
              <h6 className="text-lg font-semibold">Unmatched Reliability</h6>
              <p className="mt-2">Count on us for uninterrupted service.</p>
            </div>
            <div className="text-left">
              <h6 className="text-lg font-semibold">
                Exceptional User Experience
              </h6>
              <p className="mt-2">
                Easy-to-use interface for a seamless experience.
              </p>
            </div>
            <div className="text-left">
              <h6 className="text-lg font-semibold">24/7 Expert Support</h6>
              <p className="mt-2">
                Round-the-clock assistance from our experts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Home;

/*
import { FaQuestionCircle, FaTicketAlt, FaHistory, FaList, FaInfo, FaUserPlus, FaPlus, FaBoxTissue } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Home() {
  // Access the user's role from Redux state
  const userRole = useSelector((state) => state.auth.user?.role);

  // Define an array of roles that should see the "Dashboard" link
  const allowedRoles = ["ADMIN", "SUPERVISOR", "EMPLOYEE"];
  const allowedRolesOrg = ["ADMIN", "SUPERVISOR", "EMPLOYEE", "ORGAGENT"];

  return (
    <>
      <section className="heading">
        <h1>What do you need help with?</h1>
        <p>Please create a ticket for sales related enquiry</p>
        <p>And login to create detailed ticket</p>
      </section>

      <Link to="/new-ticket" className="btn btn-reverse btn-block">
        <FaQuestionCircle /> Create New Ticket
      </Link>
      {(userRole && allowedRoles.includes(userRole)) && (
      <Link to="/tickets" className="btn btn-reverse btn-block">
        <FaTicketAlt /> View Tickets Assigned To Me
      </Link>
      )}
      {(userRole && allowedRoles.includes(userRole)) && (
      <Link to="/allticket" className="btn btn-reverse btn-block">
        <FaList /> View All Tickets
      </Link>
      )}
      <Link to="/ticketss" className="btn btn-reverse btn-block">
        <FaTicketAlt /> View My Tickets
      </Link>
      {(userRole && allowedRoles.includes(userRole)) && (
      <Link to="/issues" className="btn btn-reverse btn-block">
        <FaBoxTissue /> Issues
      </Link>
      )}
       {(userRole && allowedRolesOrg.includes(userRole)) && (
      <Link to="/organization" className="btn btn-reverse btn-block">
        <FaInfo/> My Organization
      </Link>
      )}

      


    </>
  );
}

export default Home;
*/
