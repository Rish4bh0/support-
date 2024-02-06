import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Label, Line, LineChart, PieChart, Pie, Cell ,AreaChart, Area
} from 'recharts';
import Box from '@mui/material/Box';
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Typography } from '@mui/material';

const valueFormatter = (value) => `${value} tickets`;

const statusColors = {
  draft: '#fbe032',
  new: '#008000',
  open: '#4682b4',
  review: '#f8a54c',
  close: '#8b0000',
};
const getRandomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`;

const getShortMonth = (fullMonth) => {
  const [year, month] = fullMonth.split('-');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const shortMonth = monthNames[parseInt(month, 10) - 1];
  return `${year}-${shortMonth}`;
};

const TicketStatusChart = ({ allTicket }) => {
  const transformedData = allTicket.reduce((acc, ticket) => {
    const month = ticket.createdAt.substring(0, 7);
    const shortMonth = getShortMonth(month);
    console.log("mon"+ shortMonth)
    const status = ticket.status.toLowerCase();

    const existingStatus = acc.find((item) => item.shortMonth === shortMonth);

    if (existingStatus) {
      existingStatus[status] = (existingStatus[status] || 0) + 1;
    } else {
      const newStatus = {  shortMonth, [status]: 1 };
      acc.push(newStatus);
    }

    return acc;
  }, []);

  const uniqueStatusValues = Array.from(new Set(allTicket.map((ticket) => ticket.status.toLowerCase())));

  const legendOrder = ["draft", "new", "open", "review", "close"];

  const totalTicketsByStatus = legendOrder.map((status) => ({
    name: status,
    value: transformedData.reduce((acc, row) => acc + (row[status] || 0), 0),
  }));
   // Filter out entries with a value of 0
   const filteredTotalTicketsByStatus = totalTicketsByStatus.filter(entry => entry.value !== 0);

  return (
    <>
    <div  className="flex flex-wrap lg:flex-nowrap justify-around items-center mb-2" >
       <div className='border border-gray-300 rounded-2xl mb-4'>
      <Box display="flex" alignItems="left"  mb={2} marginLeft={5}>
        <Typography variant="h6" className='pt-5'>
         Bar Chart
        </Typography>
      </Box>
      <BarChart
          width={500}
          height={250}
          data={transformedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 2 }}
        >
          <XAxis dataKey="shortMonth" />
          <YAxis />
          <Tooltip />
          <Legend />

          {filteredTotalTicketsByStatus.map((status, index) => (
            <Bar
              key={status.name}
              dataKey={status.name}
              stackId="a"
              fill={statusColors[status.name]} // Unique color for each status
            >
              <Label
                content={({ value }) => `${value} tickets`}
                position="top"
              />
            </Bar>
          ))}

          {filteredTotalTicketsByStatus.map((status, index) => (
            <Line
              key={status.name}
              type="monotone"
              dataKey={status.name}
              stroke={statusColors[status.name]} // Unique color for each status
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

      <div className='border border-gray-300 rounded-2xl mb-2'>
      <Box display="flex" alignItems="left"  mb={2} marginLeft={5}>
        <Typography variant="h6" className='pt-5'>
          Pie Chart
        </Typography>
      </Box>
      
      <PieChart width={500} height={250}>
        <Tooltip />
        <Legend />
        <Pie
          dataKey="value"
          nameKey="name"
          data={filteredTotalTicketsByStatus}
          cx="50%"
          cy="50%"
          outerRadius={80}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {filteredTotalTicketsByStatus.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={statusColors[entry.name]} />
          ))}
        </Pie>
      </PieChart>
    </div>
    </div>
{/*
    <div  className="flex flex-wrap lg:flex-nowrap justify-around items-center mb-4" >
       <div className='border border-gray-300 rounded-2xl mb-10'>
      <Box display="flex" alignItems="left"  mb={2} marginLeft={5}>
        <Typography variant="h6" className='pt-5'>
         Line Chart
        </Typography>
      </Box>
      <LineChart width={500} height={250} data={transformedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
  <XAxis dataKey="shortMonth" />
  <YAxis />
  <Tooltip />
  <Legend />
  {filteredTotalTicketsByStatus.map((status, index) => (
    <Line
      key={status.name}
      type="monotone"
      dataKey={status.name}
      stroke={statusColors[status.name]} // Unique color for each status
      yAxisId={0}
    />
  ))}
</LineChart>


      </div>

      <div className='border border-gray-300 rounded-2xl mb-10'>
      <Box display="flex" alignItems="left"  mb={2} marginLeft={5}>
        <Typography variant="h6" className='pt-5'>
         Area Chart
        </Typography>
      </Box>
      
      <AreaChart width={500} height={250} data={transformedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
  <XAxis dataKey="shortMonth" />
  <YAxis />
  <Tooltip />
  <Legend />
  {filteredTotalTicketsByStatus.map((status, index) => (
    <Area
      key={status.name}
      type="monotone"
      dataKey={status.name}
      stackId="1"
      stroke={statusColors[status.name]} // Unique color for each status
      fill={statusColors[status.name]}
    />
  ))}
</AreaChart>

    </div>
    </div>
  */}
    </>
  );
};

export default TicketStatusChart;



{/*

<LineChart width={500} height={250} data={transformedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
  <XAxis dataKey="shortMonth" />
  <YAxis />
  <Tooltip />
  <Legend />
  {filteredTotalTicketsByStatus.map((status, index) => (
    <Line
      key={status.name}
      type="monotone"
      dataKey={status.name}
      stroke={statusColors[status.name]} // Unique color for each status
      yAxisId={0}
    />
  ))}
</LineChart>


<AreaChart width={500} height={250} data={transformedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
  <XAxis dataKey="shortMonth" />
  <YAxis />
  <Tooltip />
  <Legend />
  {filteredTotalTicketsByStatus.map((status, index) => (
    <Area
      key={status.name}
      type="monotone"
      dataKey={status.name}
      stackId="1"
      stroke={statusColors[status.name]} // Unique color for each status
      fill={statusColors[status.name]}
    />
  ))}
</AreaChart>

*/}