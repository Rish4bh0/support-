import { FaQuestionCircle, FaTicketAlt, FaHistory, FaList, FaInfo } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Home() {
  // Access the user's role from Redux state
  const userRole = useSelector((state) => state.auth.user?.role);

  // Define an array of roles that should see the "Dashboard" link
  const allowedRoles = ["ADMIN", "SUPERVISOR", "EMPLOYEE"];

  return (
    <>
      <section className="heading">
        <h1>What do you need help with?</h1>
        <p>Please choose from an option below</p>
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
        <FaInfo /> Issues
      </Link>
      )}
       {(userRole && allowedRoles.includes(userRole)) && (
      <Link to="/organization" className="btn btn-reverse btn-block">
        <FaInfo /> My Organization
      </Link>
      )}
       {(userRole && allowedRoles.includes(userRole)) && (
      <Link to="/organizations" className="btn btn-reverse btn-block">
        <FaInfo /> All Organization
      </Link>
      )}
      {(userRole && allowedRoles.includes(userRole)) && (
      <Link to="/createuser" className="btn btn-reverse btn-block">
        <FaInfo /> User Management
      </Link>
      )}
      <Link to="/forget" className="btn btn-reverse btn-block">
        <FaInfo /> Forget Password
      </Link>
      {(userRole && allowedRoles.includes(userRole)) && (
        <Link to="/dashboard" className="btn btn-block">
          <FaInfo /> Dashboard
        </Link>
      )}

    </>
  );
}

export default Home;
