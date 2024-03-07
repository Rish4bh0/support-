import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createTicket, reset } from "../features/tickets/ticketSlice";
import { fetchAllUsers } from "../features/auth/authSlice";
import Spinner from "../components/Spinner";
// import BackButton from "../components/BackButton";
import SendIcon from "@mui/icons-material/Send";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DraftsIcon from "@mui/icons-material/Drafts";
import {
  Button,
  TextField,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { getAllOrganization } from "../features/organization/organizationSlice";
import { getAllIssueTypes } from "../features/issues/issueSlice";
import axios from "axios";
import { getAllProject } from "../features/project/projectSlice";
import { environment } from "../lib/environment";

function NewTicket() {
  const { user } = useSelector((state) => state.auth);
  const { isLoading, isError, message, isSuccess } = useSelector(
    (state) => state.tickets
  );

  const users = useSelector((state) => state.auth.users);
  const issues = useSelector((state) => state.issueTypes.issueTypes);
  const projects = useSelector((state) => state.project.project);

  const organizations = useSelector(
    (state) => state.organizations.organizations
  );

  const [title, setTitle] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [customerContact, setCustomerContact] = useState("");
  const [product, setProduct] = useState("");
  const [cc, setCC] = useState([]);
  const [priority, setPriority] = useState("");
  const [issueType, setIssueType] = useState("");
  const [project, setProject] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  //const [media, setMedia] = useState([]);
  const [organization, setOrganization] = useState("");
  const [showAlert, setShowAlert] = useState(false); // For empty form alert
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [media, setMedia] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(getAllOrganization());
    dispatch(getAllIssueTypes());
    dispatch(getAllProject());

    // Set organization based on user's role
    if (user && user.role === "ADMIN") {
      // If user is ADMIN, set organization based on selected dropdown value or default to the first organization
      setOrganization(
        organization || (organizations.length > 0 ? organizations[0]._id : "")
      );
    } else {
      // If user is not ADMIN, set organization based on user's organization ID
      setOrganization(user?.organization || "");
    }
  }, [dispatch, user, organization, organizations]);

  const handleFileChange = (e) => {
    const files = e.target.files;
    // Ensure that files is converted to an array, even if it's a FileList
    const filesArray = Array.from(files);
    setMedia((prevMedia) => [...prevMedia, ...filesArray]);

    // Reset the value of the file input to allow selecting the same files again
    e.target.value = null;
  };
  const handleRemoveFile = (index) => {
    setMedia((prevMedia) => {
      const updatedMedia = [...prevMedia];
      updatedMedia.splice(index, 1);
      return updatedMedia;
    });
  };

  {
  }
  useEffect(() => {
    loadDraftFromLocalStorage();
  }, []);

  const saveDraftToLocalStorage = () => {
    const draftData = {
      title,
      project,
      priority,
      issueType,
      description,
      assignedTo,
      //media,
      organization,
    };

    // Save the draft data to local storage
    localStorage.setItem("ticketDraft", JSON.stringify(draftData));
  };

  const loadDraftFromLocalStorage = () => {
    // Load the draft data from local storage
    const storedDraft = localStorage.getItem("ticketDraft");

    if (storedDraft) {
      const draftData = JSON.parse(storedDraft);

      // Set the form fields with the loaded draft data
      setTitle(draftData.title || "");
      setProject(draftData.project || "");
      setPriority(draftData.priority || "");
      setIssueType(draftData.issueType || "");
      setDescription(draftData.description || "");
      setAssignedTo(draftData.assignedTo || "");
      // setMedia(draftData.media || []);
      setOrganization(draftData.organization || "");
    }
  };

  useEffect(() => {
    // Load the draft data when the component mounts
    loadDraftFromLocalStorage();
  }, []);

  const handleInputChange = (e) => {
    // Update the state and save the draft to local storage when the input changes
    const { name, value, files } = e.target;
    if (name) {
      switch (name) {
        case "title":
          setTitle(value);
          break;
        case "project":
          setProject(value);
          break;
        case "priority":
          setPriority(value);
          break;
        case "cc":
          setCC(value);
          break;
        case "issueType":
          setIssueType(value);
          break;
        case "description":
          setDescription(value);
          break;
        case "assignedTo":
          setAssignedTo(value);
          break;
        case "organization":
          setOrganization(value);
          break;
        default:
          break;
      }

      // Save the draft to local storage
      saveDraftToLocalStorage();
    }
  };

  useEffect(() => {
    // Filter users based on role
    setFilteredUsers(
      users.filter((user) =>
        ["ADMIN", "EMPLOYEE", "SUPERVISOR"].includes(user.role)
      )
    );
  }, [users]);

  const onSubmit = async (e, status) => {
    e.preventDefault();

    const ticketData = {
      project,
      //media,
      description,
      priority,
      assignedTo,
      issueType,
      organization,
      title,
      cc,
      status: status === "draft" ? "draft" : "new",
    };
    console.log(ticketData);
    try {
      // Set organization based on user's role
      if (user && user.role !== "ADMIN") {
        console.log("org" + user.organization);
        setOrganization(user.organization);
      }
      // Create the ticket and get the response
      const response = await dispatch(createTicket(ticketData));

      // Extract ticket ID from the API response
      const newTicketID = response.payload._id;
      console.log("bruh: " + newTicketID);
      // If media files are present, upload them
      if (media.length > 0) {
        setUploading(true);

        const formData = new FormData();
        media.forEach((file) => {
          formData.append("media", file);
        });

        // Append ticket ID to the media upload data
        formData.append("ticketID", newTicketID);
        console.log(formData);

        // Send a request to the media upload endpoint (http://localhost:5000/upload)
        const mediaResponse = await axios.post(
          environment.SERVER_URL + "/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
              const progress = Math.round(
                (progressEvent.loaded / progressEvent.total) * 100
              );
              console.log(progress);
              setUploadProgress(progress);
            },
          }
        );

        // Handle the media upload response as needed
        //const mediaUploadData = await mediaResponse.json();
        // console.log("Media upload response:", mediaUploadData);
      }

      // Reset form, navigate to tickets page, and show success toast
      dispatch(reset());
      navigate("/assigned");
      toast.success("New ticket created!");
      localStorage.removeItem("ticketDraft");
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast.error("Error creating new ticket");
    } finally {
    }
    setUploading(false);
    setUploadProgress(0);
  };
  const userRole = useSelector((state) => state.auth.user?.role);

  // Define an array of roles that should see the "Dashboard" link
  const allowedRoles = ["ADMIN", "SUPERVISOR"];

  const org = ["ADMIN", "SUPERVISOR", "EMPLOYEE"];

  if (isLoading) return <Spinner />;
  if (uploading) return <Spinner uploadProgress={uploadProgress} />;

  return (
    <>
      <div className="card bg-white rounded-lg border">
        <div className="card-header p-4 border-b-1 pb-3">
          <Typography variant="h6">Create New Ticket</Typography>
        </div>

        <form onSubmit={onSubmit}>
          <div className="card-body p-4">
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <label className="block font-semibold mb-2">
                  {" "}
                  Ticket title
                </label>
                <TextField
                  placeholder="Ticket title"
                  name="title"
                  size="small"
                  value={title}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              {userRole && org.includes(userRole) && (
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <label
                      htmlFor="organization"
                      className="block font-semibold mb-2"
                    >
                      Organization
                    </label>
                    <Select
                      name="organization"
                      id="organization"
                      size="small"
                      value={
                        user && user.role === "ADMIN"
                          ? organization
                          : user && user.role !== "ADMIN"
                          ? user.organization
                          : ""
                      }
                      onChange={handleInputChange}
                      disabled={user && user.role !== "ADMIN"}
                    >
                      <MenuItem value="">Select One</MenuItem>
                      {user && user.role === "ADMIN" ? (
                        // Render all organizations if user's role is admin
                        organizations.map((org) => (
                          <MenuItem key={org._id} value={org._id}>
                            {org.name}
                          </MenuItem>
                        ))
                      ) : user &&
                        user.organization &&
                        organizations &&
                        organizations.length > 0 ? (
                        // Render organizations based on user's organization
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
                      )}
                    </Select>
                  </FormControl>
                </Grid>
              )}

              {userRole && allowedRoles.includes(userRole) && (
                <Grid item xs={3}>
                  <FormControl fullWidth>
                    <label
                      htmlFor="assignedTo"
                      className="block font-semibold mb-2"
                    >
                      Assign To
                    </label>

                    <Select
                      name="assignedTo"
                      id="assignedTo"
                      size="small"
                      value={assignedTo}
                      onChange={handleInputChange}
                    >
                      <MenuItem value="">Select One</MenuItem>
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
              {userRole && allowedRoles.includes(userRole) && (
                <Grid item xs={3}>
                  <FormControl fullWidth>
                    <label htmlFor="cc" className="block font-semibold mb-2">
                      CC
                    </label>
                    <Select
                      name="cc"
                      id="cc"
                      size="small"
                      value={cc}
                      onChange={handleInputChange}
                      multiple
                    >
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

              {userRole && allowedRoles.includes(userRole) && (
                <Grid item xs={3}>
                  <FormControl fullWidth>
                    <label
                      htmlFor="priority"
                      className="block font-semibold mb-2"
                    >
                      Priority
                    </label>
                    <Select
                      name="priority"
                      id="priority"
                      size="small"
                      value={priority}
                      onChange={handleInputChange}
                    >
                      <MenuItem value="">Select One</MenuItem>
                      <MenuItem value="High">High</MenuItem>
                      <MenuItem value="Low">Low</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              )}
              <Grid item xs={3}>
                <FormControl fullWidth>
                  <label
                    htmlFor="issueType"
                    className="block font-semibold mb-2"
                  >
                    Issue Type
                  </label>
                  <Select
                    name="issueType"
                    id="issueType"
                    size="small"
                    value={issueType}
                    onChange={handleInputChange}
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
                <label className="block font-semibold mb-2">
                  Issue Description
                </label>
                <TextField
                  name="description"
                  size="small"
                  placeholder="Description"
                  value={description}
                  onChange={handleInputChange}
                  fullWidth
                  multiline
                  rows={4}
                />
              </Grid>
              <Grid item xs={6}>
                <label className="block font-semibold mb-2">File Upload</label>
                <input
                  type="file"
                  id="media"
                  name="media"
                  multiple
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                <label htmlFor="media">
                  <Button
                    variant=""
                    color="primary"
                    component="span"
                    startIcon={<CloudUploadIcon />}
                    sx={{
                      border: "1px dotted blue",
                      width: "100%",
                      padding: "2rem",
                      backgroundColor: "#0368ce0f",
                      color: "#1b3dc5",
                      "&:hover": {
                        backgroundColor: "#0368ce0f",
                      },
                    }}
                  >
                    Click to Upload File.
                  </Button>
                </label>
              </Grid>
              <Grid item xs={6}>
                {media.length > 0 && (
                  <div className="flex justify-between gap-3">
                    <div className="w-full">
                      <label className="block font-semibold mb-2">
                        Total number of files ( {media.length} )
                      </label>
                      <ul className="mt-2">
                        {media.map((file, index) => (
                          <li
                            key={index}
                            className="border rounded-sm relative mb-2 bg-white"
                          >
                            <div className="p-2 text-xs font-semibold bg-white">
                              {file.name}
                            </div>
                            <IconButton
                              onClick={() => handleRemoveFile(index)}
                              style={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                              }}
                            >
                              <CloseIcon />
                            </IconButton>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </Grid>
            </Grid>
          </div>
          <div className="card-footer p-4 border-t-1 space-x-3 text-end">
            <Button
              variant="contained"
              color="primary"
              onClick={(e) => onSubmit(e, "draft")}
            >
              Draft
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={(e) => onSubmit(e, "new")}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

export default NewTicket;
