import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";
import { getTicketss, reset, getAllTickets } from "../features/tickets/ticketSlice";
import TicketItem from "../components/TicketItem";
import { fetchAllUsers } from "../features/auth/authSlice";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { getAllIssueTypes } from "../features/issues/issueSlice";
import { getAllOrganization } from "../features/organization/organizationSlice";
import { getAllProject } from "../features/project/projectSlice";

function Ticketss() {
  const { ticketss, isLoading } = useSelector((state) => state.tickets);
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("new");
  const [currentPage, setCurrentPage] = useState({
    all: 1,
    draft: 1,
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
    dispatch(getAllOrganization());
    dispatch(getAllProject());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getTicketss());

    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  if (isLoading) return <Spinner />;

  const newTickets = ticketss.filter((ticket) => ticket.status === "new");
  const draftTickets = ticketss.filter((ticket) => ticket.status === "draft");
  const openTickets = ticketss.filter((ticket) => ticket.status === "open");
  const closedTickets = ticketss.filter((ticket) => ticket.status === "close");
  const reviewTickets = ticketss.filter((ticket) => ticket.status === "review");

  const allTickets = [...ticketss];
  const filteredTickets =
    selectedStatus === "all"
      ? allTickets
      : selectedStatus === "new"
      ? newTickets
      : selectedStatus === "draft"
      ? draftTickets
      : selectedStatus === "open"
      ? openTickets
      : selectedStatus === "review"
      ? reviewTickets
      : closedTickets;

  const startIndex = (currentPage[selectedStatus] - 1) * itemsPerPage;
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
    if (currentPage[selectedStatus] < totalPages) {
      setCurrentPage({
        ...currentPage,
        [selectedStatus]: currentPage[selectedStatus] + 1,
      });
    }
  };

  const handlePrevPage = () => {
    if (currentPage[selectedStatus] > 1) {
      setCurrentPage({
        ...currentPage,
        [selectedStatus]: currentPage[selectedStatus] - 1,
      });
    }
  };

  const pageButtons = [];
  for (let i = 1; i <= totalPages; i++) {
    pageButtons.push(
      <button
        key={i}
        className={`btn btn-reverse btn-back ${currentPage[selectedStatus] === i ? "active" : ""}`}
        onClick={() => handlePageChange(i, selectedStatus)}
      >
        {i}
      </button>
    );
  }

  const handleStatusChange = (status) => {
    setActiveTab(status);
    setSelectedStatus(status);
    setCurrentPage({
      ...currentPage,
      [status]: 1,
    });
  };

  const statusOptions = ["all", "draft", "new", "open", "review", "close"];

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <BackButton url="/" />
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
        <div>Ticket ID</div>
          <div>Date</div>
          <div>Assigned To</div>
          <div>Priority</div>
          <div>Issue Type</div>
          <div>Status</div>
          <div>Office</div>
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
            disabled={currentPage[selectedStatus] === 1}
          >
            <FaArrowLeft />
          </button>
          <div className="page-buttons-row">
            {pageButtons.slice(
              Math.max(0, currentPage[selectedStatus] - Math.floor(maxPageButtons / 2)),
              currentPage[selectedStatus] + Math.floor(maxPageButtons / 2)
            )}
          </div>
          <button
            className="btn btn-reverse btn-back"
            onClick={handleNextPage}
            disabled={currentPage[selectedStatus] === totalPages}
          >
            <FaArrowRight />
          </button>
        </div>
      </div>
    </>
  );
}

export default Ticketss;




/*
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";
import { getTicketss, reset, getAllTickets } from "../features/tickets/ticketSlice";
import TicketItem from "../components/TicketItem";
import { fetchAllUsers } from "../features/auth/authSlice";

// Import icons for "Next" and "Previous" buttons
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { getAllIssueTypes } from "../features/issues/issueSlice";
import { getAllOrganization } from "../features/organization/organizationSlice";

function Ticketss() {
  const { ticketss, isLoading } = useSelector((state) => state.tickets);
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("new");
  const [currentPage, setCurrentPage] = useState({
    new: 1,
    open: 1,
    review: 1,
    close: 1,
  });
  const itemsPerPage = 4; // You can adjust this number as needed
  const maxPageButtons = 5; // Maximum number of page buttons to display


  useEffect(() => {
   
    dispatch(fetchAllUsers());
    dispatch(getAllIssueTypes());
    dispatch(getAllOrganization());
  }, [dispatch]);

  /*
  useEffect(() => {
    dispatch(getAllTickets());
  }, [dispatch]);
*/
/*
  useEffect(() => {
    dispatch(getTicketss());

    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  if (isLoading) return <Spinner />;

  const newTickets = ticketss.filter((ticket) => ticket.status === "new");
  const openTickets = ticketss.filter((ticket) => ticket.status === "open");
  const closedTickets = ticketss.filter((ticket) => ticket.status === "close");
  const reviewTickets = ticketss.filter((ticket) => ticket.status === "review");


  const filteredTickets =
    activeTab === "new" ? newTickets : activeTab === "open" ? openTickets : activeTab === "review" ? reviewTickets : closedTickets;

  // Paginate the filtered tickets
  const startIndex = (currentPage[activeTab] - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const sortedTickets = filteredTickets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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

  return (
    <>
      <BackButton url="/" />
      <div className="tab-buttons">
        <button
          className={`btn btn-reverse btn-back ${activeTab === "new" ? "active" : ""}`}
          onClick={() => handleTabChange("new")}
        >
          New Tickets
        </button>
        <button
          className={`btn btn-reverse btn-back ${activeTab === "open" ? "active" : ""}`}
          onClick={() => handleTabChange("open")}
        >
          Open Tickets
        </button>
        <button
          className={`btn btn-reverse btn-back ${activeTab === "review" ? "active" : ""}`}
          onClick={() => handleTabChange("review")}
        >
          Tickets on review
        </button>
        <button
          className={`btn btn-reverse btn-back ${activeTab === "close" ? "active" : ""}`}
          onClick={() => handleTabChange("close")}
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

export default Ticketss;
*/