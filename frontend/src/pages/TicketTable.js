import React from 'react';
import styled from 'styled-components';

const TicketTableWrapper = styled.div`
  background-color: #f4f4f4;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const TableHeader = styled.thead`
  background-color: #333;
  color: #fff;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f2f2f2;
  }
`;

const TableHeaderCell = styled.th`
  padding: 10px;
`;

const TableCell = styled.td`
  padding: 10px;
`;

const TicketTable = ({ tickets }) => {
  return (
    <TicketTableWrapper>
      <h2>Recently Closed Tickets</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>ID</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>Closed At</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <tbody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id}>
              <TableCell>{ticket._id}</TableCell>
              <TableCell>{ticket.status}</TableCell>
              <TableCell>{ticket.closedAt}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </TicketTableWrapper>
  );
};

export default TicketTable;
