import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    getTickets,
    reset,
    getAllTickets,
    getTicketss,
  } from "../../features/tickets/ticketSlice";
  import TicketTable from '../../components/TicketTable'
import { getAllIssueTypes } from '../../features/issues/issueSlice';
import Spinner from '../../components/Spinner';

function MyTickets  ()  {
    const { ticketss } = useSelector((state) => state.tickets)
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user)
    useEffect(() => {
      // Simulate 2-second loading delay
      const loadingTimer = setTimeout(() => {
          setIsLoading(false); // Set loading to false after 2 seconds
      }, 2000);

      // Fetch tickets and reset on unmount
      dispatch(getAllTickets());
      dispatch(getTicketss());
      dispatch(getAllIssueTypes())
      return () => {
          clearTimeout(loadingTimer); // Clear timeout on unmount
          dispatch(reset());
      };
  }, [dispatch]); 

     
      const title = 'My Tickets'
  const greetingMessages = `Hello ${user.name}! Below are all the tickets that you have created.`
  
  // Sorting tickets by date in descending order
  const sortedTickets = [...ticketss].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  
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

export default MyTickets;