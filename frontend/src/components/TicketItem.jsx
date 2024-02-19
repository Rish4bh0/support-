import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";

function TicketItem({ ticket }) {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const userRole = useSelector((state) => state.auth.user?.role);

  // Define an array of roles that should see the "Dashboard" link
  const allowedRolesOrg = ["ADMIN", "SUPERVISOR", "ORGAGENT", "USER"];
  const allowedRoles = ["ADMIN", "SUPERVISOR"];
  const allowedRolesor = ["ADMIN", "SUPERVISOR", "EMPLOYEE"];
  const org = ["ORGAGENT", "USER"];
  // Access the users array from the Redux state
  const users = useSelector((state) => state.auth.users);

  // Find the user object with the same ID as the ticket's assignedTo ID
  const assignedUser = users.find((user) => user._id === ticket.assignedTo);

  // Extract the name of the assigned user (if found)
  const assignedToName = assignedUser ? assignedUser.name : "Unassigned";

  // Access the issueTypes array from the Redux state (assuming you have it there)
  const issueTypes = useSelector((state) => state.issueTypes.issueTypes);

  // Find the issueType object with the same ID as the ticket's issueType ID
  const ticketIssueType = issueTypes.find(
    (issueType) => issueType._id === ticket.issueType
  );

  // Extract the name of the issueType (if found)
  const issueTypeName = ticketIssueType
    ? ticketIssueType.name
    : "Unknown Issue Type";

  // Access the issueTypes array from the Redux state (assuming you have it there)
  const projects = useSelector((state) => state.project.project);

  // Find the issueType object with the same ID as the ticket's issueType ID
  const ticketProject = projects.find(
    (project) => project._id === ticket.project
  );

  // Extract the name of the issueType (if found)
  const projectName = ticketProject
    ? ticketProject.projectName
    : "Unknown Project";

  // Access the issueTypes array from the Redux state (assuming you have it there)
  const organizations = useSelector(
    (state) => state.organizations.organizations
  );

  // Find the issueType object with the same ID as the ticket's issueType ID
  const ticketorganizations = organizations.find(
    (organization) => organization._id === ticket.organization
  );

  // Extract the name of the issueType (if found)
  const organizationName = ticketorganizations
    ? ticketorganizations.name
    : "Unknown Organization";

  return (
    <div className="ticket">
      <div>{ticket.ticketID}</div>
      {userRole && org.includes(userRole) && (
        <div className="w-48">{ticket.title}</div>
      )}
      <div>{new Date(ticket.createdAt).toLocaleString("en-US", options)}</div>
      {userRole && allowedRolesor.includes(userRole) && (
        <div>{assignedToName}</div>
      )}
      {userRole && allowedRolesor.includes(userRole) && (
        <div className={`priority priority-${ticket.priority}`}>
          {ticket.priority}
        </div>
      )}
      <div>{issueTypeName}</div> {/* Display the issue type's name */}
      <div className={`status status-${ticket.status}`}>{ticket.status}</div>
      {userRole && allowedRolesor.includes(userRole) && (
        <div>{organizationName}</div>
      )}
      <div className="icon-buttons">
        {userRole &&
          allowedRolesOrg.includes(userRole) &&
          ticket.status !== "draft" && (
            <IconButton
              component={Link}
              to={`/ticket/${ticket._id}`}
              className="btn btn-reverse btn-sm"
            >
              <VisibilityIcon />
            </IconButton>
          )}
        {(ticket.status === "draft" ||
          (userRole && allowedRoles.includes(userRole))) && (
          <IconButton
            component={Link}
            to={`/ticket/${ticket._id}/update`}
            className="btn btn-reverse btn-sm"
          >
            <EditIcon />
          </IconButton>
        )}
      </div>
    </div>
  );
}

export default TicketItem;
