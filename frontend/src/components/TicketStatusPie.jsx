import React, { useEffect, useRef, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Label,
  Line,
  LineChart,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ResponsiveContainer,
} from "recharts";
import Box from "@mui/material/Box";
import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
} from "@mui/material";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { FiMousePointer } from "react-icons/fi";

const ROTATION_RANGE = 32.5;
const HALF_ROTATION_RANGE = 32.5 / 2;

const valueFormatter = (value) => `${value} tickets`;

const statusColors = {
  draft: "#fbe032",
  new: "#008000",
  open: "#4682b4",
  review: "#f8a54c",
  close: "#8b0000",
};
const getRandomColor = () =>
  `#${Math.floor(Math.random() * 16777215).toString(16)}`;

const getShortMonth = (fullMonth) => {
  const [year, month] = fullMonth.split("-");
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const shortMonth = monthNames[parseInt(month, 10) - 1];
  return `${year}-${shortMonth}`;
};

const TicketStatusChart = ({ allTicket }) => {
  const ref = useRef(null);
  const ref2 = useRef(null);

  const x = useMotionValue(0);
  const x2 = useMotionValue(0);
  const y = useMotionValue(0);
  const y2 = useMotionValue(0);

  const xSpring = useSpring(x);
  const xSpring2 = useSpring(x2);
  const ySpring = useSpring(y);
  const ySpring2 = useSpring(y2);

  const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`;
  const transform2 = useMotionTemplate`rotateX(${xSpring2}deg) rotateY(${ySpring2}deg)`;

  const handleMouseMove = (e) => {
    if (!ref.current) return [0, 0];

    const rect = ref.current.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const mouseX = (e.clientX - rect.left) * ROTATION_RANGE;
    const mouseY = (e.clientY - rect.top) * ROTATION_RANGE;

    const rX = (mouseY / height - HALF_ROTATION_RANGE) * -1;
    const rY = mouseX / width - HALF_ROTATION_RANGE;

    x.set(rX);
    y.set(rY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };
  const [selectedYear, setSelectedYear] = useState(null);
  const [yearOptions, setYearOptions] = useState([]);

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const options = [];
    for (let i = currentYear - 2; i <= currentYear + 2; i++) {
      options.push(i.toString());
    }
    setYearOptions(options);
  }, []);
  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  // Filter data based on selected year
  const filteredData = selectedYear
    ? allTicket.filter((ticket) => ticket.createdAt.startsWith(selectedYear))
    : allTicket;

  const transformedData = filteredData.reduce((acc, ticket) => {
    const month = ticket.createdAt.substring(0, 7);
    const shortMonth = getShortMonth(month);
    console.log("mon" + shortMonth);
    const status = ticket.status.toLowerCase();

    const existingStatus = acc.find((item) => item.shortMonth === shortMonth);

    if (existingStatus) {
      existingStatus[status] = (existingStatus[status] || 0) + 1;
    } else {
      const newStatus = { shortMonth, [status]: 1 };
      acc.push(newStatus);
    }

    return acc;
  }, []);

  const uniqueStatusValues = Array.from(
    new Set(allTicket.map((ticket) => ticket.status.toLowerCase()))
  );

  const legendOrder = ["draft", "new", "open", "review", "close"];

  const totalTicketsByStatus = legendOrder.map((status) => ({
    name: status,
    value: transformedData.reduce((acc, row) => acc + (row[status] || 0), 0),
  }));
  // Filter out entries with a value of 0
  const filteredTotalTicketsByStatus = totalTicketsByStatus.filter(
    (entry) => entry.value !== 0
  );

  return (
    <>
      <motion.div className="relative h-80 min-h-80 w-full rounded-xl bg-gradient-to-br ">
        <div className="absolute inset-4 grid  rounded-xl bg-white shadow-xl">
          <div className="flex p-4 px-8 py-8 font-extrabold text-sm justify-between ">
            <Box display="flex">Bar Chart</Box>
            <select
              className="h-8 text-xs z-50 rounded-xl shadow-xl"
              value={selectedYear}
              onChange={handleYearChange}
              style={{ border: "none", outline: "none" }}
            >
              <option value="">All Years</option>
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div
            style={{
              transform: "translateZ(75px)",
              transformStyle: "preserve-3d",
            }}
            className="p-4 pt-16 place-content-center absolute inset-4 grid  "
          >
            {transformedData.length === 0 ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <span>No data available</span>
              </div>
            ) : (
              
              <BarChart
                width={450}
                height={220}
                data={transformedData}
                margin={{ top: 20, right: 30, left: 20, bottom: 2 }}
                barCategoryGap={5}
              >
                <XAxis dataKey="shortMonth"
                   stroke="#888888"
                   fontSize={12}
                   tickLine={false}
                   axisLine={false}
                   padding={{ left: 5, right: 5 }}
                   />
                <YAxis 
                  stroke="#888888"
                  fontSize={12}
                 // tickLine={false}
                  //axisLine={false}
                  />
                <Tooltip />
                <Legend />

                {filteredTotalTicketsByStatus.map((status, index) => (
                  <Bar
                    key={status.name}
                    dataKey={status.name}
                    stackId="a"
                    fill={statusColors[status.name]}
                    radius={4}
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
            )}
          </div>
        </div>
      </motion.div>

      {/*
        <div className="border border-gray-300 rounded-2xl bg-white w-full">
          <div className="border-b-1 p-4 font-extrabold text-sm">
            <Box display="flex">Bar Chart</Box>
          </div>
          <div className="p-4">
            <BarChart
              width={450}
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
          </div>
        </div>
        
          <motion.div
      ref={ref2}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        transform,
      }}
      className="relative h-80 min-h-80 w-full rounded-xl bg-gradient-to-br from-yellow-300 to-green-300"
    >
      <div
        style={{
          transform: "translateZ(75px)",
          transformStyle: "preserve-3d",
        }}
        className="absolute inset-4 grid  rounded-xl bg-white shadow-lg"
      >
         <div
           style={{
            transform: "translateZ(75px)",
            transformStyle: "preserve-3d",
          }}
           className=" p-4 px-8 py-8 font-extrabold text-sm">
            <Box display="flex">Pie Chart</Box>
          </div>
          <div 
           style={{
            transform: "translateZ(75px)",
            transformStyle: "preserve-3d",
          }}
          className="p-4 pt-16 place-content-center absolute inset-4 grid  ">
            <PieChart width={450} height={220}>
              <Tooltip />
              <Legend />
              <Pie
                dataKey="value"
                nameKey="name"
                data={filteredTotalTicketsByStatus}
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {filteredTotalTicketsByStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={statusColors[entry.name]} />
                ))}
              </Pie>
            </PieChart>
          </div>
      </div>
    </motion.div>
    */}

      {/*
        <div className="border border-gray-300 rounded-2xl bg-white w-full">
          <div className="border-b-1 p-4 font-extrabold text-sm">
            <Box display="flex">Pie Chart</Box>
          </div>
          <div className="p-4">
            <PieChart width={450} height={250}>
              <Tooltip />
              <Legend />
              <Pie
                dataKey="value"
                nameKey="name"
                data={filteredTotalTicketsByStatus}
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {filteredTotalTicketsByStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={statusColors[entry.name]} />
                ))}
              </Pie>
            </PieChart>
          </div>
        </div>
        */}

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

{
  /*

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

*/
}
