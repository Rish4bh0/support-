import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";
import { reset, getAllTickets } from "../features/tickets/ticketSlice";
import { fetchAllUsers } from "../features/auth/authSlice";
import { getAllIssueTypes } from "../features/issues/issueSlice";
import { getAllOrganization } from "../features/organization/organizationSlice";
import { DataGrid } from "@mui/x-data-grid";
import { makeStyles } from "@mui/styles";
import { Link } from "react-router-dom";
import ModeEditIcon from "@mui/icons-material/ModeEdit";


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
  const organizations = useSelector((state) => state.organizations.organizations);
  const dispatch = useDispatch();
  const userRole = useSelector((state) => state.auth.user.role);
  const [activeTab, setActiveTab] = useState("unassigned");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const classes = useStyles();

  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(getAllIssueTypes());
    dispatch(getAllOrganization());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAllTickets());

    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  if (isLoading) return <Spinner />;

  const organizationMap = {};
  organizations.forEach((organization) => {
    organizationMap[organization._id] = organization.name;
  });

  const filteredTickets = allTickets.filter((ticket) => {
    if (activeTab === "unassigned") return !ticket.assignedTo;

    return false;
  });

  const rows = filteredTickets.map((ticket) => ({
    id: ticket._id,
    date: ticket.date,
    product: ticket.product,
    assignedTo: ticket.assignedTo,
    priority: ticket.priority,
    issueType: ticket.issueType,
    status: ticket.status,
    organization: organizationMap[ticket.organization], // Replace with the organization name
  }));

  const columns = [
    { field: "product", headerName: "Product", flex: 1 },
    { field: "assignedTo", headerName: "Assigned To", flex: 1 },
    {
      field: "priority",
      headerName: "Priority",
      flex: 1,
      renderCell: (params) => (
        <div
          className={
            params.value === "High" ? classes.highPriority : classes.lowPriority
          }
        >
          {params.value}
        </div>
      )
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
        <div
          className={
            params.value === "Open" ? classes.openStatus : classes.closedStatus
          }
        >
          {params.value}
        </div> )
      },
    
    { field: "organization", headerName: "Office", flex: 1 },
    {
      field: "actions",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => (
        <div>
           <Link to={`/ticket/${params.row.id}/update`}>
          <button className="group">
            <ModeEditIcon className="text-blue-500 group-hover:text-blue-700 mr-8" />
          </button>
        </Link>

        </div>
      ),
    },
  ];

  return (
    <div>
      <BackButton url="/" />
      <div className="tab-buttons">
       
      </div>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={itemsPerPage}
          page={currentPage}
          onPageChange={(newPage) => setCurrentPage(newPage)}
          disableSelectionOnClick // Disable row selection
        />
      </div>
    </div>
  );
}

export default UnassignedTickets;


/*
import React, { useEffect, useState } from "react"; // Import React and the necessary hooks
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";
import { reset, getAllTickets } from "../features/tickets/ticketSlice";
import TicketItem from "../components/TicketItem";
import { fetchAllUsers } from "../features/auth/authSlice";
import { getAllIssueTypes } from "../features/issues/issueSlice";
import { getAllOrganization } from "../features/organization/organizationSlice";

function UnassignedTickets() { // Rename the function to start with an uppercase letter
  const { allTickets, isLoading } = useSelector((state) => state.tickets);
  const dispatch = useDispatch();
  const userRole = useSelector(state => state.auth.user.role); // Retrieve the user's role from Redux state
  const [activeTab, setActiveTab] = useState("new");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // You can adjust this number as needed

  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(getAllIssueTypes());
    dispatch(getAllOrganization());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAllTickets());

    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  if (isLoading) return <Spinner />;

  const filteredTickets = allTickets.filter((ticket) => {
    if (activeTab === "unassigned") return !ticket.assignedTo;

    return false;
  });

  // Paginate the filtered tickets
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTickets = filteredTickets.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Check if the user has one of the allowed roles
  if (!["ADMIN", "SUPERVISOR", "EMPLOYEE"].includes(userRole)) {
    // Handle unauthorized access, e.g., redirect or show an error message
    return (
      <div>
        <h1>Unauthorized Access</h1>
        <p>You do not have permission to access this page.</p>
      </div>
    );
  }

  return (
    <>
      <BackButton url="/" />
      <div className="tab-buttons">
        <button
          className={`btn btn-reverse btn-back ${activeTab === "unassigned" ? "active" : ""}`}
          onClick={() => setActiveTab("unassigned")}
        >
          Unassigned Tickets
        </button>
      </div>
      <div className="tickets">
        <div className="ticket-headings">
          <div>Date</div>
          <div>Product</div>
          <div>Assigned To</div>
          <div>Priority</div>
          <div>Issue Type</div>
          <div>Status</div>
          <div>Organization</div>
          <div>Actions</div>
        </div>
        {paginatedTickets.map((ticket) => (
          <TicketItem key={ticket._id} ticket={ticket} />
        ))}
      </div>
      <div className="tab-buttons">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`btn btn-reverse btn-back ${currentPage === index + 1 ? "active" : ""}`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </>
  );
}

export default UnassignedTickets; // Export the component with the correct name
*/