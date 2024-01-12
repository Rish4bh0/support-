import React, { useEffect, useState } from "react";
import {
  reset,
  selectOrganizationById,
  updateOrganization,
} from "../features/organization/organizationSlice";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";
import SendIcon from "@mui/icons-material/Send";
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
import { toast } from "react-toastify";

const UpdateOrganization = () => {
  const organization = useSelector(
    (state) => state.organizations.selectedOrganization
  );

  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.organizations
  );

  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    // Fetch the selected organization by its ID
    dispatch(selectOrganizationById(id));
  }, [id, dispatch]);

 
  // State to store form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    focalPersonName: "",
    focalPersonContact: "",
    focalPersonEmail: "",
  });

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess) {
      
      
      navigate('/organization');
      toast.success("Office updated!");
      dispatch(reset());
    }
  }, [dispatch, isError, isSuccess, navigate, message, reset]);


   // Update formData with organization data when it's available
   useEffect(() => {
    if (organization) {
      setFormData({
        name: organization.name,
        email: organization.email,
        contact: organization.contact,
        focalPersonName: organization.focalPersonName,
        focalPersonContact: organization.focalPersonContact,
        focalPersonEmail: organization.focalPersonEmail
      });
    }
  }, [organization]);

  // Function to handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Dispatch the updateOrganization action with the updated organization data
    dispatch(
      updateOrganization({
        id,
        organizationData: formData,
      })
    );
  };

  

  // Display loading message if the organization is being fetched
  if (!organization) {
    return <Spinner />;
  }

  return (
    <>

<BackButton url="/" />
      <section className="flex items-center justify-center ">
        <div>
          <Typography variant="h4" component="h1" gutterBottom>
          Update Office
          </Typography>
          <Typography variant="body2">
            Please fill out the form below
          </Typography>
          <Typography variant="body2">
            Office ID: {organization._id}
          </Typography>
        </div>
      </section>

     
      <form onSubmit={handleSubmit} className="p-6">
      <Grid container spacing={3}>
      <Grid item xs={6}>
            <TextField
              label=" Office Name"
              placeholder="Office Name"
              name="name"
            value={formData.name}
            onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label=" Email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label=" Contact"
              placeholder="Contact"
              name="contact"
            value={formData.contact}
            onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label=" Focal Person Name"
              placeholder="Focal Person Name"
              name="focalPersonName"
              value={formData.focalPersonName}
          onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label=" Focal Person Email"
              placeholder="Focal Person Email"
              name="focalPersonEmail"
              value={formData.focalPersonEmail}
          onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label=" Focal Person Contact"
              placeholder="Focal Person Contact"
              name="focalPersonContact"
              value={formData.focalPersonContact}
          onChange={handleChange}
              fullWidth
            />
          </Grid>

            </Grid>

            <div className="form-group mt-6 space-x-6">
          <Button
            variant="contained"
            color="success"
            endIcon={<SendIcon />}
            type="submit"
          >
            Update Office
          </Button>
        </div>
      </form>
    </>
  );
};

export default UpdateOrganization;
