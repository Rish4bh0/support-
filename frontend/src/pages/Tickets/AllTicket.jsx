import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    getTickets,
    reset,
    getAllTickets,
  } from "../../features/tickets/ticketSlice";
  import TicketTable from '../../components/TicketTable'

function AllTickets  ()  {
    const { allTickets, isLoading } = useSelector((state) => state.tickets)
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user)

    useEffect(() => {
        dispatch(getAllTickets());
        dispatch(getTickets());
        return () => {
          dispatch(reset());
        };
      }, [dispatch, reset]);

     
      const title = 'All Tickets'
  const greetingMessages = `Hello ${user.name}! Here are all the tickets thus far.`
  
  // Sorting tickets by date in descending order
  const sortedTickets = [...allTickets].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  
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

export default AllTickets;