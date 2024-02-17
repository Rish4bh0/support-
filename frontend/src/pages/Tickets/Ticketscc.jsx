import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    getTickets,
    reset,
    getAllTickets,
  } from "../../features/tickets/ticketSlice";
  import TicketTable from '../../components/TicketTable'

function CC  ()  {
    const { allTickets, isLoading } = useSelector((state) => state.tickets)
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllTickets());
        dispatch(getTickets());
    
        return () => {
          dispatch(reset());
        };
      }, [dispatch, reset]);

     
      const userId = useSelector((state) => state.auth.user._id);
  const greetingMessages = "Hello"
  const title = "CC'd Tickets"
  // Sorting tickets by date in descending order

  const allTicketss = [...allTickets];


  // Filter tickets based on the user's organization ID
  const ticketsForUserCC = allTicketss.filter((ticket) => {
    // Check if the user's ID is in the cc array
    return ticket.cc.includes(userId); // Replace userId with the actual user's ID
  });
  const sortedTickets = [...ticketsForUserCC].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
console.log("yo",sortedTickets)
  
  return (
    <div>
          <TicketTable
        tickets={sortedTickets}
        isLoading={isLoading}
        greetingMessage={greetingMessages}
        title={title}
      />
    </div>
  )
}

export default CC;