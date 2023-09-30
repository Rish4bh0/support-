import React, { useState } from 'react';
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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset to the first page when searching
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
              <TableHeaderCell>Closed At</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTickets.map((ticket) => (
              <TableRow key={ticket._id}>
                <TableCellStyled>{ticket._id}</TableCellStyled>
                <TableCellStyled>{ticket.status}</TableCellStyled>
                <TableCellStyled>{ticket.closedAt}</TableCellStyled>
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
