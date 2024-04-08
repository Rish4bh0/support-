import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    getTickets,
    reset,
    getAllTickets,
  } from "../../features/tickets/ticketSlice";
  import TicketTable from '../../components/TicketTable'
import Spinner from '../../components/Spinner';
import { getAllIssueTypes } from '../../features/issues/issueSlice';


function OFFICETICKET  ()  {
    const { allTickets } = useSelector((state) => state.tickets)
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();
    const userOrganization = useSelector((state) => state.auth.user.organization); 
    const user = useSelector((state) => state.auth.user)

    useEffect(() => {
      // Simulate 2-second loading delay
      const loadingTimer = setTimeout(() => {
          setIsLoading(false); // Set loading to false after 2 seconds
      }, 2000);

      // Fetch tickets and reset on unmount
      dispatch(getAllTickets());
        dispatch(getTickets());
        dispatch(getAllIssueTypes());
      return () => {
          clearTimeout(loadingTimer); // Clear timeout on unmount
          dispatch(reset());
      };
  }, [dispatch]); 
    

     

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
        {isLoading ? (
                <Spinner /> // Display spinner while loading
            ) : (
          <TicketTable
        tickets={sortedTickets}
        isLoading={isLoading}
        greetingMessage={greetingMessages}
        title={title}
      />
            )}
    </div>
  )
}

export default OFFICETICKET