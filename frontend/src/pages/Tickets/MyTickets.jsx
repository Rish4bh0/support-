import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    getTickets,
    reset,
    getAllTickets,
    getTicketss,
  } from "../../features/tickets/ticketSlice";
  import TicketTable from '../../components/TicketTable'

function MyTickets  ()  {
    const { ticketss, isLoading } = useSelector((state) => state.tickets)
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user)
    useEffect(() => {
        dispatch(getAllTickets());
        dispatch(getTicketss());
        return () => {
          dispatch(reset());
        };
      }, [dispatch, reset]);

     
      const title = 'My Tickets'
  const greetingMessages = `Hello ${user.name}! Below are all the tickets that you have created.`
  
  // Sorting tickets by date in descending order
  const sortedTickets = [...ticketss].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  
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

export default MyTickets;