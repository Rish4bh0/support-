import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    getTickets,
    reset,
    getAllTickets,
  } from "../../features/tickets/ticketSlice";
  import TicketTable from '../../components/TicketTable'

function OFFICETICKET  ()  {
    const { allTickets, isLoading } = useSelector((state) => state.tickets)
    const dispatch = useDispatch();
    const userOrganization = useSelector((state) => state.auth.user.organization); 
    const user = useSelector((state) => state.auth.user)
    useEffect(() => {
        dispatch(getAllTickets());
        dispatch(getTickets());
    
        return () => {
          dispatch(reset());
        };
      }, [dispatch, reset]);

     

  const greetingMessages = `Hello ${user.name}! Below are all the tickets for your organization.`
  const title = `Office Tickets`

  const allTicketss = [...allTickets];
  // Filter tickets based on the user's organization ID
  const ticketsForUserOrganization = allTicketss.filter((ticket) => {
    return ticket.organization === userOrganization;
  });
  // Sorting tickets by date in descending order
  const sortedTickets = [...ticketsForUserOrganization].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  
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

export default OFFICETICKET