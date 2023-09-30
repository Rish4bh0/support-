import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";
import { getTickets, reset, getAllTickets } from "../features/tickets/ticketSlice";
import TicketItem from "../components/TicketItem";
import { fetchAllUsers } from "../features/auth/authSlice";


function Tickets() {
  const { tickets, isLoading } = useSelector((state) => state.tickets);
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("new");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // You can adjust this number as needed

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAllTickets());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getTickets());

    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  if (isLoading) return <Spinner />;

  const newTickets = tickets.filter((ticket) => ticket.status === "new");
  const openTickets = tickets.filter((ticket) => ticket.status === "open");
  const closedTickets = tickets.filter((ticket) => ticket.status === "close");

  const filteredTickets =
    activeTab === "new" ? newTickets : activeTab === "open" ? openTickets : closedTickets;

  // Paginate the filtered tickets
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTickets = filteredTickets.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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
          className={`btn btn-reverse btn-back ${activeTab === "closed" ? "active" : ""}`}
          onClick={() => setActiveTab("closed")}
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
          <div></div>
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

export default Tickets;
