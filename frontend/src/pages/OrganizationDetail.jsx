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
  Paper,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
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
    <div>
      <h2>Organization Details</h2>
      <Button
          variant="contained"
          color="primary"
          onClick={openModal}
          style={{ marginBottom: "10px" }}
        >
          Add User
        </Button>
      <ul>
        <li>
          <strong>Name:</strong> {myorganization.name}
        </li>
        <li>
          <strong>Email:</strong> {myorganization.email}
        </li>
        <li>
          <strong>Contact:</strong> {myorganization.contact}
        </li>
        <li>
          <strong>Description:</strong> {myorganization.description}
        </li>
      </ul>
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
        <h1>User List</h1>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User ID</TableCell>
                <TableCell>User name</TableCell>
                <TableCell>User email</TableCell>
                <TableCell>User role</TableCell>
                <TableCell>Organization</TableCell>
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
       
      </div>
    </>
  );
};

export default OrganizationDetail;
