import USAID from "../assets/usaid.jpg";
import Logo1 from "../assets/ministry_of_finance.jpg";
import Logo2 from "../assets/swiss.jpg";
import Logo3 from "../assets/koica.png";
import Logo4 from "../assets/undp.png";
import Logo5 from "../assets/nbi.png";

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
        <container>
          <div className="relative pt-36 ml-auto">
            <div className="lg:w-2/3 text-center mx-auto">
              <h1 className="text-gray-900 dark:text-white font-bold text-2xl md:text-5xl xl:text-6xl">
                NEA customer support{" "}
                
              </h1>
              <p className="mt-8 text-gray-700 dark:text-gray-300">
                Welcome to our cutting-edge ticketing and support system. We are
                dedicated to providing you with top-tier customer service and
                assistance. Our innovative solutions and passionate team are
                here to make your experience as smooth as possible, so you can
                focus on what you do best. 
              </p>
              <div className="mt-16 flex flex-wrap justify-center gap-y-4 gap-x-6">
                <a
                  href="/new-ticket"
                  class="relative flex h-11 w-full items-center justify-center px-6 rounded-full border border-black text-black hover:bg-black hover:text-white hover:border-transparent hover:scale-105 active:duration-75 active:scale-95 dark:border-gray-700 dark:bg-gray-800 sm:w-max before:absolute before:inset-0 before:rounded-full before:border before:border-transparent before:bg-primary/10 before:bg-gradient-to-b before:transition before:duration-300 hover:before:scale-105 active:before:duration-75 active:before:scale-95"
                >
                  <span className="relative text-base font-semibold">
                    Create Ticket
                  </span>
                </a>
                <a
                  href="/login"
                  class="relative flex h-11 w-full items-center justify-center px-6 rounded-full border border-black text-black hover:bg-black hover:text-white hover:border-transparent hover:scale-105 active:duration-75 active:scale-95 dark:border-gray-700 dark:bg-gray-800 sm:w-max before:absolute before:inset-0 before:rounded-full before:border before:border-transparent before:bg-primary/10 before:bg-gradient-to-b before:transition before:duration-300 hover:before:scale-105 active:before:duration-75 active:before:scale-95"
                >
                  <span class="relative text-base font-semibold">Login</span>
                </a>
              </div>
              <div className="hidden py-8 mt-16 border-y border-gray-100 dark:border-gray-800 sm:flex justify-between">
                <div className="text-left">
                  <h6 className="text-lg font-semibold text-gray-700 dark:text-white">
                    Unmatched Reliability
                  </h6>
                  <p className="mt-2 text-gray-500">
                    Count on us for uninterrupted service.
                  </p>
                </div>
                <div className="text-left">
                  <h6 className="text-lg font-semibold text-gray-700 dark:text-white">
                    Exceptional User Experience
                  </h6>
                  <p className="mt-2 text-gray-500">
                    Easy-to-use interface for a seamless experience.
                  </p>
                </div>
                <div className="text-left">
                  <h6 className="text-lg font-semibold text-gray-700 dark:text-white">
                    24/7 Expert Support
                  </h6>
                  <p className="mt-2 text-gray-500">
                    Round-the-clock assistance from our experts.
                  </p>
                </div>
              </div>
            </div>
           
          </div>
        </container>
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
