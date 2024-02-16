import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";
import { reset, getAllTickets } from "../features/tickets/ticketSlice";
import TicketItem from "../components/TicketItem";
import { fetchAllUsers } from "../features/auth/authSlice";
import { getAllIssueTypes } from "../features/issues/issueSlice";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { getAllProject } from "../features/project/projectSlice";

function ORGTICKET() {
  const { allTickets, isLoading } = useSelector((state) => state.tickets);
  const dispatch = useDispatch();
  const userRole = useSelector((state) => state.auth.user.role);
  const userOrganization = useSelector((state) => state.auth.user.organization); 
  const [activeTab, setActiveTab] = useState("new");
  const [currentPage, setCurrentPage] = useState({
    new: 1,
    open: 1,
    review: 1,
    close: 1,
  });
  const [selectedStatus, setSelectedStatus] = useState("all");
  const itemsPerPage = 4;
  const maxPageButtons = 5;

  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(getAllIssueTypes());
    dispatch(getAllProject());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAllTickets());

    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  if (isLoading) return <Spinner />;

  const newTickets = allTickets.filter((ticket) => ticket.status === "new");
  const openTickets = allTickets.filter((ticket) => ticket.status === "open");
  const draftTickets = allTickets.filter((ticket) => ticket.status === "draft");
  const closedTickets = allTickets.filter((ticket) => ticket.status === "close");
  const reviewTickets = allTickets.filter((ticket) => ticket.status === "review");


  const allTicketss = [...allTickets];
  const filteredTickets =
    selectedStatus === "all"
      ? allTicketss
      : selectedStatus === "new"
      ? newTickets
      : selectedStatus === "draft"
      ? draftTickets
      : selectedStatus === "open"
      ? openTickets
      : selectedStatus === "review"
      ? reviewTickets
      : closedTickets;
  // Filter tickets based on the user's organization ID
  const ticketsForUserOrganization = filteredTickets.filter((ticket) => {
    return ticket.organization === userOrganization;
  });
  const allowedRolesor = ["ADMIN", "SUPERVISOR", "EMPLOYEE"];
  const org = ["ORGAGENT", "USER"];
  const startIndex = (currentPage[activeTab] - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const sortedTickets = [...ticketsForUserOrganization].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const paginatedTickets = sortedTickets.slice(startIndex, endIndex);
  const totalPages = Math.ceil(ticketsForUserOrganization.length / itemsPerPage);
  const handlePageChange = (page, status) => {
    setCurrentPage({
      ...currentPage,
      [status]: page,
    });
  };

  const handleNextPage = () => {
    if (currentPage[activeTab] < totalPages) {
      setCurrentPage({
        ...currentPage,
        [activeTab]: currentPage[activeTab] + 1,
      });
    }
  };

  const handlePrevPage = () => {
    if (currentPage[activeTab] > 1) {
      setCurrentPage({
        ...currentPage,
        [activeTab]: currentPage[activeTab] - 1,
      });
    }
  };

  // Generate an array of page numbers to display
  const pageButtons = [];
  for (let i = 1; i <= totalPages; i++) {
    pageButtons.push(
      <button
        key={i}
        className={`btn btn-reverse btn-back ${currentPage[activeTab] === i ? "active" : ""}`}
        onClick={() => handlePageChange(i, activeTab)}
      >
        {i}
      </button>
    );
  }


  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage({
      ...currentPage,
      [tab]: 1, // Reset the page to 1 for the selected status
    });
  };


  const handleStatusChange = (status) => {
    setActiveTab(status);
    setSelectedStatus(status);
    setCurrentPage({
      ...currentPage,
      [status]: 1,
    });
  };

  const statusOptions = ["all", "draft", "new", "open", "review", "close"];

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
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
          <label htmlFor="status-dropdown" className="mr-2">Status:</label>
          <select
            id="status-dropdown"
            className="px-2 py-1 border border-gray-300 rounded"
            value={selectedStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status === "all" ? "All Tickets" : `${status.charAt(0).toUpperCase()}${status.slice(1)} Tickets`}
              </option>
            ))}
          </select>
        </div>
        </div>
      <div className="tickets">
      <div className="ticket-headings">
          <div >Ticket ID</div>
          {userRole && org.includes(userRole) && <div>Title</div>}
          <div>Date</div>
          {userRole && allowedRolesor.includes(userRole) && (
            <div>Assigned To</div>
          )}
          {userRole && allowedRolesor.includes(userRole) && <div>Priority</div>}
          <div>Issue Type</div>
          <div>Status</div>
          {userRole && allowedRolesor.includes(userRole) && <div>Office</div>}
          <div>Actions</div>
        </div>
        {filteredTickets.length === 0 ? (
          <div className="mt-28 mb-28">No tickets available</div>
        
        ): null }
        {paginatedTickets.map((ticket) => (
          <TicketItem key={ticket._id} ticket={ticket} />
        ))}
      </div>
      <div className="pagination-row">
        <div className="pagination-buttons">
          <button
            className="btn btn-reverse btn-back"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            <FaArrowLeft />
          </button>
          <div className="page-buttons-row">
            {pageButtons.slice(
              Math.max(0, currentPage[activeTab] - Math.floor(maxPageButtons / 2)),
              currentPage[activeTab] + Math.floor(maxPageButtons / 2)
            )}
          </div>
          <button
            className="btn btn-reverse btn-back"
            onClick={handleNextPage}
            disabled={currentPage[activeTab] === totalPages}
          >
            <FaArrowRight />
          </button>
        </div>
      </div>
      
    </>
  );
}

export default ORGTICKET;
