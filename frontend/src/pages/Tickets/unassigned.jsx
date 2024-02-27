import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../components/Spinner";

import { reset, getAllTickets } from "../../features/tickets/ticketSlice";
import { fetchAllUsers } from "../../features/auth/authSlice";
import { getAllIssueTypes } from "../../features/issues/issueSlice";
import { getAllOrganization } from "../../features/organization/organizationSlice";
import { getAllProject } from "../../features/project/projectSlice";
import { DataGrid } from "@mui/x-data-grid";
import { makeStyles } from "@mui/styles";
import { Link } from "react-router-dom";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { darken, lighten, styled } from "@mui/material/styles";
import Alert from "@mui/material/Alert";

const useStyles = makeStyles({
  highPriorityy: {
    backgroundColor: "#ff0000",
    color: "#fff",
  },
  lowPriorityy: {
    backgroundColor: "#00ff00",
    color: "#000",
  },
  openStatusy: {
    backgroundColor: "#ff0000",
    color: "#fff",
  },
  closedStatusy: {
    backgroundColor: "#00ff00",
    color: "#000",
  },
});

function UnassignedTickets() {
  const { allTickets, isLoading } = useSelector((state) => state.tickets);
  const organizations = useSelector(
    (state) => state.organizations.organizations
  );
  const user = useSelector((state) => state.auth.user);
  const projects = useSelector((state) => state.project.project);
  const issues = useSelector((state) => state.issueTypes.issueTypes);
  const dispatch = useDispatch();
  const userRole = useSelector((state) => state.auth.user.role);
  const [activeTab, setActiveTab] = useState("unassigned");
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const greetingMessage = `Hello ${user.name}! Below are all the unassigned tickets.`;
  const classes = useStyles();
  const options = {
    //  weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    //  hour: "2-digit",
    // minute: "2-digit",
  };

  const getBackgroundColor = (color, mode) =>
    mode === "dark" ? darken(color, 0.7) : lighten(color, 0.7);

  const getHoverBackgroundColor = (color, mode) =>
    mode === "dark" ? darken(color, 0.6) : lighten(color, 0.6);

  const getSelectedBackgroundColor = (color, mode) =>
    mode === "dark" ? darken(color, 0.5) : lighten(color, 0.5);

  const getSelectedHoverBackgroundColor = (color, mode) =>
    mode === "dark" ? darken(color, 0.4) : lighten(color, 0.4);

  const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    "& .super-app-theme--open": {
      backgroundColor: getBackgroundColor(
        theme.palette.info.main,
        theme.palette.mode
      ),
      "&:hover": {
        backgroundColor: getHoverBackgroundColor(
          theme.palette.info.main,
          theme.palette.mode
        ),
      },
      "&.Mui-selected": {
        backgroundColor: getSelectedBackgroundColor(
          theme.palette.info.main,
          theme.palette.mode
        ),
        "&:hover": {
          backgroundColor: getSelectedHoverBackgroundColor(
            theme.palette.info.main,
            theme.palette.mode
          ),
        },
      },
    },
    "& .super-app-theme--new": {
      backgroundColor: getBackgroundColor(
        theme.palette.success.main,
        theme.palette.mode
      ),
      "&:hover": {
        backgroundColor: getHoverBackgroundColor(
          theme.palette.success.main,
          theme.palette.mode
        ),
      },
      "&.Mui-selected": {
        backgroundColor: getSelectedBackgroundColor(
          theme.palette.success.main,
          theme.palette.mode
        ),
        "&:hover": {
          backgroundColor: getSelectedHoverBackgroundColor(
            theme.palette.success.main,
            theme.palette.mode
          ),
        },
      },
    },
    "& .super-app-theme--review": {
      backgroundColor: getBackgroundColor(
        theme.palette.warning.main,
        theme.palette.mode
      ),
      "&:hover": {
        backgroundColor: getHoverBackgroundColor(
          theme.palette.warning.main,
          theme.palette.mode
        ),
      },
      "&.Mui-selected": {
        backgroundColor: getSelectedBackgroundColor(
          theme.palette.warning.main,
          theme.palette.mode
        ),
        "&:hover": {
          backgroundColor: getSelectedHoverBackgroundColor(
            theme.palette.warning.main,
            theme.palette.mode
          ),
        },
      },
    },
    "& .super-app-theme--close": {
      backgroundColor: getBackgroundColor(
        theme.palette.error.main,
        theme.palette.mode
      ),
      "&:hover": {
        backgroundColor: getHoverBackgroundColor(
          theme.palette.error.main,
          theme.palette.mode
        ),
      },
      "&.Mui-selected": {
        backgroundColor: getSelectedBackgroundColor(
          theme.palette.error.main,
          theme.palette.mode
        ),
        "&:hover": {
          backgroundColor: getSelectedHoverBackgroundColor(
            theme.palette.error.main,
            theme.palette.mode
          ),
        },
      },
    },
  }));

  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(getAllIssueTypes());
    dispatch(getAllOrganization());
    dispatch(getAllProject());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAllTickets());

    return () => {
      dispatch(reset());
    };
  }, [dispatch]);
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage({
      ...currentPage,
      [tab]: 1, // Reset the page to 1 for the selected status
    });
  };

  if (isLoading) return <Spinner />;

  const issueMap = {};
  issues.forEach((issue) => {
    issueMap[issue._id] = issue.name;
  });

  const projectMap = {};
  projects.forEach((project) => {
    projectMap[project._id] = project.projectName;
  });

  const organizationMap = {};
  organizations.forEach((organization) => {
    organizationMap[organization._id] = organization.name;
  });

  const filteredTickets = allTickets.filter((ticket) => {
    if (activeTab === "unassigned") return !ticket.assignedTo;
    return false;
  });

  const filteredTicketss = filteredTickets.filter((ticket) => {
    if (startDate && new Date(ticket.createdAt) < startDate) return false;
    if (endDate && new Date(ticket.createdAt) > endDate) return false;
    return true;
  });

  const sortedTickets = [...filteredTicketss].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const rows = sortedTickets.map((ticket) => ({
    ticketid: ticket._id,
    id: ticket.ticketID,
    createdAt: ticket.createdAt,
    project: projectMap[ticket.project]
      ? projectMap[ticket.project]
      : "Unknown",
    assignedTo: ticket.assignedTo ? ticket.assignedTo : "Unassigned",
    priority: ticket.priority,
    issueType: issueMap[ticket.issueType]
      ? issueMap[ticket.issueType]
      : "Unassigned",
    status: ticket.status,
    organization: organizationMap[ticket.organization]
      ? organizationMap[ticket.organization]
      : "Unassigned",
  }));

  const columns = [
    { field: "id", headerName: "Ticket ID", flex: 1 },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1.1,
      valueGetter: (params) => {
        const formattedTime = new Date(params.row.createdAt).toLocaleString(
          "en-US",
          options
        );
        return formattedTime;
      },
    },

    { field: "assignedTo", headerName: "Assigned To", flex: 1 },
    {
      field: "priority",
      headerName: "Priority",
      flex: 1,
      renderCell: (params) => (
        <div>
          <span className={`priority priority-${params.value}`}>
            {params.value}
          </span>
        </div>
      ),
    },

    {
      field: "issueType",
      headerName: "Issue Type",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
        <div>
          <span className={`status status-${params.value}`}>
            {params.value}
          </span>
        </div>
      ),
    },

    { field: "organization", headerName: "Office", flex: 1 },
    {
      field: "actions",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => (
        <div>
          <Link to={`/ticket/${params.row.ticketid}/update`}>
            <button className="group">
              <ModeEditIcon className="text-blue-500 group-hover:text-blue-700 mr-8" />
            </button>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="mt-4">
      <div className="border border-gray-300 rounded-2xl bg-white w-full mb-4">
        <div className="border-b-1 p-4 font-extrabold text-sm flex gap-2">
          <div className="font-extrabold">Unassigned</div>
        </div>
        <div className="p-4">
          <div className="bg-white flex gap-3">
            <div className="w-48">
              <label className="block text-sm font-semibold mb-2">
                Start Date:
              </label>
              <input
                className="border border-gray-300 rounded py-2 px-3 w-full"
                type="date"
                onChange={(e) => setStartDate(new Date(e.target.value))}
              />
            </div>
            <div className="w-48">
              <label className="block text-sm font-semibold mb-2 mr-2">
                End Date:
              </label>
              <input
                className="border border-gray-300 rounded py-2 px-3 w-full"
                type="date"
                onChange={(e) => setEndDate(new Date(e.target.value))}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="border border-gray-300 rounded-2xl bg-white w-full">
        <div className="border-b-1 p-4 font-extrabold text-sm flex justify-between items-center">
          <div className="font-extrabold">Tickets</div>
        </div>
        <div className="p-4">
          <StyledDataGrid
            getRowClassName={(params) =>
              `super-app-theme--${params.row.status}`
            }
            rows={rows}
            columns={columns}
            initialState={{
              ...rows.initialState,
              pagination: { paginationModel: { pageSize: 5 } },
            }}
            pageSizeOptions={[5, 10, 25]}
            page={currentPage}
            onPageChange={(newPage) => setCurrentPage(newPage)}
            disableSelectionOnClick
          />
        </div>
      </div>
    </div>
  );
}

export default UnassignedTickets;
