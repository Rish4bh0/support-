import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../components/Spinner";
<<<<<<< HEAD
=======
import BackButton from "../components/BackButton";
>>>>>>> eca53c304081264fab6ff6e016e69b15d0459a9f
import {
  getTickets,
  reset,
  getAllTickets,
} from "../features/tickets/ticketSlice";
<<<<<<< HEAD
import { fetchAllUsers } from "../features/auth/authSlice";
import { getAllIssueTypes } from "../features/issues/issueSlice";
import { getAllOrganization } from "../features/organization/organizationSlice";
=======
import TicketItem from "../components/TicketItem";
import { fetchAllUsers } from "../features/auth/authSlice";
import { getAllIssueTypes } from "../features/issues/issueSlice";
import { getAllOrganization } from "../features/organization/organizationSlice";

// Import icons for "Next" and "Previous" buttons
// import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { IoChevronForwardOutline, IoChevronBackOutline } from "react-icons/io5";

>>>>>>> eca53c304081264fab6ff6e016e69b15d0459a9f
import { getAllProject } from "../features/project/projectSlice";
import { DataGrid } from "@mui/x-data-grid";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { darken, lighten, styled } from "@mui/material/styles";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Link } from "react-router-dom";
import Alert from '@mui/material/Alert';


function Tickets() {
  const { tickets, isLoading } = useSelector((state) => state.tickets);
  const dispatch = useDispatch();
<<<<<<< HEAD
=======
  const userRole = useSelector((state) => state.auth.user.role);
>>>>>>> eca53c304081264fab6ff6e016e69b15d0459a9f
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
  const issues = useSelector((state) => state.issueTypes.issueTypes);
  const users = useSelector((state) => state.auth.users);
  const projects = useSelector((state) => state.project.project);
  const projectMap = {};
  projects.forEach((project) => {
    projectMap[project._id] = project.projectName;
  });
  const issueMap = {};
  issues.forEach((issue) => {
    issueMap[issue._id] = issue.name;
  });
  const organizationMap = {};
  organizations.forEach((organization) => {
    organizationMap[organization._id] = organization.name;
  });
  const userMap = {};
  users.forEach((user) => {
    userMap[user._id] = user.name;
  });
  const allowedRolesOrg = ["ADMIN", "SUPERVISOR", "ORGAGENT","USER" ];
  const  allowedRoles = ["ADMIN", "SUPERVISOR",  ];
  const  allowedRolesor = ["ADMIN", "SUPERVISOR","EMPLOYEE"  ];
  const org =["ORGAGENT","USER"]
  useEffect(() => {
    dispatch(getAllTickets());
    dispatch(getTickets());

    return () => {
      dispatch(reset());
    };
  }, [dispatch, reset]);

  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(getAllIssueTypes());
    dispatch(getAllOrganization());
    dispatch(getAllProject());
  }, [dispatch]);

<<<<<<< HEAD
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
=======
  const newTickets = tickets.filter((ticket) => ticket.status === "new");
  const openTickets = tickets.filter((ticket) => ticket.status === "open");
  const closedTickets = tickets.filter((ticket) => ticket.status === "close");
  const reviewTickets = tickets.filter((ticket) => ticket.status === "review");

  const filteredTickets =
    activeTab === "all"
      ? tickets
      : activeTab === "new"
      ? newTickets
      : activeTab === "open"
      ? openTickets
      : activeTab === "review"
      ? reviewTickets
      : activeTab === "close"
      ? closedTickets
      : [];
>>>>>>> eca53c304081264fab6ff6e016e69b15d0459a9f

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
              < VisibilityIcon  className="text-blue-500 group-hover:text-blue-700 mr-8" />
            </button>
          </Link>
        </div>
      ),
    },
  ];
  const greetingMessages = filteredTickets.map(ticket => {
    const assignedUser = userMap[ticket.assignedTo];
    const remainingTickets = rows.length;
    return assignedUser ? `Hey there ${assignedUser}! Below are the tickets assigned to you. ${remainingTickets} more 🎫 to go.` : null;
  });
  // Paginate the filtered tickets
<<<<<<< HEAD
  const startIndex = (currentPage[activeTab] - 1) * rowsPerPage;
  const totalPages = Math.ceil(filteredTickets.length / rowsPerPage);
=======
  const startIndex = (currentPage[activeTab] - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const sortedTickets = [...filteredTickets].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  const paginatedTickets = sortedTickets.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
>>>>>>> eca53c304081264fab6ff6e016e69b15d0459a9f

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
<<<<<<< HEAD
    <div className="mt-4">
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
=======
    <>
      <div className="flex items-center justify-between mb-4">
        <h6>Page Title</h6>
        <div className="flex items-center">
          <label
            htmlFor="status-dropdown"
            className="mr-2 text-sm font-semibold"
>>>>>>> eca53c304081264fab6ff6e016e69b15d0459a9f
          >
            Status:
          </label>
          <select
            id="status-dropdown"
<<<<<<< HEAD
            className="border border-gray-300 rounded py-2 px-3 w-48"
=======
            className="px-2 py-1 border border-gray-300 rounded text-sm"
>>>>>>> eca53c304081264fab6ff6e016e69b15d0459a9f
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
<<<<<<< HEAD
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
    </div>
=======
      </div>

      <div className="tickets text-xs">
        <div className="ticket-headings font-semibold">
          <div>Ticket ID</div>
          <div>Date</div>
          <div>Assigned To</div>
          <div>Priority</div>
          <div>Issue Type</div>
          <div>Status</div>
          <div>Office</div>
          <div>Actions</div>
        </div>
        {isLoading && (
          <div className="text-center my-4">
            <Spinner />
          </div>
        )}
        {filteredTickets.length === 0 ? (
          <div className="mt-28 mb-28">No tickets available</div>
        ) : null}

        {paginatedTickets.map((ticket) => (
          <TicketItem key={ticket._id} ticket={ticket} />
        ))}
      </div>
      <div className="pagination-row">
        <div className="pagination-buttons">
          <button
            className="btn btn-reverse btn-back"
            onClick={handlePrevPage}
            disabled={currentPage[activeTab] === 1}
          >
            <IoChevronBackOutline />
          </button>
          <div className="page-buttons-row">
            {pageButtons.slice(
              Math.max(
                0,
                currentPage[activeTab] - Math.floor(maxPageButtons / 2)
              ),
              currentPage[activeTab] + Math.floor(maxPageButtons / 2)
            )}
          </div>
          <button
            className="btn btn-reverse btn-back"
            onClick={handleNextPage}
            disabled={currentPage[activeTab] === totalPages}
          >
            <IoChevronForwardOutline />
          </button>
        </div>
      </div>
    </>
>>>>>>> eca53c304081264fab6ff6e016e69b15d0459a9f
  );
}
export default Tickets;
