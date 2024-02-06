import React, { useEffect, useState } from "react";
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
  Box,
} from "@mui/material";
import styled from "styled-components";
import { fetchAllUsers } from "../features/auth/authSlice";
import { getAllIssueTypes } from "../features/issues/issueSlice";
import { useDispatch, useSelector } from "react-redux";
import { getAllTickets } from "../features/tickets/ticketSlice";
import { Link } from "react-router-dom";
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; 
import 'react-date-range/dist/theme/default.css';
import { FaCalendar } from "react-icons/fa";
import { FaTimes } from 'react-icons/fa';
import VisibilityIcon from "@mui/icons-material/Visibility";
import { getAllOrganization } from "../features/organization/organizationSlice";


const TicketTableWrapper = styled.div`
  background-color: #f4f4f4;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  width: 100%; 
`;

const TableHeaderCell = styled.th`
  padding: 10px;
  font-size: 13px; 
`;

const TableCellStyled = styled.td`
  padding: 10px;
  font-size: 12px; 
`;

const DebouncedTextField = ({ label, value, onChange }) => {
  const [searchTerm, setSearchTerm] = useState(value);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      onChange(searchTerm);
    }, 300);

    return () => {
      clearTimeout(debounceTimeout);
    };
  }, [searchTerm, onChange]);

  return (
    <TextField
      label={label}
      variant="outlined"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      fullWidth
      style={{ marginRight: "10px" }}
    />
  );
};

