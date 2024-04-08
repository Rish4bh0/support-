import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    getTickets,
    reset,
    getAllTickets,
  } from "../../features/tickets/ticketSlice";
  import TicketTable from '../../components/TicketTable'
import { getAllIssueTypes } from '../../features/issues/issueSlice';
import Spinner from '../../components/Spinner';

function CC  ()  {
    const { allTickets } = useSelector((state) => state.tickets)
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
      // Simulate 2-second loading delay
      const loadingTimer = setTimeout(() => {
          setIsLoading(false); // Set loading to false after 2 seconds
      }, 2000);

      // Fetch tickets and reset on unmount
      dispatch(getAllTickets());
      dispatch(getTickets());
      dispatch(getAllIssueTypes())
      return () => {
          clearTimeout(loadingTimer); // Clear timeout on unmount
          dispatch(reset());
      };
  }, [dispatch]); 

      const user = useSelector((state) => state.auth.user)
      const userId = useSelector((state) => state.auth.user._id);
  const greetingMessages = `Hello ${user.name}! Below are all the tickets you have been cc'd on`
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

export default CC;