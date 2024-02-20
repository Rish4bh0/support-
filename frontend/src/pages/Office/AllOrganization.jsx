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
  updateOrganization,
  selectOrganizationById,
  reset,
} from "../../features/organization/organizationSlice";
import BackButton from "../../components/BackButton";
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
import Spinner from "../../components/Spinner";


function OrganizationList() {
  const organizations = useSelector(
    (state) => state.organizations.organizations
  );
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.organizations
  );
  const userRole = useSelector((state) => state.auth.user.role);
  const [newName, setNewOrganizationName] = useState("");
  const [newEmail, setEmail] = useState("");
  const [newContact, setContact] = useState("");
  const [newFocalPersonName, setFocalPersonName] = useState("");
  const [newFocalPersonContact, setFocalPersonContact] = useState("");
  const [newFocalPersonEmail, setFocalPersonEmail] = useState("");
  const [payment, setPayment] = useState("");
  const [newCode, setCode ] = useState("");
  
  const [updateName, setUpdateOrganizationName] = useState("");
  const [updateEmail, setUpdateEmail] = useState("");
  const [updateContact, setUpdateContact] = useState("");
  const [updateFocalPersonName, setUpdateFocalPersonName] = useState("");
  const [updatefocalPersonContact, setUpdateFocalPersonContact] = useState("");
  const [updateFocalPersonEmail, setUpdateFocalPersonEmail] = useState("");
  const [updatePayment, setUpdatePayment] = useState("");
  const [updateCode, setUpdateCode ] = useState("");
  
  const dispatch = useDispatch();


  // Local state for the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [organizationIdToDelete, setOrganizationIdToDelete] = useState(null);
  const [organizationToDelete, setOrganizationToDelete] = useState(null);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState("");

  useEffect(() => {
    // Load the initial organization list when the component mounts
    dispatch(getAllOrganization());
  }, [dispatch]);

  const handleUpdateOrganization = (organizationId) => {
    setSelectedOrganizationId(organizationId);
  
    // Check if it's a new organization or an existing organization being updated
    if (!organizationId) {
      // It's a new organization, open the modal for creating
      setIsUpdateModalOpen(true);
    } else {
      // It's an existing organization, set the update form state variables
      const selectedOrganization = organizations.find((organization) => organization._id === organizationId);
      if (selectedOrganization) {
        setUpdateOrganizationName(selectedOrganization.name);
        setUpdateEmail(selectedOrganization.email);
        setUpdateContact(selectedOrganization.contact);
        setUpdateFocalPersonContact(selectedOrganization.focalPersonContact);
        setUpdateFocalPersonEmail(selectedOrganization.focalPersonEmail);
        setUpdateFocalPersonName(selectedOrganization.focalPersonName);
        setUpdatePayment(selectedOrganization.payment);
        setUpdateCode(selectedOrganization.code);
      }
  
      // Open the modal for updating
      setIsUpdateModalOpen(true);
    }
  };
  
  
  

  const handleDeleteOrganization = (organizationId, organizationName) => {
    setOrganizationIdToDelete(organizationId);
    setOrganizationToDelete(organizationName);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    const token = "your-token-here";

    dispatch(deleteOrganization(organizationIdToDelete, token))
      .then(() => {
        toast.success(`${organizationToDelete} deleted successfully`);
      })
      .catch((error) => {
        toast.error(`Error deleting ${organizationToDelete}: ${error.message}`);
      })
      .finally(() => {
        setIsDeleteModalOpen(false);
        setOrganizationIdToDelete(null);
      });
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setOrganizationIdToDelete(null);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const openUpdateModal = () => {
    setIsUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedOrganizationId("");
    setNewOrganizationName("");
    setEmail("");
    setContact("");
    setFocalPersonContact("");
    setFocalPersonEmail("");
    setFocalPersonName("");
    setPayment("");

    setUpdateOrganizationName("");
    setUpdateEmail("");
    setUpdateContact("");
    setUpdateFocalPersonContact("");
    setUpdateFocalPersonEmail("");
    setUpdateFocalPersonName("");
    setUpdatePayment("");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrganizationId("");
    setNewOrganizationName("");
    setEmail("");
    setContact("");
    setFocalPersonContact("");
    setFocalPersonEmail("");
    setFocalPersonName("");
    setPayment("");

    setUpdateOrganizationName("");
    setUpdateEmail("");
    setUpdateContact("");
    setUpdateFocalPersonContact("");
    setUpdateFocalPersonEmail("");
    setUpdateFocalPersonName("");
    setUpdatePayment("");
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
  
    const organizationData = {
      name: selectedOrganizationId ? updateName : newName,
      email: selectedOrganizationId ? updateEmail : newEmail,
      contact: selectedOrganizationId ? updateContact : newContact,
      focalPersonContact: selectedOrganizationId ? updatefocalPersonContact : newFocalPersonContact,
      focalPersonEmail: selectedOrganizationId ? updateFocalPersonEmail : newFocalPersonEmail,
      focalPersonName: selectedOrganizationId ? updateFocalPersonName : newFocalPersonName,
      payment: selectedOrganizationId? updatePayment : payment,
      code: selectedOrganizationId? updateCode : newCode,
    };
  
     

    if (selectedOrganizationId) {
      dispatch(updateOrganization({ id: selectedOrganizationId, organizationData }))
        .then(() => {
          closeUpdateModal();
          toast.success("Organization updated successfully");
          dispatch(getAllOrganization());
        })
        .catch((error) => {
          toast.error(`Error updating organization: ${error.message}`);
        });
    } else {
      console.log(organizationData)
      dispatch(createOrganization(organizationData))
     
        .then(() => {
          closeModal();
          toast.success("Organization added");
          dispatch(getAllOrganization());
        })
        .catch((error) => {
          toast.error(`Error creating organization: ${error.message}`);
        });
    }

    setNewOrganizationName("");
    setEmail("");
    setContact("");
    setFocalPersonContact("");
    setFocalPersonEmail("");
    setFocalPersonName("");
    setPayment("");

    setUpdateOrganizationName("");
    setUpdateEmail("");
    setUpdateContact("");
    setUpdateFocalPersonContact("");
    setUpdateFocalPersonEmail("");
    setUpdateFocalPersonName("");
    setUpdatePayment("");
    setSelectedOrganizationId("");
  };

  useEffect(() => {
    dispatch(selectOrganizationById(selectedOrganizationId));
  }, [selectedOrganizationId, dispatch]);


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
    { field: "organizationId", headerName: "Office ID", flex: 1 },
    { field: "organizationName", headerName: "Office Name & Location", flex: 1.4 },
    { field: "organizationEmail", headerName: "Office Email", flex: 1 },
    {
      field: "organizationContact",
      headerName: "Office Contact",
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
           <button onClick={() => handleUpdateOrganization(params.row.organizationId)}>
            <ModeEditIcon className="text-blue-500 group-hover:text-blue-700 mr-8" />
          </button>
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
      <div>
        <h1 className="text-xl font-extrabold text-14">
          {" "}
          <ViewListIcon /> Office List
        </h1>
        <div className="flex justify-end p-2 md:mx-6 relative">
        <Button
          variant="contained"
          color="primary"
          onClick={openModal}
          style={{ marginBottom: "10px" }}
        >
        <AddCircleOutlineIcon />  Add Office
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
          getRowId={(row) => row.id}
  loading={isLoading}
  components={{
    loadingOverlay: () => <Spinner />, // Custom spinner component
  }}
        />
        <Modal
          isOpen={!!isModalOpen}
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
          <h2>Add Office</h2>
          <form onSubmit={handleFormSubmit}>
            <div className="form-group">
              <label htmlFor="name">Office Name & Location:</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Name"
                value={newName}
                onChange={(e) => setNewOrganizationName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Office Email:</label>
              <input
                type="text"
                id="email"
                name="email"
                placeholder="Email"
                value={newEmail}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="contact">Office Contact:</label>
              <input
                type="text"
                id="contact"
                name="contact"
                placeholder="Contact"
                value={newContact}
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
                value={newFocalPersonName}
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
                value={newFocalPersonEmail}
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
                value={newFocalPersonContact}
                onChange={(e) => setFocalPersonContact(e.target.value)}
              />
            </div>
            <div>
              <div className="form-group">
                <label htmlFor="code">Office code (2-digit)</label>
                <input
                type="text"
                id="code"
                name="code"
                placeholder="Enter 2 digit office code"
                value={newCode}
                onChange={(e) => setCode(e.target.value)}
                />
              </div>
            </div>
            <div className="form-group">
            <label htmlFor="payment">Payment Type</label>
            <select
              name="payment"
              id="payment"
              value={payment}
              onChange={(e) => setPayment(e.target.value)}
            >
              <option value="">Select One</option>
              <option value="Paid">Paid</option>
              <option value="PaidAmc">Paid AMC</option>
              <option value="FreeSupport">Free Support</option>
              <option value="FreeSupportPeriodUnderAMC">Free Support Period Under AMC</option>
              <option value="SupportContract">Support Contract</option>
            </select>
          </div>
            
            <div className="form-group">
              <Button type="submit" variant="contained" color="primary">
                Create Office
              </Button>
            </div>
          </form>
        </Modal>

          {/* Update User Modal */}
      <Modal
        isOpen={!!(isUpdateModalOpen && selectedOrganizationId)}
        onRequestClose={closeUpdateModal}
        contentLabel="Update Office Modal"
        style={{
          overlay: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
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
          onClick={closeUpdateModal}
          style={{ position: "absolute", top: "10px", right: "10px" }}
        >
          <CloseIcon />
        </Button>
        <h2>Update Office</h2>
        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
              <label htmlFor="name">Office Name & Location:</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Name"
                value={updateName}
                onChange={(e) => setUpdateOrganizationName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Office Email:</label>
              <input
                type="text"
                id="email"
                name="email"
                placeholder="Email"
                value={updateEmail}
                onChange={(e) => setUpdateEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="contact">Office Contact:</label>
              <input
                type="text"
                id="contact"
                name="contact"
                placeholder="Contact"
                value={updateContact}
                onChange={(e) => setUpdateContact(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="focalPersonName">Focal Person Name:</label>
              <input
                type="text"
                id="focalPersonName"
                name="focalPersonName"
                placeholder="Focal Person Name"
                value={updateFocalPersonName}
                onChange={(e) => setUpdateFocalPersonName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="focalPersonEmail">Focal Person Email:</label>
              <input
                type="text"
                id="focalPersonEmail"
                name="focalPersonEmail"
                placeholder="Focal Person Email"
                value={updateFocalPersonEmail}
                onChange={(e) => setUpdateFocalPersonEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="focalPersonContact">Focal Person Contact:</label>
              <input
                type="text"
                id="focalPersonContact"
                name="focalPersonContact"
                placeholder="Focal Person Contact"
                value={updatefocalPersonContact}
                onChange={(e) => setUpdateFocalPersonContact(e.target.value)}
              />
            </div>
            <div>
              <div className="form-group">
                <label htmlFor="code">Office code (2-digit)</label>
                <input
                type="text"
                id="code"
                name="code"
                placeholder="Enter 2 digit office code"
                value={updateCode}
                onChange={(e) => setUpdateCode(e.target.value)}
                />
              </div>
            </div>
            <div className="form-group">
            <label htmlFor="payment">Payment Type</label>
            <select
              name="payment"
              id="payment"
              value={updatePayment}
              onChange={(e) => setUpdatePayment(e.target.value)}
            >
              <option value="">Select One</option>
              <option value="Paid">Paid</option>
              <option value="PaidAmc">Paid AMC</option>
              <option value="FreeSupport">Free Support</option>
              <option value="FreeSupportPeriodUnderAMC">Free Support Period Under AMC</option>
              <option value="SupportContract">Support Contract</option>
            </select>
          </div>
          <div className="form-group">
            <Button type="submit" variant="contained" color="primary">
              Update Office
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!isDeleteModalOpen}
        onRequestClose={cancelDelete}
        contentLabel="Delete Office Confirmation Modal"
        style={{
          overlay: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
          },
          content: {
            width: "370px",
            height: "160px",
            backgroundColor: "white",
            borderRadius: "4px",
            padding: "20px",
            position: "relative",
          },
        }}
      >
        <Button
          onClick={cancelDelete}
          style={{
            position: "absolute",
            top: "10px",
            right: "2px",
          }}
        >
          <CloseIcon />
        </Button>
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to delete {organizationToDelete}?</p>
        <Button
          style={{
            top: "20px",
          }}
          onClick={confirmDelete}
          variant="contained"
          color="primary"
        >
          Yes, Delete
        </Button>
      </Modal>
      </div>
    </>
  );
}

export default OrganizationList;
