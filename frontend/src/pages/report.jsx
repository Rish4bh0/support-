/*
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { report } from "../features/tickets/ticketSlice";
import { getAllOrganization } from '../features/organization/organizationSlice';

const Report = () => {
  const dispatch = useDispatch();
  const reports = useSelector((state) => state.tickets.reports);
  const organizations = useSelector((state) => state.organizations.organizations);
  const organizationMap = {};
  organizations.forEach((organization) => {
    organizationMap[organization._id] = organization.name;
  });

  // State variables for date filtering
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    dispatch(report());
    dispatch(getAllOrganization());
  }, [dispatch]);

  // Convert the reports object into an array with ticket ID
  const reportArray = Object.entries(reports).map(([ticketId, report]) => ({
    id: ticketId,
    ticketId,
    totalSpent: report.totalSpent,
    ...report.ticketDetails,
  }));

  // Filter data based on the selected date range
  const filteredReportArray = reportArray.filter((row) => {
    if (startDate && endDate) {
      const rowDate = new Date(row.closedAt);
      return rowDate >= startDate && rowDate <= endDate;
    }
    return true;
  });

  // Custom filter operator for the "Organization" column
const customOrganizationFilterOperator = {
    filter: (items, filter, column) => {
      const filterValue = filter.value?.toString().toLowerCase() || ''; // Ensure filterValue is a string
      return items.filter((item) => {
        const organizationName = String(organizationMap[item[column.field]]).toLowerCase(); // Ensure organizationName is a string
        return organizationName.includes(filterValue);
      });
    },
  };
  

  const columns = [
    { field: 'ticketId', headerName: 'Ticket ID', flex: 1 },
    {
      field: "organization",
      headerName: "Organization",
      width: 200,
      filterOperators: [customOrganizationFilterOperator],
      renderCell: (params) => (
        organizationMap[params.value] || "Unassigned"
      )
    },
    { field: 'totalSpent', headerName: 'Hours Spent', flex: 1 },
    { field: 'createdAt', headerName: 'Created At', flex: 2 },
    { field: 'closedAt', headerName: 'Closed At', flex: 2 },
  ];

  return (
    <div>
      <div className="flex justify-end items-center mb-4">
        <div className="bg-white p-4 rounded shadow-md flex space-x-4">
          <div>
            <label className="block text-gray-700">Start Date</label>
            <input
              className="border border-gray-300 rounded w-40 py-2 px-3"
              type="date"
              onChange={(e) => setStartDate(new Date(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-gray-700">End Date</label>
            <input
              className="border border-gray-300 rounded w-40 py-2 px-3"
              type="date"
              onChange={(e) => setEndDate(new Date(e.target.value))}
            />
          </div>
        </div>
      </div>

      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={filteredReportArray}
          columns={columns}
          pageSize={5}
          getRowId={(row) => row.id}
          components={{ Toolbar: GridToolbar }} // Optional: Add a toolbar for additional functionalities
        />
      </div>
    </div>
  );
};

export default Report;
*/
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import { report } from "../features/tickets/ticketSlice";
import { getAllOrganization } from "../features/organization/organizationSlice";
import { GridToolbar } from "@mui/x-data-grid";
import Typography from "@mui/material/Typography";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const Report = () => {
  const dispatch = useDispatch();
  const reports = useSelector((state) => state.tickets.reports);
  const organizations = useSelector(
    (state) => state.organizations.organizations
  );
  const allTickets = useSelector((state) => state.tickets.allTickets);

  const organizationMap = {};
  organizations.forEach((organization) => {
    organizationMap[organization._id] = organization.name;
  });

  // State variables for date filtering
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedPayment, setPayment] = useState("");
  // State variable for name search
  const [nameSearch, setNameSearch] = useState("");

  useEffect(() => {
    dispatch(report());
    dispatch(getAllOrganization());
  }, [dispatch]);

  // Convert the reports object into an array with ticket ID
  const reportArray = Object.entries(reports).map(([ticketId, report]) => ({
    id: ticketId,
    ticketId,
    totalSpent: report.totalSpent,
    ...report.ticketDetails.organization,
    ...report.ticketDetails,
  }));
  function formatTimeInHHMMSS(totalHours) {
    const hours = Math.floor(totalHours);
    const minutes = Math.floor((totalHours * 60) % 60);
    const seconds = Math.floor((totalHours * 3600) % 60);

    const formattedTime = `${String(hours).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    return formattedTime;
  }

  const filteredReportArray = reportArray.filter((row) => {
    const rowDate = new Date(row.closedAt); // Assuming createdAt is a date field
    const isDateFiltered =
      !startDate || !endDate || (rowDate >= startDate && rowDate <= endDate);
    const isNameFiltered =
      !nameSearch || row.name.toLowerCase().includes(nameSearch.toLowerCase());
    const isProductFiltered =
      !selectedProduct || row.product === selectedProduct; // Add this line
      const isPaymentFiltered =
      !selectedPayment || row.payment === selectedPayment; // Add this line

    return isDateFiltered && isNameFiltered && isProductFiltered && isPaymentFiltered; // Update the return statement
  });

  // Calculate the total number of unique product types
const uniqueProductTypes = [...new Set(allTickets.map((ticket) => ticket.product))];
const totalUniqueProducts = uniqueProductTypes.length;

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    //  hour: "2-digit",
    // minute: "2-digit",
  };

  // Calculate the sum of totalSpent in the filtered data
  const totalSpentSum = filteredReportArray.reduce(
    (total, row) => total + row.totalSpent,
    0
  );

  const columns = [
    { field: "ticketId", headerName: "Ticket ID", flex: 0.7 },
    { field: "name", headerName: "Organization", flex: 0.7 },
    { field: "product", headerName: "Product", flex: 1 },
    { field: "payment", headerName: "Payment", flex: 1},
    { field: "totalSpent", headerName: "Hours Spent", flex: 1 },
    { field: "status", headerName: "Status", flex: 0.5 },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1.5,
      valueGetter: (params) => {
        const formattedTime = new Date(params.row.createdAt).toLocaleString(
          "en-US",
          options
        );
        return formattedTime;
      },
    },
    {
      field: "closedAt",
      headerName: "Closed At",
      flex: 1.5,
      valueGetter: (params) => {
        const formattedTime = new Date(params.row.closedAt).toLocaleString(
          "en-US",
          options
        );
        return formattedTime;
      },
    },
    
  ];

  return (
    <div>
      <section className="flex items-center justify-center ">
        <div>
       
          <Typography variant="h4" component="h1" gutterBottom>
          <AccessTimeIcon fontSize="large" className="mr-3 mb-1"/>
            Time spent on support
          </Typography>
        </div>
      </section>
      <div className="flex justify-end items-center mb-4">
        <div className="bg-white p-4 rounded shadow-md flex space-x-4">
          <div>
            <label className="block text-gray-700">Start Date</label>
            <input
              className="border border-gray-300 rounded w-40 py-2 px-3"
              type="date"
              onChange={(e) => setStartDate(new Date(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-gray-700">End Date</label>
            <input
              className="border border-gray-300 rounded w-40 py-2 px-3"
              type="date"
              onChange={(e) => setEndDate(new Date(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-gray-700">Organization Search</label>
            <input
              className="border border-gray-300 rounded w-40 py-2 px-3"
              type="text"
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700">Product Filter</label>
            <Select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="border border-gray-300 rounded w-40 h-10"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Ecommerce">Ecommerce</MenuItem>
              <MenuItem value="Employee management system">
                Employee management system
              </MenuItem>
              <MenuItem value="HR management system">
                HR management system
              </MenuItem>
              <MenuItem value="CMS">CMS</MenuItem>
            </Select>
          </div>
          <div>
            <label className="block text-gray-700">Payment Filter</label>
            <Select
              value={selectedPayment}
              onChange={(e) => setPayment(e.target.value)}
              className="border border-gray-300 rounded w-40 h-10"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Free support">Free support</MenuItem>
              <MenuItem value="Paid">
              Paid
              </MenuItem>
              <MenuItem value="Free support">
              Free support
              </MenuItem>
              <MenuItem value="Free support period under AMC">Free support period under AMC</MenuItem>
              <MenuItem value="Support contract">Support contract</MenuItem>
            </Select>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={filteredReportArray}
            columns={columns}
            pageSize={5}
            getRowId={(row) => row.id}
            slots={{
              toolbar: GridToolbar,
            }}
            //checkboxSelection
          />
        </div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <AccessTimeIcon fontSize="small" />
            <Typography variant="subtitle1" fontWeight="bold">
              Total Hours Spent on {nameSearch || "All"} organizations support:
            </Typography>
            <Typography variant="subtitle1">
              {formatTimeInHHMMSS(totalSpentSum)}
            </Typography>
          </div>
          <div className="flex-1"></div>
          
        </div>

      </div>
    </div>
  );
};

export default Report;

/*
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import { report } from "../features/tickets/ticketSlice";
import { getAllOrganization } from "../features/organization/organizationSlice";
import { GridToolbar } from "@mui/x-data-grid";
import Typography from "@mui/material/Typography";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const Report = () => {
  const dispatch = useDispatch();
  const reports = useSelector((state) => state.tickets.reports);
  const organizations = useSelector(
    (state) => state.organizations.organizations
  );
  const organizationMap = {};
  organizations.forEach((organization) => {
    organizationMap[organization._id] = organization.name;
  });

  // State variables for date filtering
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState("");
  // State variable for name search
  const [nameSearch, setNameSearch] = useState("");

  useEffect(() => {
    dispatch(report());
    dispatch(getAllOrganization());
  }, [dispatch]);

  // Convert the reports object into an array with ticket ID
  const reportArray = Object.entries(reports).map(([ticketId, report]) => ({
    id: ticketId,
    ticketId,
    totalSpent: report.totalSpent,
    ...report.ticketDetails.organization,
    ...report.ticketDetails,
  }));
  function formatTimeInHHMMSS(totalHours) {
    const hours = Math.floor(totalHours);
    const minutes = Math.floor((totalHours * 60) % 60);
    const seconds = Math.floor((totalHours * 3600) % 60);

    const formattedTime = `${String(hours).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    return formattedTime;
  }

  const filteredReportArray = reportArray.filter((row) => {
    const rowDate = new Date(row.closedAt); // Assuming createdAt is a date field
    const isDateFiltered =
      !startDate || !endDate || (rowDate >= startDate && rowDate <= endDate);
    const isNameFiltered =
      !nameSearch || row.name.toLowerCase().includes(nameSearch.toLowerCase());
    const isProductFiltered =
      !selectedProduct || row.product === selectedProduct; // Add this line

    return isDateFiltered && isNameFiltered && isProductFiltered; // Update the return statement
  });

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    //  hour: "2-digit",
    // minute: "2-digit",
  };

  // Calculate the sum of totalSpent in the filtered data
  const totalSpentSum = filteredReportArray.reduce(
    (total, row) => total + row.totalSpent,
    0
  );

  const columns = [
    { field: "ticketId", headerName: "Ticket ID", flex: 0.7 },
    { field: "name", headerName: "Organization", flex: 0.7 },
    { field: "contact", headerName: "Organization Contact", flex: 1 },
    { field: "email", headerName: "Organization Email", flex: 1.5 },
    { field: "totalSpent", headerName: "Hours Spent", flex: 1 },
    { field: "status", headerName: "Status", flex: 0.5 },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1.5,
      valueGetter: (params) => {
        const formattedTime = new Date(params.row.createdAt).toLocaleString(
          "en-US",
          options
        );
        return formattedTime;
      },
    },
    {
      field: "closedAt",
      headerName: "Closed At",
      flex: 1.5,
      valueGetter: (params) => {
        const formattedTime = new Date(params.row.closedAt).toLocaleString(
          "en-US",
          options
        );
        return formattedTime;
      },
    },
    { field: "product", headerName: "Product", flex: 0.5 },
  ];

  return (
    <div>
      <section className="flex items-center justify-center ">
        <div>
          <Typography variant="h4" component="h1" gutterBottom>
            Time spent for support
          </Typography>
        </div>
      </section>
      <div className="flex justify-end items-center mb-4">
        <div className="bg-white p-4 rounded shadow-md flex space-x-4">
          <div>
            <label className="block text-gray-700">Start Date</label>
            <input
              className="border border-gray-300 rounded w-40 py-2 px-3"
              type="date"
              onChange={(e) => setStartDate(new Date(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-gray-700">End Date</label>
            <input
              className="border border-gray-300 rounded w-40 py-2 px-3"
              type="date"
              onChange={(e) => setEndDate(new Date(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-gray-700">Organization Search</label>
            <input
              className="border border-gray-300 rounded w-40 py-2 px-3"
              type="text"
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-gray-700">Product Filter</label>
            <Select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="border border-gray-300 rounded w-40 h-10" 
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Ecommerce">Ecommerce</MenuItem>
              <MenuItem value="Employee management system">
                Employee management system
              </MenuItem>
              <MenuItem value="HR management system">
                HR management system
              </MenuItem>
              <MenuItem value="CMS">CMS</MenuItem>
            </Select>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={filteredReportArray}
            columns={columns}
            pageSize={5}
            getRowId={(row) => row.id}
            slots={{
              toolbar: GridToolbar,
            }}
            //checkboxSelection
          />
        </div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <AccessTimeIcon fontSize="small" />
            <Typography variant="subtitle1" fontWeight="bold">
              Total Hours Spent for {nameSearch || "All"} organizations support:
            </Typography>
            <Typography variant="subtitle1">
              {formatTimeInHHMMSS(totalSpentSum)}
            </Typography>
          </div>
          <div className="flex-1"></div>
        </div>
      </div>
    </div>
  );
};

export default Report;
*/
/*
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import { report } from "../features/tickets/ticketSlice";
import { getAllOrganization } from "../features/organization/organizationSlice";
import { GridToolbar } from "@mui/x-data-grid";

const Report = () => {
  const dispatch = useDispatch();
  const reports = useSelector((state) => state.tickets.reports);
  const organizations = useSelector(
    (state) => state.organizations.organizations
  );
  const organizationMap = {};
  organizations.forEach((organization) => {
    organizationMap[organization._id] = organization.name;
  });

  // State variables for date filtering
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    dispatch(report());
    dispatch(getAllOrganization());
  }, [dispatch]);

  // Convert the reports object into an array with ticket ID
  const reportArray = Object.entries(reports).map(([ticketId, report]) => ({
    id: ticketId,
    ticketId,
    totalSpent: report.totalSpent,
    ...report.ticketDetails.organization,
    ...report.ticketDetails,
  }));

  // Filter data based on the selected date range
  const filteredReportArray = reportArray.filter((row) => {
    if (startDate && endDate) {
      const rowDate = new Date(row.closedAt); // Assuming createdAt is a date field
      return rowDate >= startDate && rowDate <= endDate;
    }
    return true;
  });

  const columns = [
    { field: "ticketId", headerName: "Ticket ID", flex: 1.5 },
    { field: "name", headerName: "Organization", flex: 1 },
    { field: "contact", headerName: "Organization Contact", flex: 1 },
    { field: "email", headerName: "Organization Email", flex: 1.5 },
    /*  { 
        field: "organization", 
        headerName: "Organization", 
        width: 200,
        renderCell: (params) => (
          organizationMap[params.value] || "Unassigned"
        )
      },*/
/*
    { field: "totalSpent", headerName: "Hours Spent", flex: 1 },
    { field: "createdAt", headerName: "Created At", flex: 1 },
    { field: "closedAt", headerName: "Closed At", flex: 1 },
  ];
  return (
    <div>
      <div className="flex justify-end items-center mb-4">
        <div className="bg-white p-4 rounded shadow-md flex space-x-4">
          <div>
            <label className="block text-gray-700">Start Date</label>
            <input
              className="border border-gray-300 rounded w-40 py-2 px-3"
              type="date"
              onChange={(e) => setStartDate(new Date(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-gray-700">End Date</label>
            <input
              className="border border-gray-300 rounded w-40 py-2 px-3"
              type="date"
              onChange={(e) => setEndDate(new Date(e.target.value))}
            />
          </div>
        </div>
      </div>

      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={filteredReportArray}
          columns={columns}
          pageSize={5}
          getRowId={(row) => row.id}
          slots={{
            toolbar: GridToolbar,
          }}
          checkboxSelection
        />
      </div>
    </div>
  );
};

export default Report;
*/
/*
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DataGrid } from "@mui/x-data-grid";
import { report } from "../features/tickets/ticketSlice";
import { getAllOrganization } from '../features/organization/organizationSlice';

const Report = () => {
  const dispatch = useDispatch();
  const reports = useSelector((state) => state.tickets.reports);
  const organizations = useSelector((state) => state.organizations.organizations);
  const organizationMap = {};
  organizations.forEach((organization) => {
    organizationMap[organization._id] = organization.name;
  });
  
  useEffect(() => {
    dispatch(report());
    dispatch(getAllOrganization());
  }, [dispatch]);

  // Convert the reports object into an array with ticket ID
  const reportArray = Object.entries(reports).map(([ticketId, report]) => ({
    id: ticketId, // Use ticketId as the unique identifier
    ticketId,
    totalSpent: report.totalSpent,
    ...report.ticketDetails, // Include all ticket details
  }));

  const columns = [
    { field: 'ticketId', headerName: 'Ticket ID', flex: 1 },
    { 
        field: "organization", 
        headerName: "Organization", 
        width: 200,
        renderCell: (params) => (
          organizationMap[params.value] || "Unassigned"
        )
      },
    { field: 'totalSpent', headerName: 'Hours Spent', flex: 1 },
    { field: 'createdAt', headerName: 'Created At', flex: 2 },
    { field: 'closedAt', headerName: 'Closed At', flex: 2 },
    
  ];
  

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={reportArray}
        columns={columns}
        pageSize={5}
        getRowId={(row) => row.id} // Specify the unique identifier
      />
    </div>
  );
}

export default Report;
*/
