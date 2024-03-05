import React, { useEffect, useState } from "react";
import {
  reset,
  selectUserById,
  updateUser,
} from "../../features/auth/authSlice";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../components/Spinner";
import { toast } from "react-toastify";
import { getAllOrganization } from "../../features/organization/organizationSlice";
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
import SendIcon from "@mui/icons-material/Send";
import BackButton from "../../components/BackButton";

const UpdateUser = () => {
  const user = useSelector((state) => state.auth.selectedUser);
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );
  const userRole = useSelector((state) => state.auth.user?.role);
  const allowedRoles = ["ADMIN", "SUPERVISOR", "EMPLOYEE"];
  const organizations = useSelector(
    (state) => state.organizations.organizations
  );
  const { id } = useParams();
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  // State to store form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    organization: "",
  });

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess) {
      const updatedUserId = user._id;
      const updatedUserOrganizationId = user.organization;

      navigate(`/organizations/${updatedUserOrganizationId}`);
      toast.success("User updated!");
      dispatch(reset());
    }
  }, [dispatch, isError, isSuccess, navigate, message, reset]);

  // Function to handle form input changes except for password
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Function to handle password input changes
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Dispatch the updateOrganization action with the updated organization data
    dispatch(
      updateUser({
        id,
        userData: {
          ...formData, // Include other form data
          password, // Include the password
        },
      })
    );
  };

  useEffect(() => {
    // Fetch the selected organization by its ID
    dispatch(selectUserById(id));
    dispatch(getAllOrganization());
  }, [id, dispatch]);

  // Update formData with organization data when it's available
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        organization: user.organization,
      });
    }
  }, [user]);

  // Display loading message if the organization is being fetched
  if (!user) {
    return <Spinner />;
  }

  return (
    <>
      <section className="card bg-white rounded-lg border">
        <div className="card-header p-4 border-b-1 pb-3">
          <Typography variant="h6">
            <div className="flex justify-between">
              <div>Update User</div>
              <div className="text-xs font-normal">
                <label className="font-medium">User ID: </label> {user._id}
              </div>
            </div>
          </Typography>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="card-body px-4 py-6">
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <TextField
                  label="Name"
                  placeholder="Name"
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
                  label=" Password"
                  name="Password"
                  value={password}
                  placeholder="Enter your password"
                  onChange={handlePasswordChange}
                  fullWidth
                />
              </Grid>

              {userRole && allowedRoles.includes(userRole) && (
                <Grid item xs={2}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="priority">Priority</InputLabel>
                    <Select
                      name="priority"
                      id="priority"
                      value={formData.role}
                      onChange={handleChange}
                    >
                      <MenuItem value="">Select One</MenuItem>
                      <MenuItem value="USER">USER</MenuItem>
                      <MenuItem value="ADMIN">ADMIN</MenuItem>
                      <MenuItem value="SUPERVISOR">SUPERVISOR</MenuItem>
                      <MenuItem value="EMPLOYEE">EMPLOYEE</MenuItem>
                      <MenuItem value="ORGAGENT">ORGAGENT</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              )}

              {userRole && allowedRoles.includes(userRole) && (
                <Grid item xs={4}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="organization">Organization</InputLabel>
                    <Select
                      name="organization"
                      id="organization"
                      value={formData.organization}
                      onChange={handleChange}
                    >
                      <MenuItem value="">Select One</MenuItem>
                      {organizations && organizations.length > 0 ? (
                        organizations.map((organization) => (
                          <MenuItem
                            key={organization._id}
                            value={organization._id}
                          >
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
              )}
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

export default UpdateUser;
