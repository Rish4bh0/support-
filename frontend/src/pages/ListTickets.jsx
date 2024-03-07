import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";
import { reset, getAllTickets } from "../features/tickets/ticketSlice";
import TicketItem from "../components/TicketItem";
import { fetchAllUsers } from "../features/auth/authSlice";
import { getAllIssueTypes } from "../features/issues/issueSlice";
import { getAllOrganization } from "../features/organization/organizationSlice";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { getAllProject } from "../features/project/projectSlice";
import { Typography } from "@mui/material";

function ListTickets() {
  const { allTickets, isLoading } = useSelector((state) => state.tickets);
  const dispatch = useDispatch();
  const userRole = useSelector((state) => state.auth.user.role);
  const [activeTab, setActiveTab] = useState("all"); // Updated initial tab to "all"
  const [currentPage, setCurrentPage] = useState({
    all: 1,
    new: 1,
    open: 1,
    review: 1,
    close: 1,
  });
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [rowsPerPage, setRowsPerPage] = useState(3);
  const maxPageButtons = 5;

  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(getAllIssueTypes());
    dispatch(getAllOrganization());
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
  const closedTickets = allTickets.filter(
    (ticket) => ticket.status === "close"
  );
  const reviewTickets = allTickets.filter(
    (ticket) => ticket.status === "review"
  );

  // Filter tickets based on active tab and date range
  const filteredTickets = allTickets.filter((ticket) => {
    if (activeTab !== "all" && ticket.status !== activeTab) return false;
    if (startDate && new Date(ticket.createdAt) < startDate) return false;
    if (endDate && new Date(ticket.createdAt) > endDate) return false;
    return true;
  });

  // Paginate the filtered tickets
  const startIndex = (currentPage[activeTab] - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const sortedTickets = [...filteredTickets].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  const paginatedTickets = sortedTickets.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredTickets.length / rowsPerPage);

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
        className={`btn btn-reverse btn-back ${
          currentPage[activeTab] === i ? "active" : ""
        }`}
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

  // Check if the user has one of the allowed roles
  if (!["ADMIN", "SUPERVISOR", "EMPLOYEE"].includes(userRole)) {
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
      <div className="card bg-white rounded-lg border mb-4">
        <div className="card-header p-4 border-b-1 pb-3">
          <Typography variant="h6">Select</Typography>
        </div>
        <div className="card-body p-4 flex gap-4">
          <div className="form-group">
            <label
              htmlFor="status-dropdown"
              className="block text-sm font-semibold mb-2"
            >
              Status
            </label>
            <select
              id="status-dropdown"
              className="border border-gray-300 rounded py-2 px-3 w-full"
              value={activeTab}
              onChange={(e) => handleTabChange(e.target.value)}
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status === "all"
                    ? "All Tickets"
                    : `${status.charAt(0).toUpperCase()}${status.slice(
                        1
                      )} Tickets`}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="block text-sm font-semibold mb-2">
              Start Date
            </label>
            <input
              className="border border-gray-300 rounded py-2 px-3 w-full"
              type="date"
              onChange={(e) => setStartDate(new Date(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label className="block text-sm font-semibold mb-2 mr-2">
              End Date
            </label>
            <input
              className="border border-gray-300 rounded py-2 px-3 w-full"
              type="date"
              onChange={(e) => setEndDate(new Date(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label className="block text-sm font-semibold mb-2 mr-2">
              Rows Per Page:
            </label>
            <input
              className="border border-gray-300 rounded py-2 px-3 w-full"
              type="number"
              min="1"
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(parseInt(e.target.value))}
            />
          </div>
        </div>
      </div>
      <div className="card bg-white rounded-lg border">
        <div className="card-header p-4 border-b-1 pb-3">
          <Typography variant="h6">Select</Typography>
        </div>
        <div className="card-body p-4">
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
            ) : null}

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
                  Math.max(
                    0,
                    currentPage[activeTab] - Math.floor(maxPageButtons / 2)
                  ),
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
        </div>
      </div>
    </>
  );
}

export default ListTickets;
