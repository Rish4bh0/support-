import React, { useEffect, useState } from "react";
import {
  reset,
  selectOrganizationById,
  updateOrganization,
} from "../../features/organization/organizationSlice";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../components/Spinner";
import { Button, TextField, Grid, Typography } from "@mui/material";
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
      navigate("/organization");
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
        focalPersonEmail: organization.focalPersonEmail,
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
      <section className="card bg-white rounded-lg border">
        <div className="card-header p-4 border-b-1 pb-3">
          <Typography variant="h6">
            <div className="flex justify-between">
              <div>Update Office</div>
              <div className="text-xs font-normal">
                <label className="font-medium">Office ID: </label>{" "}
                {organization._id}
              </div>
            </div>
          </Typography>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="card-body px-4 py-6">
            <Grid container spacing={3}>
              <Grid item xs={5}>
                <TextField
                  label=" Office Name"
                  placeholder="Office Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label=" Email"
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  label=" Contact"
                  placeholder="Contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={5}>
                <TextField
                  label=" Focal Person Name"
                  placeholder="Focal Person Name"
                  name="focalPersonName"
                  value={formData.focalPersonName}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label=" Focal Person Email"
                  placeholder="Focal Person Email"
                  name="focalPersonEmail"
                  value={formData.focalPersonEmail}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={3}>
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
          </div>
          <div className="card-footer p-4 border-t-1  space-x-6 text-end">
            <Button variant="contained" color="primary" type="submit">
              Update
            </Button>
          </div>
        </form>
      </section>
    </>
  );
};

export default UpdateOrganization;
