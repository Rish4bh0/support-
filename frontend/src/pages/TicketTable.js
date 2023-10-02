import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
} from '@mui/material';
import styled from 'styled-components';
import { fetchAllUsers } from '../features/auth/authSlice';
import { getAllIssueTypes } from '../features/issues/issueSlice';
import { useDispatch, useSelector } from 'react-redux';

const TicketTableWrapper = styled.div`
  background-color: #f4f4f4;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
`;

const TableHeaderCell = styled.th`
  padding: 10px;
`;

const TableCellStyled = styled.td`
  padding: 10px;
`;

const TicketTable = ({ tickets }) => {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset to the first page when searching
  };

  const dispatch = useDispatch();
  useEffect(() => {
    // Fetch the list of registered users when the component loads
    dispatch(fetchAllUsers());
    // Load the initial issue list when the component mounts
    dispatch(getAllIssueTypes());
  }, [dispatch]);

   // Access user data from the Redux store
   const users = useSelector((state) => state.auth.users);

   // Function to get the user's name based on their ID
   const getUserNameById = (userId) => {
     const user = users.find((user) => user._id === userId);
     return user ? user.name : 'Unknown User';
   };

   // Function to calculate time taken in the format "1 Day 2 Hours"
   const calculateTimeTaken = (createdAt, closedAt) => {
     const startTime = new Date(createdAt);
     const endTime = new Date(closedAt);
     const timeDifference = endTime - startTime;
     const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
     const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
     return `${days} Days`;
   };

  const filteredTickets = tickets
    .filter((ticket) =>
      ticket._id.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <TicketTableWrapper>
      <h2>Recently Closed Tickets</h2>
      <TextField
        label="Search by _id"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearchChange}
        fullWidth
        style={{ marginBottom: '20px' }}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>ID</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Ticket solved by</TableHeaderCell>
              <TableHeaderCell>Created At</TableHeaderCell>
              <TableHeaderCell>Closed At</TableHeaderCell>
              <TableHeaderCell>Time Taken</TableHeaderCell> {/* New column header */}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTickets.map((ticket) => (
              <TableRow key={ticket._id}>
                <TableCellStyled>{ticket._id}</TableCellStyled>
                <TableCellStyled>{ticket.status}</TableCellStyled>
                <TableCellStyled>{getUserNameById(ticket.assignedTo)}</TableCellStyled>
                <TableCellStyled>{new Date(ticket.createdAt).toLocaleString("en-US", options)}</TableCellStyled>
                <TableCellStyled>{new Date(ticket.closedAt).toLocaleString("en-US", options)}</TableCellStyled>
                <TableCellStyled>{calculateTimeTaken(ticket.createdAt, ticket.closedAt)}</TableCellStyled> {/* Calculate and display time taken */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={tickets.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
      />
    </TicketTableWrapper>
  );
};

export default TicketTable;
