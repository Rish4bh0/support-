import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createTicket, reset } from "../features/tickets/ticketSlice";
import { fetchAllUsers } from "../features/auth/authSlice";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";
import {
  Button,
  TextField,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Alert,
  IconButton,
  Card,
  CardContent,
} from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import CloseIcon from "@mui/icons-material/Close";
import { getAllOrganization } from "../features/organization/organizationSlice";
import { getAllIssueTypes } from "../features/issues/issueSlice";

function NewTicket() {
  const { user } = useSelector((state) => state.auth);
  const { isLoading, isError,  message, isSuccess } = useSelector(
    (state) => state.tickets
  );
 
  const users = useSelector((state) => state.auth.users);
  const issues = useSelector((state) => state.issueTypes.issueTypes);
  const organizations = useSelector((state) => state.organizations.organizations);

  const [title, setTitle] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [customerContact, setCustomerContact] = useState("");
  const [product, setProduct] = useState("");
  const [priority, setPriority] = useState("");
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [media, setMedia] = useState([]);
  const [organization, setOrganization] = useState("");
  const [showAlert, setShowAlert] = useState(false); // For empty form alert

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(getAllOrganization());
    dispatch(getAllIssueTypes());
  }, [dispatch]);

  const handleMedia = (selectedMedia) => {
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

  const setFileToBase = (file, callback) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64Media = reader.result;
      callback(base64Media);
    };
  };
  
  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess) {
      dispatch(reset());
      navigate('/ticketss');
      toast.success('New ticket created!');
      
    }
    
  }, [dispatch, isError, isSuccess, navigate, message, reset]);
  

  const saveDraftToLocalStorage = () => {
    const draftData = {
      title,
      customerName,
      customerEmail,
      isEmailValid,
      customerContact,
      product,
      priority,
      issueType,
      description,
      assignedTo,
      media,
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
      setCustomerName(draftData.customerName || "");
      setCustomerEmail(draftData.customerEmail || "");
      setIsEmailValid(draftData.isEmailValid || false);
      setCustomerContact(draftData.customerContact || "");
      setProduct(draftData.product || "");
      setPriority(draftData.priority || "");
      setIssueType(draftData.issueType || "");
      setDescription(draftData.description || "");
      setAssignedTo(draftData.assignedTo || "");
      setMedia(draftData.media || []);
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
        case "customerName":
          setCustomerName(value);
          break;
        case "customerEmail":
          setCustomerEmail(value);
          break;
        case "customerContact":
          setCustomerContact(value);
          break;
        case "product":
          setProduct(value);
          break;
        case "priority":
          setPriority(value);
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
          case "media":
            if (files) {
              // Only call handleMedia when files are present
              handleMedia(files);
            }
            break;
        default:
          break;
      }

      // Save the draft to local storage
      saveDraftToLocalStorage();
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
   

    const ticketData = {
      product,
      media,
      description,
      priority,
      assignedTo,
      issueType,
      customerName,
      customerEmail,
      customerContact,
      organization,
      title
    };
    console.log(ticketData)
    dispatch(createTicket(ticketData));
    localStorage.removeItem("ticketDraft");
  };
  const userRole = useSelector((state) => state.auth.user?.role);

  // Define an array of roles that should see the "Dashboard" link
  const allowedRoles = ["ADMIN", "SUPERVISOR"];

  const allowedRolesReview = ["ADMIN", "SUPERVISOR","ORGAGENT"];

  if (isLoading) return <Spinner />;

  return (
    <>
     <BackButton url="/" />
      <section className="flex items-center justify-center ">
    
          <div>
            <Typography variant="h4" component="h1" gutterBottom>
              Create New Ticket
            </Typography>
            <Typography variant="body2">
              Please fill out the form below
            </Typography>
          </div>
         
        
      </section>

      <form onSubmit={onSubmit} className="p-6">


        <Grid container spacing={3}>
        <Grid item xs={12}>
            <TextField
              label=" Ticket title"
              placeholder="Ticket title"
              name="title"
              value={title}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
            label="Customer Name"
              name="customerName"
              placeholder="Customer Name"
              value={customerName}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
            label="Customer Email"
              name="customerEmail"
              placeholder="Customer Email"
              value={customerEmail}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
             label="Customer Contact"
              name="customerContact"
              placeholder="Customer Contact"
              value={customerContact}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel htmlFor="organization">Organization</InputLabel>
              <Select
                name="organization"
                id="organization"
                value={organization}
                onChange={handleInputChange}
              >
                <MenuItem value="">
                  Select One
                </MenuItem>
                {organizations && organizations.length > 0 ? (
                  organizations.map((organization) => (
                    <MenuItem key={organization._id} value={organization._id}>
                      {organization.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="" disabled>
                    No organization available
                  </MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>

          {
          userRole &&
          allowedRoles.includes(userRole) && 
        
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel htmlFor="assignedTo">Assign To</InputLabel>
              <Select
                name="assignedTo"
                id="assignedTo"
                value={assignedTo}
                onChange={handleInputChange}
              >
                <MenuItem value="">
                  Select One
                </MenuItem>
                {users && users.length > 0 ? (
                  users.map((user) => (
                    <MenuItem key={user._id} value={user._id}>
                      {user.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="" disabled>
                    No users available
                  </MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>
}
          
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel htmlFor="product">Product Name</InputLabel>
              <Select
                name="product"
                id="product"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
              >
                <MenuItem value="Ecommerce">
                  Ecommerce
                </MenuItem>
                <MenuItem value="Employee management system">
                  Employee management system
                </MenuItem>
                <MenuItem value="HR management system">
                  HR management system
                </MenuItem>
                <MenuItem value="CMS">
                  CMS
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {
          userRole &&
          allowedRoles.includes(userRole) && 
        
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel htmlFor="priority">Priority</InputLabel>
              <Select
                name="priority"
                id="priority"
                value={priority}
                onChange={handleInputChange}
              >
                 <MenuItem value="">
                  Select One
                </MenuItem>
                <MenuItem value="High">
                  High
                </MenuItem>
                <MenuItem value="Low">
                  Low
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
}
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel htmlFor="issueType">Issue Type</InputLabel>
              <Select
                name="issueType"
                id="issueType"
                value={issueType}
                onChange={handleInputChange}
              >
                <MenuItem value="">
                  Select One
                </MenuItem>
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
              placeholder="Description"
              value={description}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={4}
            />
          </Grid>
          <Grid item xs={12}>
            <div className="form-outline mb-4">
              <input
                onChange={handleInputChange}
                type="file"
                id="formupload"
                name="media"
                className="form-control"
                accept="image/*, video/*"
                multiple
              />
              <label className="form-label" htmlFor="formupload">
                Upload Media (Images and Videos)
              </label>
            </div>
            {media.length > 0 && (
              <div className="selected-media">
                <Typography variant="body2" gutterBottom>
                  Selected Media:
                </Typography>
                <div className="media-items-container">
                  {media.map((mediaItem, index) => (
                    <div key={index} className="media-item">
                      {mediaItem.startsWith("data:image") ? (
                        <img
                          className="img-preview max-w-full max-h-32"
                          src={mediaItem}
                          alt={`Selected Image ${index + 1}`}
                        />
                      ) : (
                        <video
                          controls
                          className="video-preview max-w-full max-h-32"
                          src={mediaItem}
                          alt={`Selected Video ${index + 1}`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Grid>
        
        </Grid>
        <div className="form-group mt-6">
          <Button variant="contained" color="primary" fullWidth type="submit">
            Submit
          </Button>
        </div>
      </form>
    </>
  );
}

export default NewTicket;
