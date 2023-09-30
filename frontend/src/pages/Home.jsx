import { FaQuestionCircle, FaTicketAlt, FaHistory, FaList, FaInfo } from "react-icons/fa";
import { Link } from "react-router-dom";


function Home() {

  
  return (
    <>
      <section className="heading">
        <h1>What do you need help with?</h1>
        <p>Please choose from an option below</p>
      </section>

      <Link to="/new-ticket" className="btn btn-reverse btn-block">
        <FaQuestionCircle /> Create New Ticket
      </Link>

      <Link to="/tickets" className="btn btn-reverse btn-block">
        <FaTicketAlt /> View Tickets Assigned To Me
      </Link>
      <Link to="/allticket" className="btn btn-reverse btn-block">
        <FaList /> View All Tickets
      </Link>
      <Link to="/issues" className="btn btn-reverse btn-block">
        <FaInfo /> Issues
      </Link>
      <Link to="/dashboard" className="btn btn-block">
        <FaInfo /> Dashboard
      </Link>
      
    </>
  );
}

export default Home;
