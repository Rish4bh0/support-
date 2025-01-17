import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../components/Spinner";
import {
  getTickets,
  reset,
  getAllTickets,
} from "../features/tickets/ticketSlice";
import { fetchAllUsers } from "../features/auth/authSlice";
import { getAllIssueTypes } from "../features/issues/issueSlice";
import { getAllOrganization } from "../features/organization/organizationSlice";
import { getAllProject } from "../features/project/projectSlice";
import { DataGrid } from "@mui/x-data-grid";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { darken, lighten, styled } from "@mui/material/styles";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Link } from "react-router-dom";
import Alert from "@mui/material/Alert";

function Tickets() {
  const { tickets } = useSelector((state) => state.tickets);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("all"); // Set initial tab to "all"
  const [currentPage, setCurrentPage] = useState({
    all: 1,
    new: 1,
    open: 1,
    review: 1,
    close: 1,
  });
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(3);

  const userRole = useSelector((state) => state.auth.user.role);
  const organizations = useSelector(
    (state) => state.organizations.organizations
  );
  const issueTypesData = useSelector((state) => state.issueTypes.issueTypes);
  console.log("1", issueTypesData);
  const issues = issueTypesData.issueTypes || [];
  console.log("2", issues);
  const count = issueTypesData.count || 0;
  console.log("3", count);
  console.log(issues)
  const users = useSelector((state) => state.auth.users);
  const projects = useSelector((state) => state.project.project);
  const projectMap = {};
  const [isLoading, setIsLoading] = useState(true);
  projects.forEach((project) => {
    projectMap[project._id] = project.projectName;
  });
  const issueMap = issues
  ? issues.reduce((map, issue) => {
      map[issue._id] = issue.name;
      return map;
    }, {})
  : {};
  const organizationMap = {};
  organizations.forEach((organization) => {
    organizationMap[organization._id] = organization.name;
  });
  const userMap = {};
  users.forEach((user) => {
    userMap[user._id] = user.name;
  });
  const allowedRolesOrg = ["ADMIN", "SUPERVISOR", "ORGAGENT", "USER"];
  const allowedRoles = ["ADMIN", "SUPERVISOR"];
  const allowedRolesor = ["ADMIN", "SUPERVISOR", "EMPLOYEE"];
  const org = ["ORGAGENT", "USER"];
  

  useEffect(() => {
    dispatch(getAllIssueTypes({ page: 1, pageSize: count }));
  }, [dispatch, count]);


  useEffect(() => {

    // Simulate 2-second loading delay
    const loadingTimer = setTimeout(() => {
      setIsLoading(false); // Set loading to false after 2 seconds
  }, 2000);

    dispatch(fetchAllUsers());
    dispatch(getAllOrganization());
    dispatch(getAllProject());
    return () => {
      clearTimeout(loadingTimer); // Clear timeout on unmount
      dispatch(reset());
  };
  }, [dispatch]);


  useEffect(() => {
    dispatch(getAllTickets());
    dispatch(getTickets());

    return () => {
      dispatch(reset());
    };
  }, [dispatch, reset]);



  // Filter tickets based on active tab and date range
  const filteredTickets = tickets.filter((ticket) => {
    if (activeTab !== "all" && ticket.status !== activeTab) return false;
    if (startDate && new Date(ticket.createdAt) < startDate) return false;
    if (endDate && new Date(ticket.createdAt) > endDate) return false;
    return true;
  });

  const rows = filteredTickets.map((ticket) => ({
    ticketid: ticket._id,
    id: ticket.ticketID,
    createdAt: ticket.createdAt,
    project: projectMap[ticket.project]
      ? projectMap[ticket.project]
      : "Unknown",
    assignedTo: userMap[ticket.assignedTo]
      ? userMap[ticket.assignedTo]
      : "Unassigned",
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
      headerName: "Date",
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
              <ModeEditIcon className="text-green-500 group-hover:text-green-700 mr-8" />
            </button>
          </Link>
          <Link to={`/ticket/${params.row.ticketid}`}>
            <button className="group">
              <VisibilityIcon className="text-blue-500 group-hover:text-blue-700 mr-8" />
            </button>
          </Link>
        </div>
      ),
    },
  ];
  const greetingMessages = filteredTickets.map((ticket) => {
    const assignedUser = userMap[ticket.assignedTo];
    const remainingTickets = rows.length;
    return assignedUser
      ? `Hey there ${assignedUser}! Below are the tickets assigned to you. ${remainingTickets} more 🎫 to go.`
      : null;
  });
  // Paginate the filtered tickets
  const startIndex = (currentPage[activeTab] - 1) * rowsPerPage;
  const totalPages = Math.ceil(filteredTickets.length / rowsPerPage);

  const handlePageChange = (page, status) => {
    setCurrentPage({
      ...currentPage,
      [status]: page,
    });
  };

  // Generate an array of page numbers to display
  const pageButtons = [];
  for (let i = 1; i <= totalPages; i++) {
    pageButtons.push(
      <button
        key={i}
        className={`btn btn-reverse btn-back ${
          currentPage[activeTab] === i ? "active" : ""
        }`}
        onClick={() => handlePageChange(i, activeTab)}
      >
        {i}
      </button>
    );
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage({
      ...currentPage,
      [tab]: 1, // Reset the page to 1 for the selected status
    });
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
  const options = {
    //  weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    //  hour: "2-digit",
    // minute: "2-digit",
  };

  const statusOptions = ["all", "new", "open", "review", "close"];

  return (
    
    <div className="mt-4">
        {isLoading ? (
                <Spinner /> // Display spinner while loading
            ) : (
      <div className="border border-gray-300 rounded-2xl bg-white w-full">
        <div className="border-b-1 p-4 font-extrabold text-sm flex gap-2">
          <div className="font-extrabold">Assigned Tickets</div>
        </div>
        <div className="p-4">
      <div className="bg-white flex justify-end gap-3 mb-7 ">
      <div className="w-full mt-6">
      {greetingMessages.map((greeting, index) => (
      <Alert  className="block text-gray-700 text-sm font-semibold mb-2" severity="info"><p key={index}>{greeting}</p></Alert>
      ))}
      </div>
        <div className="w-48">
          <label
            htmlFor="status-dropdown"
            className="block text-gray-700 text-sm font-semibold mb-2"
          >
            Status:
          </label>
          <select
            id="status-dropdown"
            className="border border-gray-300 rounded py-2 px-3 w-48"
            value={activeTab}
            onChange={(e) => handleTabChange(e.target.value)}
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status === "all"
                  ? "All Tickets"
                  : `${status.charAt(0).toUpperCase()}${status.slice(
                      1
                    )} Tickets`}
              </option>
            ))}
          </select>
        </div>
        <div className="w-48">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Start Date:
          </label>
          <input
            className="border border-gray-300 rounded py-2 px-3 w-full"
            type="date"
            onChange={(e) => setStartDate(new Date(e.target.value))}
          />
        </div>
        <div className="w-48">
          <label className="block text-gray-700 text-sm font-semibold mb-2 mr-2">
            End Date:
          </label>
          <input
            className="border border-gray-300 rounded py-2 px-3 w-full"
            type="date"
            onChange={(e) => setEndDate(new Date(e.target.value))}
          />
        </div>
      </div>
      <div >
        <StyledDataGrid
          getRowClassName={(params) => `super-app-theme--${params.row.status}`}
          rows={rows}
          columns={columns}
          initialState={{
            ...rows.initialState,
            pagination: { paginationModel: { pageSize: 5 } },
          }}
          pageSizeOptions={[5, 10, 25]}
          page={currentPage}
          onPageChange={(newPage) => setCurrentPage(newPage)}
          //disableSelectionOnClick
          checkboxSelection
          loading={isLoading}
          components={{
            loadingOverlay: () => <Spinner />, // Custom spinner component
          }}
          className="min-w-full overflow-x-auto md:w-full"
        />
      </div>
      </div>
      </div>
        )}
    </div>
  );
}
export default Tickets;
