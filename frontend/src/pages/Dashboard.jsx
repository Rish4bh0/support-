

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TicketSummaryBox from "./TicketSummaryBox.js";
import TicketTable from "./TicketTable.js"; // Import the TicketTable component

import {
  getAllTickets,
  getTickets,
  reset,
} from "../features/tickets/ticketSlice";

import "./Dashboard.css";
import BackButton from "../components/BackButton.jsx";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { tickets, allTickets, isLoading } = useSelector(
    (state) => state.tickets
  );
  const [newTicketsCount, setNewTicketsCount] = useState(0);
  const [openTicketsCount, setOpenTicketsCount] = useState(0);
  const [closedTicketsCount, setClosedTicketsCount] = useState(0);
  const [allTicketsCount, setAllTicketsCount] = useState(0);
  const [closedTickets, setClosedTickets] = useState([]); // State to store closed tickets

  useEffect(() => {
    dispatch(getTickets());
  }, [dispatch]);

  const userRole = useSelector((state) => state.auth.user.role); // Retrieve the user's role from Redux state

  useEffect(() => {
    dispatch(getAllTickets()).then((response) => {
      if (response.payload) {
        setAllTicketsCount(response.payload.length);
        setNewTicketsCount(
          response.payload.filter((ticket) => ticket.status === "new").length
        );
        setOpenTicketsCount(
          response.payload.filter((ticket) => ticket.status === "open").length
        );
        setClosedTicketsCount(
          response.payload.filter((ticket) => ticket.status === "close").length
        ); // Fixed status typo
      }
    });

    // Fetch closed tickets and update the state
    // Adjust the API call according to your data structure
    fetchClosedTickets().then((closedTicketsData) => {
      setClosedTickets(closedTicketsData);
    });

    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  // Function to fetch closed tickets (you should adjust this function based on your API)
  // Function to fetch closed tickets (you should adjust this function based on your API)
  const fetchClosedTickets = async () => {
    try {
      const response = await fetch("https://supportdesk-1eot.onrender.com/api/tickets/all");
      const data = await response.json();
      const closedTicketsData = data.filter(
        (ticket) => ticket.status === "close"
      );
      return closedTicketsData;
    } catch (error) {
      console.error("Error fetching closed tickets:", error);
      return [];
    }
  };

  if (!tickets) {
    return <div className="loading">Loading...</div>;
  }

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
      <BackButton url="/" />
      <div className="dashboard">
        <section className="heading">
          <h1>Dashboard</h1>
        </section>

        <div className="summary-boxes">
          <TicketSummaryBox
            className="summary-box"
            title="All Tickets"
            count={allTicketsCount}
          />
          <TicketSummaryBox
            className="summary-box"
            title="New Tickets"
            count={newTicketsCount}
          />
          <TicketSummaryBox
            className="summary-box"
            title="Open Tickets"
            count={openTicketsCount}
          />
          <TicketSummaryBox
            className="summary-box"
            title="Closed Tickets"
            count={closedTicketsCount}
          />
        </div>

      
        <TicketTable tickets={closedTickets} />
      </div>
    </>
  );
};

export default Dashboard;

/*

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TicketSummaryBox from './TicketSummaryBox.js';
import TicketTable from './TicketTable.js';

import { getAllTickets, getTickets, reset } from '../features/tickets/ticketSlice';

import './Dashboard.css'; // Import a CSS file for styling
import BackButton from '../components/BackButton.jsx';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { tickets, allTickets, isLoading } = useSelector((state) => state.tickets);
const [allTicketsCount, setAllTicketsCount] = useState(0); // Initialize the count


  useEffect(() => {
    dispatch(getTickets());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAllTickets()).then((response) => {
      if (response.payload) {
        setAllTicketsCount(response.payload.length);
      }
    });
  
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);
  

  if (!tickets) {
    return <div className="loading">Loading...</div>; // Apply a loading class
  }

  const newTicketsCount = tickets.filter((ticket) => ticket.status === 'new').length;
  const openTicketsCount = tickets.filter((ticket) => ticket.status === 'open').length;
  const closedTicketsCount = tickets.filter((ticket) => ticket.status === 'close').length;

  const recentClosedTickets = tickets.filter((ticket) => ticket.status === 'close');

  return (
  <>
    <BackButton url="/" />
    <div className="dashboard">
      <section className="heading">
      <h1>Dashboard</h1>
      </section>
      
      <div className="summary-boxes">
      <TicketSummaryBox className="summary-box" title="All Tickets" count={allTicketsCount} />

  <TicketSummaryBox className="summary-box" title="New Tickets" count={newTicketsCount} />
  <TicketSummaryBox className="summary-box" title="Open Tickets" count={openTicketsCount} />
  <TicketSummaryBox className="summary-box" title="Closed Tickets" count={closedTicketsCount} />
</div>

<TicketTable className="table" tickets={recentClosedTickets} />

    </div>
    </>
  );
};

export default Dashboard;

*/
