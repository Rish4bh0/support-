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
  getAllOrganization,
  createOrganization,
  reset,
  deleteOrganization,
} from "../features/organization/organizationSlice";
import BackButton from "../components/BackButton";

function OrganizationList() {
  const organizations = useSelector((state) => state.organizations.organizations);
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.organizations
  );
  const userRole = useSelector(state => state.auth.user.role);
  const organizationId = useSelector(state => state.auth.user.organization); // Retrieve the user's organization ID from Redux state

  // Filter organizations to include only the organization with the user's organizationId
  const userOrganization = organizations.find(org => org._id === organizationId);

  const [name, setNewOrganizationName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [description, setDescription] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Local state for the modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Load the initial issue list when the component mounts
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




 

  // Check if the user has one of the allowed roles
  if (!["ADMIN", "SUPERVISOR", "EMPLOYEE", "ORGAGENT"].includes(userRole)) {
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
        <h1>Organization List</h1>


        {/* Table View */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Organization ID</TableCell>
                <TableCell>Organization name</TableCell>
                <TableCell>Organization email</TableCell>
                <TableCell>Organization contact</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userOrganization && (
                <TableRow key={userOrganization._id}>
                  <TableCell>{userOrganization._id}</TableCell>
                  <TableCell>{userOrganization.name}</TableCell>
                  <TableCell>{userOrganization.email}</TableCell>
                  <TableCell>{userOrganization.contact}</TableCell>
                  <TableCell>{userOrganization.description}</TableCell>
                  <TableCell>
                    <Link to={`/organization/${userOrganization._id}`}>
                      <Button
                        variant="contained"
                        style={{ backgroundColor: "green", marginRight: "8px" }}
                      >
                        <EditIcon style={{ background: "transparent" }} />
                      </Button>
                    </Link>
                    <Link to={`/organizations/${userOrganization._id}`}>
                      <Button
                        variant="contained"
                        style={{ backgroundColor: "blue", marginRight: "8px" }}
                      >
                        <EditIcon style={{ background: "transparent" }} />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
}

export default OrganizationList;


/*
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
  getAllOrganization,
  createOrganization,
  reset,
  deleteOrganization,
} from "../features/organization/organizationSlice";
import BackButton from "../components/BackButton";

function OrganizationList() {
  const organizations = useSelector((state) => state.organizations.organizations);
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.organizations
  );
  const userRole = useSelector(state => state.auth.user.role); // Retrieve the user's role from Redux state
  const [name, setNewOrganizationName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [description, setDescription] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Local state for the modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Load the initial issue list when the component mounts
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

  // Function to handle form submission for creating a new issue
  const handleCreateOrganization = (e) => {
    e.preventDefault();
    // Dispatch the createIssueType action with the new issue name
    dispatch(createOrganization({ name, email, contact, description }));

    // Clear the input field after creating the issue
    setNewOrganizationName("");
    closeModal();
  };
  // Function to handle issue deletion
  const handleDeleteOrganization = (organizationId) => {
    const token = // Retrieve the user token from your authentication system
      dispatch(deleteOrganization(organizationId, token))
        .then(() => {
          // Optionally, you can show a success message here.
          toast.success("Organization deleted successfully");
        })
        .catch((error) => {
          // Handle the error and display it to the user, if necessary.
          toast.error(`Error deleting organization: ${error.message}`);
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
        <h1>Organization List</h1>
        <Button
          variant="contained"
          color="primary"
          onClick={openModal}
          style={{ marginBottom: "10px" }}
        >
          Add Organization
        </Button>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Organization ID</TableCell>
                <TableCell>Organization name</TableCell>
                <TableCell>Organization email</TableCell>
                <TableCell>Organization contact</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {organizations.map((organization) => (
                <TableRow key={organization._id}>
                    <TableCell>{organization._id}</TableCell>
                    <TableCell>{organization.name}</TableCell>
                    <TableCell>{organization.email}</TableCell>
                    <TableCell>{organization.contact}</TableCell>
                    <TableCell>{organization.description}</TableCell>
                  <TableCell>
                    <Link to={`/organization/${organization._id}`}>
                      <Button
                        variant="contained"
                        style={{ backgroundColor: "green", marginRight: "8px" }}
                      >
                        <EditIcon style={{ background: "transparent" }} />
                      </Button>
                    </Link>
                    <Link to={`/organizations/${organization._id}`}>
                      <Button
                        variant="contained"
                        style={{ backgroundColor: "blue", marginRight: "8px" }}
                      >
                        <EditIcon style={{ background: "transparent" }} />
                      </Button>
                    </Link>
                    <Button
                      variant="contained"
                      style={{ backgroundColor: "red", marginRight: "8px" }}
                      onClick={() => handleDeleteOrganization(organization._id)}
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

          <h2>Add Organization</h2>
          <form onSubmit={handleCreateOrganization}>
            <div className="form-group">
              <label htmlFor="name">New Issue Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Name"
                value={name}
                onChange={(e) => setNewOrganizationName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">New Organization email:</label>
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
              <label htmlFor="contact">New Organization contact:</label>
              <input
                type="number"
                id="contact"
                name="contact"
                placeholder="Contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">New Organization discription:</label>
              <input
                type="text"
                id="description"
                name="description"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
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

export default OrganizationList;
*/