const TicketTable = ({ tickets }) => {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [clientNameSearchTerm, setClientNameSearchTerm] = useState("");
  const [organizationSearchTerm, setOrganizationSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [isDateRangePickerOpen, setDateRangePickerOpen] = useState(false);
  const organizations = useSelector((state) => state.organizations.organizations);
  const organizationMap = {};

  // Create a mapping of organization IDs to their names
  organizations.forEach((organization) => {
    organizationMap[organization._id] = organization.name;
  });

  const toggleDateRangePicker = () => {
    setDateRangePickerOpen(!isDateRangePickerOpen);
  };
  
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setPage(0);
  };

  const handleClientNameSearchChange = (value) => {
    setClientNameSearchTerm(value);
    setPage(0);
  };

  const handleOrganizationSearchChange = (value) => {
    setOrganizationSearchTerm(value);
    setPage(0);
  };

  const handleDateRangeChange = (ranges) => {
    setDateRange([ranges.selection.startDate, ranges.selection.endDate]);
    setPage(0);
  };

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(getAllIssueTypes());
    dispatch(getAllTickets());
    dispatch(getAllOrganization());
  }, [dispatch]);

  const users = useSelector((state) => state.auth.users);

  const getUserNameById = (userId) => {
    const user = users.find((user) => user._id === userId);
    return user ? user.name : "Unknown User";
  };

  const calculateTimeTaken = (createdAt, closedAt) => {
    const startTime = new Date(createdAt);
    const endTime = new Date(closedAt);
    const timeDifference = endTime - startTime;

    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );

    if (days > 0 && hours > 0) {
      return `${days} Days ${hours} Hours`;
    } else if (days > 0) {
      return `${days} Days`;
    } else if (hours > 0) {
      return `${hours} Hours`;
    } else {
      return "Less than an hour";
    }
  };

  const filteredTickets = tickets
  
    .filter((ticket) =>
      ticket._id.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((ticket) =>
      ticket.customerName
        .toLowerCase()
        .includes(clientNameSearchTerm.toLowerCase())
    )
    
    .filter((ticket) => {
      if (dateRange[0] && dateRange[1]) {
        const ticketDate = new Date(ticket.closedAt);
        return (
          ticketDate >= dateRange[0] && ticketDate <= dateRange[1]
        );
      }
      return true;
    })
    
    .filter((ticket) =>
      ticket.organization
        ? organizationMap[ticket.organization]
            .toLowerCase()
            .includes(organizationSearchTerm.toLowerCase())
        : true
    );

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const startIdx = page * rowsPerPage;
  const endIdx = startIdx + rowsPerPage;
  const displayedTickets = filteredTickets.slice(startIdx, endIdx);

  return (
    <TicketTableWrapper>
      <h2>Recently Closed Tickets</h2>
      <Box display="flex" alignItems="center" marginBottom="20px">
        <DebouncedTextField
          label="Search by _id"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <DebouncedTextField
          label="Search by Client's Name"
          value={clientNameSearchTerm}
          onChange={handleClientNameSearchChange}
        />
        <DebouncedTextField
          label="Search by Organization"
          value={organizationSearchTerm}
          onChange={handleOrganizationSearchChange}
        />
      </Box>
      {!isDateRangePickerOpen && (
        <button className="btn btn-reverse btn-block" onClick={toggleDateRangePicker}>
          <FaCalendar /> Open Date Picker
        </button>
      )}
      {isDateRangePickerOpen && (
        <div className="date-range-picker-container">
          <DateRangePicker
            onChange={handleDateRangeChange}
            moveRangeOnFirstSelection={false}
            ranges={[
              {
                startDate: dateRange[0],
                endDate: dateRange[1],
                key: "selection",
              },
            ]}
            showSelectionPreview={true}
            direction="horizontal"
          />
          <button className="close-button" onClick={toggleDateRangePicker}>
            <FaTimes />
          </button>
        </div>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>ID</TableHeaderCell>
              <TableHeaderCell>Clients Name</TableHeaderCell>
              <TableHeaderCell>Office</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Ticket solved by</TableHeaderCell>
              <TableHeaderCell>Hours spent</TableHeaderCell>
              <TableHeaderCell>Created At</TableHeaderCell>
              <TableHeaderCell>Closed At</TableHeaderCell>
              <TableHeaderCell>Ticket open duration</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedTickets.map((ticket) => (
              <TableRow key={ticket._id}>
                <TableCellStyled>{ticket.ticketID}</TableCellStyled>
                <TableCellStyled>
                  {ticket.customerName ? ticket.customerName : "Unassigned"}
                </TableCellStyled>
                <TableCellStyled>
                  {ticket.organization
                    ? organizationMap[ticket.organization]
                    : "Unassigned"}
                </TableCellStyled>
                <TableCellStyled>{ticket.status}</TableCellStyled>
                <TableCellStyled>
                  {getUserNameById(ticket.assignedTo)}
                </TableCellStyled>
                <TableCellStyled>
                  {formatTime(ticket.timeSpent)}
                </TableCellStyled>
                <TableCellStyled>
                  {new Date(ticket.createdAt).toLocaleString("en-US", options)}
                </TableCellStyled>
                <TableCellStyled>
                  {new Date(ticket.closedAt).toLocaleString("en-US", options)}
                </TableCellStyled>
                <TableCellStyled>
                  {calculateTimeTaken(ticket.createdAt, ticket.closedAt)}
                </TableCellStyled>
                <TableCellStyled>
                  <Link to={`/ticket/${ticket._id}`}>
                    <VisibilityIcon />
                  </Link>{" "}
                </TableCellStyled>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={filteredTickets.length}
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


/*
import React, { useEffect, useState } from "react";
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
  MenuItem,
} from "@mui/material";
import styled from "styled-components";
import { fetchAllUsers } from "../features/auth/authSlice";
import { getAllIssueTypes } from "../features/issues/issueSlice";
import { useDispatch, useSelector } from "react-redux";
import { getAllTickets } from "../features/tickets/ticketSlice";
import { Link } from "react-router-dom";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [clientNameSearchTerm, setClientNameSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
 
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset to the first page when searching
  };

  const handleClientNameSearchChange = (event) => {
    setClientNameSearchTerm(event.target.value);
    setPage(0); // Reset to the first page when searching
  };

  const dispatch = useDispatch();
  useEffect(() => {
    // Fetch the list of registered users when the component loads
    dispatch(fetchAllUsers());
    // Load the initial issue list when the component mounts
    dispatch(getAllIssueTypes());
    dispatch(getAllTickets());
  }, [dispatch]);

  // Access user data from the Redux store
  const users = useSelector((state) => state.auth.users);

  // Function to get the user's name based on their ID
  const getUserNameById = (userId) => {
    const user = users.find((user) => user._id === userId);
    return user ? user.name : "Unknown User";
  };

  const calculateTimeTaken = (createdAt, closedAt) => {
    const startTime = new Date(createdAt);
    const endTime = new Date(closedAt);
    const timeDifference = endTime - startTime;
   

    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );

    if (days > 0 && hours > 0) {
      return `${days} Days ${hours} Hours`;
    } else if (days > 0) {
      return `${days} Days`;
    } else if (hours > 0) {
      return `${hours} Hours`;
    } else {
      return "Less than an hour";
    }
  };

  const filteredTickets = tickets
    .filter((ticket) =>
      ticket._id.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((ticket) =>
      ticket.customerName
        .toLowerCase()
        .includes(clientNameSearchTerm.toLowerCase())
    )
    .filter((ticket) => {
      if (selectedMonth && selectedYear) {
        const ticketDate = new Date(ticket.closedAt);
        return (
          ticketDate.getMonth() + 1 === parseInt(selectedMonth) &&
          ticketDate.getFullYear() === parseInt(selectedYear)
        );
      }
      return true; // If no month or year selected, include all tickets
    })
    const formatTime = (seconds) => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = seconds % 60;
    
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };
    
    
    const startIdx = page * rowsPerPage;
    const endIdx = startIdx + rowsPerPage;
    const displayedTickets = filteredTickets.slice(startIdx, endIdx);
  return (
    <TicketTableWrapper>
      <h2>Recently Closed Tickets</h2>
      <div style={{ display: "flex", marginBottom: "20px" }}>
        <TextField
          label="Search by _id"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          fullWidth
          style={{ marginRight: "10px" }}
        />
        <TextField
          label="Search by Client's Name"
          variant="outlined"
          value={clientNameSearchTerm}
          onChange={handleClientNameSearchChange}
          fullWidth
          style={{ marginRight: "10px" }}
        />
      </div>
      <TextField
        select
        label="Select Month"
        variant="outlined"
        value={selectedMonth}
        onChange={(event) => setSelectedMonth(event.target.value)}
        fullWidth
        style={{ marginBottom: "20px" }}
      >
        <MenuItem value="">All Months</MenuItem>
        <MenuItem value="01">January</MenuItem>
        <MenuItem value="02">February</MenuItem>
        <MenuItem value="03">March</MenuItem>
        <MenuItem value="04">April</MenuItem>
        <MenuItem value="05">May</MenuItem>
        <MenuItem value="06">June</MenuItem>
        <MenuItem value="07">July</MenuItem>
        <MenuItem value="08">August</MenuItem>
        <MenuItem value="09">September</MenuItem>
        <MenuItem value="10">October</MenuItem>
        <MenuItem value="11">November</MenuItem>
        <MenuItem value="12">December</MenuItem>
      </TextField>

      <TextField
        select
        label="Select Year"
        variant="outlined"
        value={selectedYear}
        onChange={(event) => setSelectedYear(event.target.value)}
        fullWidth
        style={{ marginBottom: "20px" }}
      >
        <MenuItem value="">All Years</MenuItem>
        <MenuItem value="2023">2023</MenuItem>
        <MenuItem value="2022">2022</MenuItem>

      </TextField>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>ID</TableHeaderCell>
              <TableHeaderCell>Clients Name</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Ticket solved by</TableHeaderCell>
              <TableHeaderCell>Hours spent</TableHeaderCell>
              <TableHeaderCell>Created At</TableHeaderCell>
              <TableHeaderCell>Closed At</TableHeaderCell>
              <TableHeaderCell>Ticket open for</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>{" "}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTickets.map((ticket) => (
              <TableRow key={ticket._id}>
                <TableCellStyled>{ticket._id}</TableCellStyled>
                <TableCellStyled>{ticket.customerName}</TableCellStyled>
                <TableCellStyled>{ticket.status}</TableCellStyled>
                <TableCellStyled>
                  {getUserNameById(ticket.assignedTo)}
                </TableCellStyled>
                <TableCellStyled>{formatTime(ticket.timeSpent)}</TableCellStyled>
                <TableCellStyled>
                  {new Date(ticket.createdAt).toLocaleString("en-US", options)}
                </TableCellStyled>
                <TableCellStyled>
                  {new Date(ticket.closedAt).toLocaleString("en-US", options)}
                </TableCellStyled>
                <TableCellStyled>
                  {calculateTimeTaken(ticket.createdAt, ticket.closedAt)}
                </TableCellStyled>{" "}
                <TableCellStyled>
                  <Link to={`/ticket/${ticket._id}`}>View Details</Link>{" "}
                
                </TableCellStyled>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={filteredTickets.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0); // Reset the page when rowsPerPage changes
        }}
      />
    </TicketTableWrapper>
  );
};

export default TicketTable;
*/
/*
import React, { useEffect, useState } from "react";
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
  MenuItem,
} from "@mui/material";
import styled from "styled-components";
import { fetchAllUsers } from "../features/auth/authSlice";
import { getAllIssueTypes } from "../features/issues/issueSlice";
import { useDispatch, useSelector } from "react-redux";
import { getAllTickets } from "../features/tickets/ticketSlice";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

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
    dispatch(getAllTickets());
  }, [dispatch]);

  // Access user data from the Redux store
  const users = useSelector((state) => state.auth.users);

  // Function to get the user's name based on their ID
  const getUserNameById = (userId) => {
    const user = users.find((user) => user._id === userId);
    return user ? user.name : "Unknown User";
  };

  const calculateTimeTaken = (createdAt, closedAt) => {
    const startTime = new Date(createdAt);
    const endTime = new Date(closedAt);
    const timeDifference = endTime - startTime;
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );

    if (days > 0 && hours > 0) {
      return `${days} Days ${hours} Hours`;
    } else if (days > 0) {
      return `${days} Days`;
    } else if (hours > 0) {
      return `${hours} Hours`;
    } else {
      return "Less than an hour";
    }
  };

  const filteredTickets = tickets
    .filter((ticket) =>
      ticket._id.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((ticket) => {
      if (selectedMonth && selectedYear) {
        const ticketDate = new Date(ticket.closedAt);
        return (
          ticketDate.getMonth() + 1 === parseInt(selectedMonth) &&
          ticketDate.getFullYear() === parseInt(selectedYear)
        );
      }
      return true; // If no month or year selected, include all tickets
    })
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
        style={{ marginBottom: "20px" }}
      />
      <TextField
        select
        label="Select Month"
        variant="outlined"
        value={selectedMonth}
        onChange={(event) => setSelectedMonth(event.target.value)}
        fullWidth
        style={{ marginBottom: "20px" }}
      >
        <MenuItem value="">All Months</MenuItem>
        <MenuItem value="01">January</MenuItem>
        <MenuItem value="02">February</MenuItem>
        <MenuItem value="03">March</MenuItem>
        <MenuItem value="04">April</MenuItem>
        <MenuItem value="05">May</MenuItem>
        <MenuItem value="06">June</MenuItem>
        <MenuItem value="07">July</MenuItem>
        <MenuItem value="08">August</MenuItem>
        <MenuItem value="09">September</MenuItem>
        <MenuItem value="10">October</MenuItem>
        <MenuItem value="11">November</MenuItem>
        <MenuItem value="12">December</MenuItem>
      </TextField>

      <TextField
        select
        label="Select Year"
        variant="outlined"
        value={selectedYear}
        onChange={(event) => setSelectedYear(event.target.value)}
        fullWidth
        style={{ marginBottom: "20px" }}
      >
        <MenuItem value="">All Years</MenuItem>
        <MenuItem value="2023">2023</MenuItem>
        <MenuItem value="2022">2022</MenuItem>
     
      </TextField>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>ID</TableHeaderCell>
              <TableHeaderCell>Clients Name</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Ticket solved by</TableHeaderCell>
              <TableHeaderCell>Created At</TableHeaderCell>
              <TableHeaderCell>Closed At</TableHeaderCell>
              <TableHeaderCell>Time Taken</TableHeaderCell>{" "}
           
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTickets.map((ticket) => (
              <TableRow key={ticket._id}>
                <TableCellStyled>{ticket._id}</TableCellStyled>
                <TableCellStyled>{ticket.customerName}</TableCellStyled>
                <TableCellStyled>{ticket.status}</TableCellStyled>
                <TableCellStyled>
                  {getUserNameById(ticket.assignedTo)}
                </TableCellStyled>
                <TableCellStyled>
                  {new Date(ticket.createdAt).toLocaleString("en-US", options)}
                </TableCellStyled>
                <TableCellStyled>
                  {new Date(ticket.closedAt).toLocaleString("en-US", options)}
                </TableCellStyled>
                <TableCellStyled>
                  {calculateTimeTaken(ticket.createdAt, ticket.closedAt)}
                </TableCellStyled>{" "}
              
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

/*
import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import styled from "styled-components";
import { fetchAllUsers } from "../features/auth/authSlice";
import { getAllIssueTypes } from "../features/issues/issueSlice";
import { useDispatch, useSelector } from "react-redux";
import { getAllTickets } from "../features/tickets/ticketSlice";

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
  const [searchTerm, setSearchTerm] = useState("");

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
    dispatch(getAllTickets());
  }, [dispatch]);

  // Access user data from the Redux store
  const users = useSelector((state) => state.auth.users);

  // Function to get the user's name based on their ID
  const getUserNameById = (userId) => {
    const user = users.find((user) => user._id === userId);
    return user ? user.name : "Unknown User";
  };

  const calculateTimeTaken = (createdAt, closedAt) => {
    const startTime = new Date(createdAt);
    const endTime = new Date(closedAt);
    const timeDifference = endTime - startTime;
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );

    if (days > 0 && hours > 0) {
      return `${days} Days ${hours} Hours`;
    } else if (days > 0) {
      return `${days} Days`;
    } else if (hours > 0) {
      return `${hours} Hours`;
    } else {
      return "Less than an hour";
    }
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
        style={{ marginBottom: "20px" }}
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
              <TableHeaderCell>Time Taken</TableHeaderCell>{" "}
              
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTickets.map((ticket) => (
              <TableRow key={ticket._id}>
                <TableCellStyled>{ticket._id}</TableCellStyled>
                <TableCellStyled>{ticket.status}</TableCellStyled>
                <TableCellStyled>
                  {getUserNameById(ticket.assignedTo)}
                </TableCellStyled>
                <TableCellStyled>
                  {new Date(ticket.createdAt).toLocaleString("en-US", options)}
                </TableCellStyled>
                <TableCellStyled>
                  {new Date(ticket.closedAt).toLocaleString("en-US", options)}
                </TableCellStyled>
                <TableCellStyled>
                  {calculateTimeTaken(ticket.createdAt, ticket.closedAt)}
                </TableCellStyled>{" "}
                
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
*/
