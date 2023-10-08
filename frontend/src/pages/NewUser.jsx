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

function UserList() {
  const users = useSelector((state) => state.auth.users);
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth.users
  );
  const userRole = useSelector(state => state.auth.user.role); // Retrieve the user's role from Redux state
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
    // Load the initial issue list when the component mounts
    dispatch(fetchAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess) {
      dispatch(reset());
    }
  }, [dispatch, isError, isSuccess, message]);

  // Function to handle form submission for creating a new issue
  const handleCreateUser = (e) => {
    e.preventDefault();
    // Dispatch the createIssueType action with the new issue name
    dispatch(createUser({ name, email, password, role}));

    // Clear the input field after creating the issue
    setNewUserName("");
    closeModal();
  };
  // Function to handle issue deletion
  const handleDeleteUser = (userId) => {
    const token = // Retrieve the user token from your authentication system
      dispatch(deleteUser(userId, token))
        .then(() => {
          // Optionally, you can show a success message here.
          toast.success("User deleted successfully");
        })
        .catch((error) => {
          // Handle the error and display it to the user, if necessary.
          toast.error(`Error deleting User: ${error.message}`);
        });
  };

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

 // Check if the user has one of the allowed roles
 if (!["ADMIN", "SUPERVISOR", "EMPLOYEE"].includes(userRole)) {
  // Handle unauthorized access, e.g., redirect or show an error message
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
        <h1>User List</h1>

        {/* Add Issue Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={openModal}
          style={{ marginBottom: "10px" }}
        >
          Add User
        </Button>

        {/* Table View */}
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
              {users.map((user) => (
                <TableRow key={user._id}>
                    <TableCell>{user._id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{user.organization}</TableCell>
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

        {/* Add Issue Modal */}
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
          {/* Close button */}
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
              <option value="ADMIN">ADMIN</option>
              <option value="USER">USER</option>
              <option value="SUPERVISOR">SUPERVISOR</option>
              <option value="EMPLOYEE">EMPLOYEE</option>
            </select>
          </div>

           
            <div className="form-group">
              <Button type="submit" variant="contained" color="primary">
                Create Issue
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </>
  );
}

export default UserList;
