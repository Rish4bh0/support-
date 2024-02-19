import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    getTickets,
    reset,
    getAllTickets,
  } from "../../features/tickets/ticketSlice";
  import TicketTable from '../../components/TicketTable'

function Assigned  ()  {
    const { tickets, isLoading } = useSelector((state) => state.tickets)
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user)

    useEffect(() => {
        dispatch(getAllTickets());
        dispatch(getTickets());
    
        return () => {
          dispatch(reset());
        };
      }, [dispatch, reset]);

     

  const greetingMessages = `Hello ${user.name}! Below are all the tickets assigned to you.`
  const title = 'Assigned Tickets'
  // Sorting tickets by date in descending order
  const sortedTickets = [...tickets].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  
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

export default Assigned