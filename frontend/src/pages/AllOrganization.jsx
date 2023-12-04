import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Modal from "react-modal";
import { DataGrid } from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";
import { Button, Paper } from "@mui/material";
import {
  createOrganization,
  deleteOrganization,
  getAllOrganization,
  reset,
} from "../features/organization/organizationSlice";
import BackButton from "../components/BackButton";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import ViewListIcon from "@mui/icons-material/ViewList";
import VisibilityIcon from '@mui/icons-material/Visibility';
import {

  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,

} from "@mui/material";


function OrganizationList() {
  const organizations = useSelector(
    (state) => state.organizations.organizations
  );
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.organizations
  );
  const userRole = useSelector((state) => state.auth.user.role);
  const [name, setNewOrganizationName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [focalPersonName, setFocalPersonName] = useState("");
  const [focalPersonContact, setFocalPersonContact] = useState("");
  const [focalPersonEmail, setFocalPersonEmail] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Local state for the modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Load the initial organization list when the component mounts
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

  // Function to handle form submission for creating a new organization
  const handleCreateOrganization = (e) => {
    e.preventDefault();
    dispatch(createOrganization({ name, email, contact, focalPersonName, focalPersonContact, focalPersonEmail }));

    // Clear the input fields after creating the organization
    setNewOrganizationName("");
    setEmail("");
    setContact("");
    setFocalPersonContact("");
    setFocalPersonEmail("");
    setFocalPersonName("");
    closeModal();
  };

  // Function to handle organization deletion
  const handleDeleteOrganization = (organizationId) => {
    dispatch(deleteOrganization(organizationId))
      .then(() => {
        toast.success("Organization deleted successfully");
      })
      .catch((error) => {
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

  const columns = [
    { field: "organizationId", headerName: "Organization ID", flex: 1 },
    { field: "organizationName", headerName: "Organization Name & Location", flex: 1.4 },
    { field: "organizationEmail", headerName: "Organization Email", flex: 1 },
    {
      field: "organizationContact",
      headerName: "Organization Contact",
      flex: 1,
    },
    { field: "focalPersonName", headerName: "Focal Person Name", flex: 1 },
    { field: "focalPersonContact", headerName: "Focal Person Contact", flex: 1 },
    { field: "focalPersonEmail", headerName: "Focal Person Email", flex: 1 },

    {
      field: "actions",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => (
        <div>
          <Link to={`/organization/${params.row.organizationId}`}>
          <button className="group">
                      <ModeEditIcon className="text-blue-500 group-hover:text-blue-700 mr-8" />
                    </button>
          </Link>
          <button
             className="group"
            onClick={() => handleDeleteOrganization(params.row.organizationId)}
          >
            <DeleteIcon className="text-red-500 group-hover:text-red-700 mr-8"/>
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <BackButton url="/" />
      <div>
        <h1 className="text-xl font-extrabold text-14">
          {" "}
          <ViewListIcon /> Organization List
        </h1>
        <div className="flex justify-end p-2 md:mx-6 relative">
        <Button
          variant="contained"
          color="primary"
          onClick={openModal}
          style={{ marginBottom: "10px" }}
        >
        <AddCircleOutlineIcon />  Add Organization
        </Button>
        </div>
        <DataGrid
          rows={organizations.map((organization) => ({
            ...organization,
            id: organization._id, // Ensure each row has a unique id
            organizationId: organization._id, 
            organizationName: organization.name,
            organizationEmail: organization.email,
            organizationContact: organization.contact,
            focalPersonName: organization.focalPersonName,
            focalPersonEmail: organization.focalPersonEmail,
            focalPersonContact: organization.focalPersonContact,
          }))}
          columns={columns}
          pageSize={5}
          checkboxSelection
          onSelectionModelChange={(newSelection) => {
            // Handle selection changes if needed
          }}
        />
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Add Organization Modal"
          style={{
            overlay: {
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "flex-end",
              backgroundColor: "rgba(0, 0, 0, 0.3)",
            },
            content: {
              width: "500px",
              height: "500px",
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
              <label htmlFor="name">Organization Name & Location:</label>
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
              <label htmlFor="email">Organization Email:</label>
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
              <label htmlFor="contact">Organization Contact:</label>
              <input
                type="text"
                id="contact"
                name="contact"
                placeholder="Contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="focalPersonName">Focal Person Name:</label>
              <input
                type="text"
                id="focalPersonName"
                name="focalPersonName"
                placeholder="Description"
                value={focalPersonName}
                onChange={(e) => setFocalPersonName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="focalPersonEmail">Focal Person Email:</label>
              <input
                type="text"
                id="focalPersonEmail"
                name="focalPersonEmail"
                placeholder="Focal Person Email"
                value={focalPersonEmail}
                onChange={(e) => setFocalPersonEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="focalPersonContact">Focal Person Contact:</label>
              <input
                type="text"
                id="focalPersonContact"
                name="focalPersonContact"
                placeholder="Focal Person Contact"
                value={focalPersonContact}
                onChange={(e) => setFocalPersonContact(e.target.value)}
              />
            </div>
            <div className="form-group">
              <Button type="submit" variant="contained" color="primary">
                Create Organization
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </>
  );
}

export default OrganizationList;
