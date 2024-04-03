import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllTickets, getTickets, reset } from "../../features/tickets/ticketSlice";
import TicketTable from '../../components/TicketTable';
import Spinner from '../../components/Spinner'; // Assuming you have a Spinner component
import { getAllIssueTypes } from '../../features/issues/issueSlice';

function AllTickets() {
    const { allTickets } = useSelector((state) => state.tickets);
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const [isLoading, setIsLoading] = useState(true); // Track loading state

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
    }, [dispatch]); // Removed reset from dependencies array

    const title = 'All Tickets';
    const greetingMessage = `Hello ${user.name}! Here are all the tickets thus far.`;

    // Sorting tickets by date in descending order
    const sortedTickets = [...allTickets].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return (
        <div>
            {isLoading ? (
                <Spinner /> // Display spinner while loading
            ) : (
                <TicketTable
                    tickets={sortedTickets}
                    isLoading={isLoading}
                    greetingMessage={greetingMessage}
                    title={title}
                />
            )}
        </div>
    );
}

export default AllTickets;
