import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Label, Line, LineChart, PieChart, Pie, Cell ,AreaChart, Area
} from 'recharts';
import Box from '@mui/material/Box';
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Typography } from '@mui/material';

const valueFormatter = (value) => `${value} tickets`;

const getRandomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`;

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

  const totalTicketsByStatus = uniqueStatusValues.map((status) => ({
    name: status,
    value: transformedData.reduce((acc, row) => acc + (row[status] || 0), 0),
  }));

  return (
    <div style={{ display: 'flex', justifyContent: 'space-around' }} className="flex flex-wrap lg:flex-nowrap justify-center mb-20" >
       <div className='border border-gray-300 rounded-2xl mb-10'>
      <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
        <Typography variant="h6" className='pt-5'>
         Bar Chart
        </Typography>
      </Box>
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
              fill={getRandomColor()} // Unique color for each status
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
              stroke={getRandomColor()} // Unique color for each status
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

      <div className='border border-gray-300 rounded-2xl mb-10'>
      <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
        <Typography variant="h6" className='pt-5'>
          Pie Chart
        </Typography>
      </Box>
      <PieChart width={500} height={300}>
        <Tooltip />
        <Legend />
        <Pie
          dataKey="value"
          nameKey="name"
          data={totalTicketsByStatus}
          cx="50%"
          cy="50%"
          outerRadius={80}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {totalTicketsByStatus.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getRandomColor()} />
          ))}
        </Pie>
      </PieChart>
    </div>
    </div>
  );
};

export default TicketStatusChart;
