import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";
import {
  getTicketss,
  reset,
  getAllTickets,
} from "../features/tickets/ticketSlice";
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
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const itemsPerPage = rowsPerPage;
  const maxPageButtons = 5;
  const userRole = useSelector((state) => state.auth.user?.role);
  const allowedRolesor = ["ADMIN", "SUPERVISOR", "EMPLOYEE"];
  const org = ["ORGAGENT", "USER"];
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

  // Apply date range filtering
  const filteredByDateTickets = filteredTickets.filter((ticket) => {
    if (startDate && new Date(ticket.createdAt) < startDate) return false;
    if (endDate && new Date(ticket.createdAt) > endDate) return false;
    return true;
  });

  // Use filteredByDateTickets for pagination
  const startIndex = (currentPage[activeTab] - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const sortedTickets = [...filteredByDateTickets].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  const paginatedTickets = sortedTickets.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredByDateTickets.length / itemsPerPage);

  // Event handler for changing the page
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
      <div className="bg-white flex justify-between gap-3 mb-7">
        <div className="w-full">
          <label
            htmlFor="status-dropdown"
            className="block text-gray-700 text-sm font-semibold mb-2"
          >
            Status:
          </label>
          <select
            id="status-dropdown"
            className="border border-gray-300 rounded py-2 px-3 w-full"
            value={activeTab}
            onChange={(e) => handleStatusChange(e.target.value)}
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
        <div className="w-full">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Start Date:
          </label>
          <input
            className="border border-gray-300 rounded py-2 px-3 w-full"
            type="date"
            onChange={(e) => setStartDate(new Date(e.target.value))}
          />
        </div>
        <div className="w-full">
          <label className="block text-gray-700 text-sm font-semibold mb-2 mr-2">
            End Date:
          </label>
          <input
            className="border border-gray-300 rounded py-2 px-3 w-full"
            type="date"
            onChange={(e) => setEndDate(new Date(e.target.value))}
          />
        </div>
        <div className="w-full">
          <label className="block text-gray-700 text-sm font-semibold mb-2 mr-2">
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

      <div className="tickets">
        <div className="ticket-headings">
          <div>Ticket ID</div>
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
            disabled={currentPage[selectedStatus] === 1}
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
    </>
  );
}

export default Ticketss;
