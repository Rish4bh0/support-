import { React, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateTicketAsync,
  getTicket,
  reset,
} from "../features/tickets/ticketSlice";
import { useNavigate, useParams } from "react-router-dom";
import { fetchAllUsers } from "../features/auth/authSlice";
import { getAllIssueTypes } from "../features/issues/issueSlice";
import { getAllProject } from "../features/project/projectSlice";
import { getAllOrganization } from "../features/organization/organizationSlice";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import MediaUpload from "./Media/ImageUpload";
import {
  Button,
  TextField,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Card,
  CardContent,
} from "@mui/material";

const UpdateProductPage = () => {
  const { ticketId } = useParams();
  const { ticket } = useSelector((state) => state.tickets);
  const { user } = useSelector((state) => state.auth);
  const users = useSelector((state) => state.auth.users);
  const issues = useSelector((state) => state.issueTypes.issueTypes);
  const projects = useSelector((state) => state.project.project);
  const userRole = useSelector((state) => state.auth.user.role);
  const organizations = useSelector(
    (state) => state.organizations.organizations
  );
  const dispatch = useDispatch();

  // State for form data including media
  const [formData, setFormData] = useState({
    ticketID: "",
    customerName: "",
    description: "",
    project: "",
    priority: "",
    assignedTo: "",
    organization: "",
    issueType: "",
    customerEmail: "",
    customerContact: "",
    cc: [],
  });

  // State to store selected media files
  // const [media, setMedia] = useState([]);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const { isLoading, isError, message, isSuccess } = useSelector(
    (state) => state.tickets
  );

  // Define an array of roles that should see the "Dashboard" link
  const allowedRoles = ["ADMIN", "SUPERVISOR"];
  useEffect(() => {
    // Fetch the list of registered users when the component loads
    dispatch(fetchAllUsers());
    // Load the initial issue list when the component mounts
    dispatch(getAllIssueTypes());
    dispatch(getAllOrganization());
    dispatch(getAllProject());
  }, [dispatch]);
  const navigate = useNavigate();
  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess) {
      navigate(`/ticket/${ticket._id}`);
      toast.success("Ticket updated!");
      dispatch(reset());
    }
  }, [dispatch, isError, isSuccess, navigate, message, reset]);

  useEffect(() => {
    // Fetch the ticket data from the store and update the form data
    if (ticket && ticket._id === ticketId) {
      setFormData({
        ticketID: ticket.ticketID,
        customerName: ticket.customerName,
        description: ticket.description,
        project: ticket.project,
        priority: ticket.priority,
        assignedTo: ticket.assignedTo,
        issueType: ticket.issueType,
        customerEmail: ticket.customerEmail,
        organization: ticket.organization,
        customerContact: ticket.customerContact,
        title: ticket.title,
        cc: ticket.cc || [],
      });
    } else {
      // If the ticket data is not available in the store, fetch it
      dispatch(getTicket(ticketId));
    }
  }, [ticketId, ticket, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update formData state
    setFormData((prevData) => ({
      ...prevData,
      [name]: Array.isArray(value) ? value : value === "null" ? null : value,
    }));
  };

  useEffect(() => {
    // Filter users based on role
    setFilteredUsers(
      users.filter((user) =>
        ["ADMIN", "EMPLOYEE", "SUPERVISOR"].includes(user.role)
      )
    );
  }, [users]);
  /*
  // Function to handle media file selection
  const handleMedia = (e) => {
    const selectedMedia = e.target.files;
    const mediaArray = [];

    for (let i = 0; i < selectedMedia.length; i++) {
      const file = selectedMedia[i];
      setFileToBase(file, (base64Media) => {
        mediaArray.push(base64Media);

        if (i === selectedMedia.length - 1) {
          setMedia(mediaArray);
        }
      });
    }
  };

  // Function to convert file to base64
  const setFileToBase = (file, callback) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64Media = reader.result;
      callback(base64Media);
    };
  };
*/
  const handleSubmit = (e, status) => {
    e.preventDefault();

    // Dispatch the updateTicketAsync action with media data
    dispatch(
      updateTicketAsync({
        ticketId,
        updatedTicketData: {
          customerName: formData.customerName,
          description: formData.description,
          ticketID: formData.ticketID,
          project: formData.project,
          priority: formData.priority,
          assignedTo: formData.assignedTo,
          organization: formData.organization,
          issueType: formData.issueType,
          customerEmail: formData.customerEmail,
          customerContact: formData.customerContact,
          title: formData.title,
          status: status === "new" ? "new" : status,
          cc: formData.cc,
        },
      })
    );
  };

  // Check if the user has one of the allowed roles
  if (!["ADMIN", "SUPERVISOR", "EMPLOYEE", "ORGAGENT"].includes(userRole)) {
    // Handle unauthorized access, e.g., redirect or show an error message
    return (
      <div>
        <h1>Unauthorized Access</h1>
        <p>You do not have permission to access this page.</p>
      </div>
    );
  }

  if (isLoading) return <Spinner />;

  return (
    <>
      <Card className=" bg-white rounded-lg border mb-48">
        <div className="card-header p-4 border-b-1 pb-3">
          <Typography variant="h6">
            <div className="flex justify-between">
              <div>Update Ticket</div>
              <div className="text-xs font-normal">
                <label className="font-medium">Ticket ID: </label>
                {ticket.ticketID}
              </div>
            </div>
          </Typography>
        </div>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <Grid container spacing={3} className="mb-4">
              <Grid item xs={6}>
                <TextField
                  label=" Ticket title"
                  name="title"
                  value={formData.title}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="organization">Organization</InputLabel>
                  <Select
                    name="organization"
                    id="organization"
                    value={formData.organization}
                    onChange={handleChange}
                  >
                    <MenuItem value="">Select One</MenuItem>
                    {user && user.role === "ADMIN" ? (
                      // Render all organizations if user's role is admin
                      organizations && organizations.length > 0 ? (
                        organizations.map((organization) => (
                          <MenuItem
                            key={organization._id}
                            value={organization._id}
                          >
                            {organization.name}
                          </MenuItem>
                        ))
                      ) : (
                        // Render a disabled option if no organizations are available
                        <MenuItem value="" disabled>
                          No organization available
                        </MenuItem>
                      )
                    ) : user && user.organization ? (
                      // Render organizations based on user's organization
                      organizations && organizations.length > 0 ? (
                        organizations
                          .filter((org) => org._id === user.organization)
                          .map((org) => (
                            <MenuItem key={org._id} value={org._id}>
                              {org.name}
                            </MenuItem>
                          ))
                      ) : (
                        // Render a disabled option if no organizations are available
                        <MenuItem value="" disabled>
                          No organization available
                        </MenuItem>
                      )
                    ) : (
                      // Render a disabled option if no organizations are available
                      <MenuItem value="" disabled>
                        No organization available
                      </MenuItem>
                    )}
                  </Select>
                </FormControl>
              </Grid>

              {userRole && allowedRoles.includes(userRole) && (
                <Grid item xs={2}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="assignedTo">Assign To</InputLabel>
                    <Select
                      name="assignedTo"
                      id="assignedTo"
                      value={formData.assignedTo}
                      onChange={handleChange}
                    >
                      <MenuItem value="null">Select One</MenuItem>
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <MenuItem key={user._id} value={user._id}>
                            {user.name}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem value="" disabled>
                          No users available for the selected organization
                        </MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Grid>
              )}

              <Grid item xs={4}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="cc">CC Users</InputLabel>
                  <Select
                    name="cc"
                    id="cc"
                    multiple
                    value={formData.cc}
                    onChange={handleChange}
                  >
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <MenuItem key={user._id} value={user._id}>
                          {user.name}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem value="" disabled>
                        No users available for CC
                      </MenuItem>
                    )}
                  </Select>
                </FormControl>
              </Grid>
              {userRole && allowedRoles.includes(userRole) && (
                <Grid item xs={2}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="priority">Priority</InputLabel>
                    <Select
                      name="priority"
                      id="priority"
                      value={formData.priority}
                      onChange={handleChange}
                    >
                      <MenuItem value="">Select One</MenuItem>
                      <MenuItem value="High">High</MenuItem>
                      <MenuItem value="Low">Low</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              )}

              <Grid item xs={4}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="issueType">Issue Type</InputLabel>
                  <Select
                    name="issueType"
                    id="issueType"
                    value={formData.issueType}
                    onChange={handleChange}
                  >
                    <MenuItem value="">Select One</MenuItem>
                    {issues && issues.length > 0 ? (
                      issues.map((issue) => (
                        <MenuItem key={issue._id} value={issue._id}>
                          {issue.name}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem value="" disabled>
                        No issue available
                      </MenuItem>
                    )}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Description of the issue"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={4}
                />
              </Grid>
            </Grid>
            <MediaUpload ticketID={ticket._id} />
          </CardContent>
          <div className="card-footer p-4 border-t-1  space-x-6 text-end">
            <div className="form-group space-x-6">
              <Button variant="contained" color="primary" type="submit">
                Update
              </Button>
              {ticket.status === "draft" && (
                <Button
                  variant="contained"
                  color="success"
                  onClick={(e) => handleSubmit(e, "new")}
                >
                  Submit
                </Button>
              )}
            </div>
          </div>
        </form>
      </Card>
    </>
  );
};

export default UpdateProductPage;

// UpdateProductPage.js
{
  /*
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateTicketAsync, getTicket } from '../features/tickets/ticketSlice';
import { useParams } from 'react-router-dom';

const UpdateProductPage = () => {
  const { ticketId } = useParams();
  const { ticket } = useSelector((state) => state.tickets);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    customerName: '', // Initialize with an empty string
    description: '',  // Initialize with an empty string
  });

  useEffect(() => {
    // Fetch the ticket data from the store and update the form data
    if (ticket && ticket._id === ticketId) {
      setFormData({
        customerName: ticket.customerName,
        description: ticket.description,
      });
    } else {
      // If the ticket data is not available in the store, fetch it
      dispatch(getTicket(ticketId));
    }
  }, [ticketId, ticket, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Dispatch the updateTicketAsync action
    dispatch(
      updateTicketAsync({
        ticketId,
        updatedTicketData: {
          customerName: formData.customerName,
          description: formData.description,
        },
      })
    );
  };

  return (
    <div>
      <h2>Update Ticket</h2>
      <h2>{ticket._id}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="customerName">Customer Name:</label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Update Ticket</button>
      </form>
    </div>
  );
};

export default UpdateProductPage;*/
}
