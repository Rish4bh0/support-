import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Modal from "react-modal";
import {
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import {
  fetchAllUsers,
  createUser,
  reset,
  deleteUser,
} from "../features/auth/authSlice";
import BackButton from "../components/BackButton";
import { DataGrid } from "@mui/x-data-grid";
import { getAllOrganization } from "../features/organization/organizationSlice";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ViewListIcon from "@mui/icons-material/ViewList";

function UserList() {
  const users = useSelector((state) => state.auth.users);
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth.users
  );
  const organizations = useSelector((state) => state.organizations.organizations);
  const organizationMap = {};

  // Create a mapping of organization IDs to their names
  organizations.forEach((organization) => {
    organizationMap[organization._id] = organization.name;
  });
  const userRole = useSelector(state => state.auth.user.role);
  const [name, setNewUserName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [organization, setOrganization] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Local state for the modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(getAllOrganization());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess) {
      dispatch(reset());
    }
  }, [dispatch, isError, isSuccess, message]);

  const handleCreateUser = (e) => {
    e.preventDefault();
    console.log(role, organization)
    dispatch(createUser({ name, email, password, role, organization }));
    setNewUserName("");
    setEmail("");
    setPassword("");
    setRole(""); // Clear the role input field
    setOrganization(""); // Clear the organization input field
    closeModal();
  };

  const handleDeleteUser = (userId) => {
    // Retrieve the user token from your authentication system
    const token = 'your-token-here';
    
    dispatch(deleteUser(userId, token))
      .then(() => {
        toast.success("User deleted successfully");
      })
      .catch((error) => {
        toast.error(`Error deleting User: ${error.message}`);
      });
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (!["ADMIN", "SUPERVISOR", "EMPLOYEE"].includes(userRole)) {
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
      <div>
      <h1 className="text-xl font-extrabold text-14">
          {" "}
          <ViewListIcon /> User List
        </h1>
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
        <DataGrid
  rows={users.map((user, index) => ({ ...user, id: index }))}
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
          <Link to={`/createuser/${params.row._id}`}>
            <button className="group">
              <ModeEditIcon className="text-blue-500 group-hover:text-blue-700 mr-8" />
            </button>
          </Link>

          <button
            onClick={() => handleDeleteUser(params.row._id)}
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
              height: "600px",
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
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
                <option value="SUPERVISOR">SUPERVISOR</option>
                <option value="EMPLOYEE">EMPLOYEE</option>
                <option value="ORGAGENT">ORGAGENT</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="organization">Organization</label>
              <select
                name="organization"
                id="organization"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
              >
                <option value="">Select One</option>
                {organizations && organizations.length > 0 ? (
                  organizations.map((organization) => (
                    <option key={organization._id} value={organization._id}>
                      {organization.name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    No organization available
                  </option>
                )}
              </select>
            </div>
            <div className="form-group">
              <Button type="submit" variant="contained" color="primary">
                Create User
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </>
  );
}

export default UserList;

