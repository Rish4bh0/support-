import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";
import { reset, getAllTickets } from "../features/tickets/ticketSlice";
import TicketItem from "../components/TicketItem";
import { fetchAllUsers } from "../features/auth/authSlice";
import { getAllIssueTypes } from "../features/issues/issueSlice";

function ORGTICKET() {
  const { allTickets, isLoading } = useSelector((state) => state.tickets);
  const dispatch = useDispatch();
  const userRole = useSelector((state) => state.auth.user.role);
  const userOrganization = useSelector((state) => state.auth.user.organization); 
  const [activeTab, setActiveTab] = useState("new");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(getAllIssueTypes());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAllTickets());

    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  if (isLoading) return <Spinner />;

  const filteredTickets = allTickets.filter((ticket) => {
    if (activeTab === "new") return ticket.status === "new";
    if (activeTab === "open") return ticket.status === "open";
    if (activeTab === "review") return ticket.status === "review";
    if (activeTab === "close") return ticket.status === "close";

    return false;
  });

  
  

  // Filter tickets based on the user's organization ID
  const ticketsForUserOrganization = filteredTickets.filter((ticket) => {
    return ticket.organization === userOrganization;
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTickets = ticketsForUserOrganization.slice(startIndex, endIndex);
  const totalPages = Math.ceil(ticketsForUserOrganization.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  // Check if the user has one of the allowed roles
  if (!["ADMIN", "SUPERVISOR", "EMPLOYEE", "ORGAGENT"].includes(userRole)) {
    // Handle unauthorized access, e.g., redirect or show an error message
    return (
      <div>
        <h1>Unauthorized Access</h1>
        <p>You do not have permission to access this page.</p>
      </div>
    );
  }

  return (
    <>
      <BackButton url="/" />
      <div className="tab-buttons">
        <button
          className={`btn btn-reverse btn-back ${activeTab === "new" ? "active" : ""}`}
          onClick={() => setActiveTab("new")}
        >
          New Tickets
        </button>
        <button
          className={`btn btn-reverse btn-back ${activeTab === "open" ? "active" : ""}`}
          onClick={() => setActiveTab("open")}
        >
          Open Tickets
        </button>
        <button
          className={`btn btn-reverse btn-back ${activeTab === "review" ? "active" : ""}`}
          onClick={() => setActiveTab("review")}
        >
          Tickets on review
        </button>
        <button
          className={`btn btn-reverse btn-back ${activeTab === "close" ? "active" : ""}`}
          onClick={() => setActiveTab("close")}
        >
          Closed Tickets
        </button>
      </div>
      <div className="tickets">
        <div className="ticket-headings">
          <div>Date</div>
          <div>Product</div>
          <div>Assigned To</div>
          <div>Priority</div>
          <div>Issue Type</div>
          <div>Status</div>
          <div>Organization</div>
          <div>Actions</div>
        </div>
        {paginatedTickets.map((ticket) => (
          <TicketItem key={ticket._id} ticket={ticket} />
        ))}
      </div>
      <div className="tab-buttons">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`btn btn-reverse btn-back ${currentPage === index + 1 ? "active" : ""}`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </>
  );
}

export default ORGTICKET;
