// Dashboard.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TicketSummaryBox from './TicketSummaryBox.js';
import TicketTable from './TicketTable.js';

import { getTickets } from '../features/tickets/ticketSlice';

import './Dashboard.css'; // Import a CSS file for styling
import BackButton from '../components/BackButton.jsx';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { tickets, isLoading } = useSelector((state) => state.tickets);

  useEffect(() => {
    dispatch(getTickets());
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
