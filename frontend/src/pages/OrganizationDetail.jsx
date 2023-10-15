import React, { useEffect, useState } from "react";
import { useDispatch, useSelector} from "react-redux";
import { useParams, Link} from "react-router-dom";
import Spinner from "../components/Spinner";
import { getAllOrganization, selectOrganizationById } from "../features/organization/organizationSlice";
import { createUser, deleteUser, fetchAllUsers } from "../features/auth/authSlice";
import CloseIcon from "@mui/icons-material/Close";
import Modal from "react-modal";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import { DataGrid } from "@mui/x-data-grid";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ViewListIcon from "@mui/icons-material/ViewList";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

const OrganizationDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [name, setNewUserName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const organizations = useSelector((state) => state.organizations.organizations);
  const organizationMap = {};
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));
  // Create a mapping of organization IDs to their names
  organizations.forEach((organization) => {
    organizationMap[organization._id] = organization.name;
  });
  const authUser = useSelector((state) => state.auth.user);
  const myorganization = useSelector(
    (state) => state.organizations.selectedOrganization
  );
  const users = useSelector((state) => state.auth.users);
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    // Load the initial issue list when the component mounts
    dispatch(selectOrganizationById(id));
    dispatch(getAllOrganization());
    dispatch(fetchAllUsers());
  }, [id, dispatch]);

  const handleCreateUser = (e) => {
    e.preventDefault();
    console.log(role, id)
    dispatch(createUser({ name, email, password, role, organization: id }));
    setNewUserName("");
    setEmail("");
    setPassword("");
    setRole(""); // Clear the role input field
    closeModal();
  };
  const handleDeleteUser = (userId) => {

    
    dispatch(deleteUser(userId))
      .then(() => {
        toast.success("User deleted successfully");
      })
      .catch((error) => {
        toast.error(`Error deleting User: ${error.message}`);
      });
  };
  // Filter users based on the organization of the authenticated user
  const filteredUsers = users.filter(user => user.organization === authUser.organization);

  
  
  
  
  if (!myorganization) {
    return <Spinner />;
  }

  return (
    <>
    <div className="mb-10">
    <h1 className="text-xl font-extrabold text-14 mb-10">
          {" "}
          <ViewListIcon /> My Organization Details
        </h1>

        <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Item><strong>Name:</strong> {myorganization.name}</Item>
        </Grid>
        <Grid item xs={6}>
          <Item><strong>Email:</strong> {myorganization.email}</Item>
        </Grid>
        <Grid item xs={6}>
          <Item> <strong>Contact:</strong> {myorganization.contact}</Item>
        </Grid>
        <Grid item xs={6}>
          <Item> <strong>Description:</strong> {myorganization.description}</Item>
        </Grid>
      </Grid>
    </Box>

 
    </div>
    <div className="flex justify-end p-2 md:mx-6 relative">
          <Button
            variant="contained"
            color="primary"
            onClick={openModal}
            style={{ marginBottom: "10px" }}
          >
            <AddCircleOutlineIcon /> Add User
          </Button>
        </div>
    <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Add Issue Modal"
          style={{
            overlay: {
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "flex-end",
              backgroundColor: "rgba(0, 0, 0, 0.3)",
            },
            content: {
              width: "500px",
              height: "300px",
              margin: "0 auto",
              backgroundColor: "white",
              borderRadius: "4px",
              padding: "20px",
            },
          }}
        >
          <Button
            variant="text"
            color="inherit"
            onClick={closeModal}
            style={{ position: "absolute", top: "10px", right: "10px" }}
          >
            <CloseIcon />
          </Button>
          <h2>Add User</h2>
          <form onSubmit={handleCreateUser}>
            <div className="form-group">
              <label htmlFor="name">New Issue Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Name"
                value={name}
                onChange={(e) => setNewUserName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">New user email:</label>
              <input
                type="text"
                id="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">New user password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select
                name="role"
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="">Select One</option> 
                <option value="ORGAGENT">ORGAGENT</option>
              </select>
            </div>
            <div className="form-group">
              <Button type="submit" variant="contained" color="primary">
                Create User
              </Button>
            </div>
          </form>
        </Modal>
        <div>
        <h1 className="text-xl font-extrabold text-14 mb-10">
          {" "}
          <ViewListIcon /> My organization users
        </h1>

        <DataGrid
 rows={filteredUsers.map((user, index) => ({ ...user, id: index }))}
columns={[
  {field: "name", headerName: "User Name", flex:1},
  {field: "email", headerName: "User email", flex: 1},
  {field: "role", headerName: "User role", flex: 1 },
  { 
    field: "organization", 
    headerName: "Organization", 
    width: 200,
    renderCell: (params) => (
      organizationMap[params.value] || "Unassigned"
    )
  },
  {field: "_id", headerName: "User Id", flex: 1},
  {
    field: "actions",
    headerName: "Action",
    flex: 1,
    renderCell: (params) => (
      <div>
        <Link to={`/createuser/${params.row.id}`}>
          <button className="group">
            <ModeEditIcon className="text-blue-500 group-hover:text-blue-700 mr-8" />
          </button>
        </Link>

        <button
          onClick={() => handleDeleteUser(params.row.id)}
          className="group"
        >
          <DeleteIcon className="text-red-500 group-hover:text-red-700 mr-8" />
        </button>
      </div>
    ),
  },
]}
pageSize={5}
  checkboxSelection
  onSelectionModelChange={(newSelection) => {}}
  getRowId={(row) => row.id}
/>
       
      </div>
    </>
  );
};

export default OrganizationDetail;


