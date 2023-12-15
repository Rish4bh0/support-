import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Modal from "react-modal";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  fetchAllUsers,
  createUser,
  reset,
  deleteUser,
} from "../features/auth/authSlice";
import BackButton from "../components/BackButton";
import { getAllOrganization } from "../features/organization/organizationSlice";

function UserList() {
  const authUser = useSelector((state) => state.auth.user); // Get the user from the Redux store
  const users = useSelector((state) => state.auth.users);
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

  // Filter users based on the organization of the authenticated user
  const filteredUsers = users.filter(user => user.organization === authUser.organization);

  return (
    <>
      <BackButton url="/" />
      <div>
        <h1>User List</h1>
        <Button
          variant="contained"
          color="primary"
          onClick={openModal}
          style={{ marginBottom: "10px" }}
        >
          Add User
        </Button>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User ID</TableCell>
                <TableCell>User name</TableCell>
                <TableCell>User email</TableCell>
                <TableCell>User role</TableCell>
                <TableCell>Office</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user._id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.organization ? organizationMap[user.organization] : "Unassigned"}</TableCell>
                  <TableCell>
                    <Link to={`/createuser/${user._id}`}>
                      <Button
                        variant="contained"
                        style={{ backgroundColor: "green", marginRight: "8px" }}
                      >
                        <EditIcon style={{ background: "transparent" }} />
                      </Button>
                    </Link>
                    <Button
                      variant="contained"
                      style={{ backgroundColor: "red", marginRight: "8px" }}
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      <DeleteIcon style={{ background: "transparent" }} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
                <option value="SUPERVISOR">SUPERVISOR</option>
                <option value="EMPLOYEE">EMPLOYEE</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="organization">Office</label>
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
                    No office available
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


