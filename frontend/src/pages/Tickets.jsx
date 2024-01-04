import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";
import { getTickets, reset, getAllTickets } from "../features/tickets/ticketSlice";
import TicketItem from "../components/TicketItem";
import { fetchAllUsers } from "../features/auth/authSlice";
import { getAllIssueTypes } from "../features/issues/issueSlice";
import { getAllOrganization } from "../features/organization/organizationSlice";

// Import icons for "Next" and "Previous" buttons
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

function Tickets() {
  const { tickets, isLoading } = useSelector((state) => state.tickets);
  const dispatch = useDispatch();
  const userRole = useSelector(state => state.auth.user.role);
  const [activeTab, setActiveTab] = useState("all");  // Set initial tab to "all"
  const [currentPage, setCurrentPage] = useState({
    all: 1,
    new: 1,
    open: 1,
    review: 1,
    close: 1,
  });
  const itemsPerPage = 4;
  const maxPageButtons = 5;

  useEffect(() => {
    dispatch(getAllTickets());
    dispatch(getTickets());

    return () => {
      dispatch(reset());
    };
  }, [dispatch, reset]);

  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(getAllIssueTypes());
    dispatch(getAllOrganization());
  }, [dispatch]);

  if (isLoading) return <Spinner />;

  const newTickets = tickets.filter((ticket) => ticket.status === "new");
  const openTickets = tickets.filter((ticket) => ticket.status === "open");
  const closedTickets = tickets.filter((ticket) => ticket.status === "close");
  const reviewTickets = tickets.filter((ticket) => ticket.status === "review");

  const filteredTickets =
    activeTab === "all" ? tickets :
    activeTab === "new" ? newTickets :
    activeTab === "open" ? openTickets :
    activeTab === "review" ? reviewTickets :
    activeTab === "close" ? closedTickets : [];

  // Paginate the filtered tickets
  const startIndex = (currentPage[activeTab] - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const sortedTickets = [...filteredTickets].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const paginatedTickets = sortedTickets.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);

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

  const statusOptions = ["all", "new", "open", "review", "close"];

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <BackButton url="/" />
        <div className="flex items-center">
          <label htmlFor="status-dropdown" className="mr-2">Status:</label>
          <select
            id="status-dropdown"
            className="px-2 py-1 border border-gray-300 rounded"
            value={activeTab}
            onChange={(e) => handleTabChange(e.target.value)}
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status === "all" ? "All Tickets" : `${status.charAt(0).toUpperCase()}${status.slice(1)} Tickets`}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="tab-buttons">
        {statusOptions.map((status) => (
          <button
            key={status}
            className={`btn btn-reverse btn-back ${activeTab === status ? "active" : ""}`}
            onClick={() => handleTabChange(status)}
          >
            {status === "all" ? "All Tickets" : `${status.charAt(0).toUpperCase()}${status.slice(1)} Tickets`}
          </button>
        ))}
      </div>
      <div className="tickets">
        <div className="ticket-headings">
          <div>Date</div>
          <div>Product</div>
          <div>Assigned To</div>
          <div>Priority</div>
          <div>Issue Type</div>
          <div>Status</div>
          <div>Office</div>
          <div>Actions</div>
        </div>
        {paginatedTickets.map((ticket) => (
          <TicketItem key={ticket._id} ticket={ticket} />
        ))}
      </div>
      <div className="pagination-row">
        <div className="pagination-buttons">
          <button
            className="btn btn-reverse btn-back"
            onClick={handlePrevPage}
            disabled={currentPage[activeTab] === 1}
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

export default Tickets;
