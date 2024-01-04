import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Label, Line, LineChart,
} from 'recharts';
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

const valueFormatter = (value) => `${value} tickets`;

const TicketStatusChart = ({ allTicket }) => {
  const transformedData = allTicket.reduce((acc, ticket) => {
    const month = ticket.createdAt.substring(0, 7);
    const status = ticket.status.toLowerCase();

    const existingStatus = acc.find((item) => item.month === month);

    if (existingStatus) {
      existingStatus[status] = (existingStatus[status] || 0) + 1;
    } else {
      const newStatus = { month, [status]: 1 };
      acc.push(newStatus);
    }

    return acc;
  }, []);

  const uniqueStatusValues = Array.from(new Set(allTicket.map((ticket) => ticket.status.toLowerCase())));

  return (
    <div>
      <BarChart
        width={500}
        height={300}
        data={transformedData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />

        {uniqueStatusValues.map((status, index) => (
          <Bar
            key={status}
            dataKey={status}
            stackId="a"
            fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`} // Random color
          >
            <Label
              content={({ value }) => `${value} tickets`}
              position="top"
            />
          </Bar>
        ))}

        {uniqueStatusValues.map((status, index) => (
          <Line
            key={status}
            type="monotone"
            dataKey={status}
            stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`} // Random color
            yAxisId={0}
          />
        ))}
      </BarChart>
{/*
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Month</TableCell>
              {uniqueStatusValues.map((status) => (
                <TableCell key={status}>{status}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {transformedData.map((row) => (
              <TableRow key={row.month}>
                <TableCell>{row.month}</TableCell>
                {uniqueStatusValues.map((status) => (
                  <TableCell key={status}>{row[status] || 0}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      */}
    </div>
  );
};

export default TicketStatusChart;
