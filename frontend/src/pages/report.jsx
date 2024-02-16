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
import { getAllProject } from "../features/project/projectSlice";
import { Link } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Button from "@mui/material/Button";

const getRandomColor = () =>
  `#${Math.floor(Math.random() * 16777215).toString(16)}`;

const Report = ({ organzationName }) => {
  const dispatch = useDispatch();
  const reports = useSelector((state) => state.tickets.reports);
  const organizations = useSelector(
    (state) => state.organizations.organizations
  );
  const allTickets = useSelector((state) => state.tickets.allTickets);
  const projects = useSelector((state) => state.project.project);
  const organizationMap = {};

  organizations.forEach((organization) => {
    organizationMap[organization._id] = organization.name;
  });

  // State variables for date filtering
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedOffice, setSelectedOffice] = useState("");
  const [selectedPayment, setPayment] = useState("");

  useEffect(() => {
    dispatch(report());
    dispatch(getAllOrganization());
    dispatch(getAllProject());
  }, [dispatch]);

  // Convert the reports object into an array with ticket ID
  const reportArray = Object.entries(reports).map(([ticketId, report]) => ({
    id: ticketId,
    ticketId,
    ...report.ticketID,
    totalSpent: report.totalSpent,
    ...report.ticketDetails.organization,
    ...report.ticketDetails.project,
    ...report.ticketDetails,
  }));
  console.log(reportArray);

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
    const rowDate = new Date(row.closedAt);
    const isDateFiltered =
      !startDate || !endDate || (rowDate >= startDate && rowDate <= endDate);
    const isProjectFiltered =
      !selectedProject || row.projectName === selectedProject;
    const isOfficeFiltered = !selectedOffice || row.name === selectedOffice;
    const isPaymentFiltered =
      !selectedPayment || row.payment === selectedPayment;

    return (
      isDateFiltered &&
      isProjectFiltered &&
      isOfficeFiltered &&
      isPaymentFiltered
    );
  });

  // Calculate the total number of unique product types
  const uniqueProductTypes = [
    ...new Set(allTickets.map((ticket) => ticket.product)),
  ];
  const totalUniqueProducts = uniqueProductTypes.length;

  const options = {
    //  weekday: "long",
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
    { field: "ticketID", headerName: "Ticket ID", flex: 0.5 },
    { field: "name", headerName: "Office", flex: 0.5 },
    /*  { field: "projectName", headerName: "Project", flex: 0.7 }, */
    {
      field: "payment",
      headerName: "Payment Type",
      flex: 0.5,
      renderCell: (params) => (
        <div>
          <span className={`payment payment-${params.value}`}>
            {params.value}
          </span>
        </div>
      ),
    },
    { field: "totalSpent", headerName: "Hours Spent", flex: 0.5 },
    {
      field: "status",
      headerName: "Status",
      flex: 0.5,
      renderCell: (params) => (
        <div>
          <span className={`status status-${params.value}`}>
            {params.value}
          </span>
        </div>
      ),
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 0.6,
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
      flex: 0.6,
      valueGetter: (params) => {
        const formattedTime = new Date(params.row.closedAt).toLocaleString(
          "en-US",
          options
        );
        return formattedTime;
      },
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 0.5,
      renderCell: (params) => (
        <div>
          <Link to={`/ticket/${params.row.id}`}>
            <Button variant="outlined" size="small">
              <VisibilityIcon className="text-blue-500" />
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="mt-4">
      <div className="border border-gray-300 rounded-2xl bg-white w-full">
        <div className="border-b-1 p-4 font-extrabold text-sm flex gap-2">
          <AccessTimeIcon fontSize="small" />
          <div className="font-extrabold">Time spent on support</div>
        </div>
        <div className="p-4">
          <div className="bg-white flex justify-between gap-3 mb-7">
            <div className="w-full">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Start Date
              </label>
              <input
                className="border border-gray-300 rounded py-2 px-3 w-full"
                type="date"
                onChange={(e) => setStartDate(new Date(e.target.value))}
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                End Date
              </label>
              <input
                className="border border-gray-300 rounded py-2 px-3 w-full"
                type="date"
                onChange={(e) => setEndDate(new Date(e.target.value))}
              />
            </div>

            <div className="w-full">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Office Filter
              </label>
              <Select
                value={selectedOffice}
                onChange={(e) => setSelectedOffice(e.target.value)}
                className="border border-gray-300 rounded h-10 w-full"
              >
                <MenuItem value="">Select One</MenuItem>
                {organizations.map((organization) => (
                  <MenuItem key={organization._id} value={organization.name}>
                    {organization.name}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <div className="w-full">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Payment Filter
              </label>
              <Select
                value={selectedPayment}
                onChange={(e) => setPayment(e.target.value)}
                className="border border-gray-300 rounded h-10 w-full"
              >
                <MenuItem value="">Select One</MenuItem>
                <MenuItem value="Paid">Paid</MenuItem>
                <MenuItem value="PaidAmc">Paid AMC</MenuItem>
                <MenuItem value="FreeSupport">Free support</MenuItem>
                <MenuItem value="FreeSupportPeriodUnderAMC">
                  Free support period under AMC
                </MenuItem>
                <MenuItem value="SupportContract">Support contract</MenuItem>
              </Select>
            </div>
          </div>
          <div>
            <div className="timespent">
              <DataGrid
                rows={filteredReportArray}
                columns={columns}
                pageSize={5}
                checkboxSelection
                onSelectionModelChange={(newSelection) => {}}
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
                  Total Hours Spent on {selectedOffice || "All"} department
                  support:
                </Typography>
                <Typography variant="subtitle1">
                  {formatTimeInHHMMSS(totalSpentSum)}
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
