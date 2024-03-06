import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Modal from "react-modal";
import { DataGrid } from "@mui/x-data-grid";
import {
  createOrganization,
  deleteOrganization,
  getAllOrganization,
  updateOrganization,
  selectOrganizationById,
} from "../../features/organization/organizationSlice";
import Spinner from "../../components/Spinner";
import { TextField, Typography, Button, Select, MenuItem } from "@mui/material";
import {
  Delete as DeleteIcon,
  ModeEdit as ModeEditIcon,
  Close as CloseIcon,
  AddCircleOutline as AddCircleOutlineIcon,
} from "@mui/icons-material";
import CustomButton from "../../components/CustomButton";

const customStyles = {
  content: {
    width: "600px",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    position: "relative",
    padding: 0,
  },
};

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
  const [newCode, setCode] = useState("");

  const [updateName, setUpdateOrganizationName] = useState("");
  const [updateEmail, setUpdateEmail] = useState("");
  const [updateContact, setUpdateContact] = useState("");
  const [updateFocalPersonName, setUpdateFocalPersonName] = useState("");
  const [updatefocalPersonContact, setUpdateFocalPersonContact] = useState("");
  const [updateFocalPersonEmail, setUpdateFocalPersonEmail] = useState("");
  const [updatePayment, setUpdatePayment] = useState("");
  const [updateCode, setUpdateCode] = useState("");

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
      const selectedOrganization = organizations.find(
        (organization) => organization._id === organizationId
      );
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
      focalPersonContact: selectedOrganizationId
        ? updatefocalPersonContact
        : newFocalPersonContact,
      focalPersonEmail: selectedOrganizationId
        ? updateFocalPersonEmail
        : newFocalPersonEmail,
      focalPersonName: selectedOrganizationId
        ? updateFocalPersonName
        : newFocalPersonName,
      payment: selectedOrganizationId ? updatePayment : payment,
      code: selectedOrganizationId ? updateCode : newCode,
    };

    if (selectedOrganizationId) {
      dispatch(
        updateOrganization({ id: selectedOrganizationId, organizationData })
      )
        .then(() => {
          closeUpdateModal();
          toast.success("Organization updated successfully");
          dispatch(getAllOrganization());
        })
        .catch((error) => {
          toast.error(`Error updating organization: ${error.message}`);
        });
    } else {
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
    {
      field: "organizationName",
      headerName: "Office Name & Location",
      flex: 1.4,
    },
    { field: "organizationEmail", headerName: "Office Email", flex: 1 },
    {
      field: "organizationContact",
      headerName: "Office Contact",
      flex: 1,
    },
    { field: "focalPersonName", headerName: "Focal Person Name", flex: 1 },
    {
      field: "focalPersonContact",
      headerName: "Focal Person Contact",
      flex: 1,
    },
    { field: "focalPersonEmail", headerName: "Focal Person Email", flex: 1 },
    {
      field: "actions",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => (
        <div>
          <CustomButton
            onClick={() => handleUpdateOrganization(params.row.organizationId)}
            icon={<ModeEditIcon />}
          ></CustomButton>
          <CustomButton
            onClick={() => handleDeleteOrganization(params.row.organizationId)}
            icon={<DeleteIcon />}
            color="error"
          ></CustomButton>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="card bg-white rounded-lg border mb-48">
        <div className="card-header p-4 border-b-1 pb-3 flex justify-between">
          <Typography variant="h6">Office List</Typography>
          <Button variant="contained" color="primary" onClick={openModal}>
            <AddCircleOutlineIcon className="me-2" /> Add Office
          </Button>
        </div>
        <div className="p-4">
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
            className={"border text-xs rounded-lg bg-white overflow-hidden"}
            style={{
              ...customStyles,
              zIndex: 1,
              position: "absolute",
            }}
          >
            <div className="p-4 flex justify-between items-center bg-blue-600 text-white">
              <label className="font-semibold uppercase ">Add Office</label>
              <button onClick={closeModal}>
                <CloseIcon />
              </button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="p-4">
                <div className="form-group mb-4">
                  <label htmlFor="name" className="mb-2 block font-semibold">
                    Office Name & Location:
                  </label>
                  <TextField
                    id="name"
                    name="name"
                    className="text-sm w-full"
                    size="small"
                    placeholder="Name"
                    value={newName}
                    onChange={(e) => setNewOrganizationName(e.target.value)}
                  />
                </div>
                <div className="flex gap-4 mb-4">
                  <div className="form-group w-full">
                    <label htmlFor="email" className="mb-2 block font-semibold">
                      Office Email:
                    </label>
                    <TextField
                      id="email"
                      name="email"
                      className="text-sm w-full"
                      size="small"
                      placeholder="Email"
                      value={newEmail}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="form-group w-full">
                    <label
                      htmlFor="contact"
                      className="mb-2 block font-semibold"
                    >
                      Office Contact:
                    </label>
                    <TextField
                      id="contact"
                      name="contact"
                      className="text-sm w-full"
                      size="small"
                      placeholder="Contact"
                      value={newContact}
                      onChange={(e) => setContact(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group mb-4">
                  <label
                    htmlFor="focalPersonName"
                    className="mb-2 block font-semibold"
                  >
                    Focal Person Name:
                  </label>
                  <TextField
                    id="focalPersonName"
                    name="focalPersonName"
                    className="text-sm w-full"
                    size="small"
                    placeholder="Description"
                    value={newFocalPersonName}
                    onChange={(e) => setFocalPersonName(e.target.value)}
                  />
                </div>
                <div className="flex gap-4 mb-4">
                  <div className="form-group w-full">
                    <label
                      htmlFor="focalPersonEmail"
                      className="mb-2 block font-semibold"
                    >
                      Focal Person Email:
                    </label>
                    <TextField
                      id="focalPersonEmail"
                      name="focalPersonEmail"
                      className="text-sm w-full"
                      size="small"
                      placeholder="Focal Person Email"
                      value={newFocalPersonEmail}
                      onChange={(e) => setFocalPersonEmail(e.target.value)}
                    />
                  </div>
                  <div className="form-group w-full">
                    <label
                      htmlFor="focalPersonContact"
                      className="mb-2 block font-semibold"
                    >
                      Focal Person Contact:
                    </label>
                    <TextField
                      id="focalPersonContact"
                      name="focalPersonContact"
                      className="text-sm w-full"
                      size="small"
                      placeholder="Focal Person Contact"
                      value={newFocalPersonContact}
                      onChange={(e) => setFocalPersonContact(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-4 mb-4">
                  <div className="form-group w-full">
                    <label htmlFor="code" className="mb-2 block font-semibold">
                      Office code (2-digit)
                    </label>
                    <TextField
                      id="code"
                      name="code"
                      className="text-sm w-full"
                      size="small"
                      placeholder="Enter 2 digit office code"
                      value={newCode}
                      onChange={(e) => setCode(e.target.value)}
                    />
                  </div>
                  <div className="form-group w-full">
                    <label
                      htmlFor="payment"
                      className="mb-2 block font-semibold"
                    >
                      Payment Type
                    </label>
                    <Select
                      name="payment"
                      id="payment"
                      className="text-sm w-full"
                      size="small"
                      value={payment}
                      onChange={(e) => setPayment(e.target.value)}
                    >
                      <option value="">Select One</option>
                      <option value="Paid">Paid</option>
                      <option value="PaidAmc">Paid AMC</option>
                      <option value="FreeSupport">Free Support</option>
                      <option value="FreeSupportPeriodUnderAMC">
                        Free Support Period Under AMC
                      </option>
                      <option value="SupportContract">Support Contract</option>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="card-footer p-4 border-t-1 space-x-6 text-end">
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
            className={"border text-xs rounded-lg bg-white overflow-hidden"}
            style={{
              ...customStyles,
              zIndex: 1,
              position: "absolute",
            }}
          >
            <div className="p-4 flex justify-between items-center bg-blue-600 text-white">
              <label className="font-semibold uppercase ">Update Office</label>
              <button onClick={closeUpdateModal}>
                <CloseIcon />
              </button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="p-4">
                <div className="form-group mb-4">
                  <label htmlFor="name" className="mb-2 block font-semibold">
                    Office Name & Location
                  </label>
                  <TextField
                    id="name"
                    name="name"
                    className="text-sm w-full"
                    size="small"
                    placeholder="Name"
                    value={updateName}
                    onChange={(e) => setUpdateOrganizationName(e.target.value)}
                  />
                </div>
                <div className="flex gap-4 mb-4">
                  <div className="form-group w-full">
                    <label htmlFor="email" className="mb-2 block font-semibold">
                      Office Email
                    </label>
                    <TextField
                      id="email"
                      name="email"
                      className="text-sm w-full"
                      size="small"
                      placeholder="Email"
                      value={updateEmail}
                      onChange={(e) => setUpdateEmail(e.target.value)}
                    />
                  </div>
                  <div className="form-group w-full">
                    <label
                      htmlFor="contact"
                      className="mb-2 block font-semibold"
                    >
                      Office Contact
                    </label>
                    <TextField
                      id="contact"
                      name="contact"
                      className="text-sm w-full"
                      size="small"
                      placeholder="Contact"
                      value={updateContact}
                      onChange={(e) => setUpdateContact(e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-group mb-4">
                  <label
                    htmlFor="focalPersonName"
                    className="mb-2 block font-semibold"
                  >
                    Focal Person Name:
                  </label>
                  <TextField
                    id="focalPersonName"
                    name="focalPersonName"
                    className="text-sm w-full"
                    size="small"
                    placeholder="Focal Person Name"
                    value={updateFocalPersonName}
                    onChange={(e) => setUpdateFocalPersonName(e.target.value)}
                  />
                </div>
                <div className="flex gap-4 mb-4">
                  <div className="form-group w-full">
                    <label
                      htmlFor="focalPersonEmail"
                      className="mb-2 block font-semibold"
                    >
                      Focal Person Email:
                    </label>
                    <TextField
                      id="focalPersonEmail"
                      name="focalPersonEmail"
                      className="text-sm w-full"
                      size="small"
                      placeholder="Focal Person Email"
                      value={updateFocalPersonEmail}
                      onChange={(e) =>
                        setUpdateFocalPersonEmail(e.target.value)
                      }
                    />
                  </div>
                  <div className="form-group w-full">
                    <label
                      htmlFor="focalPersonContact"
                      className="mb-2 block font-semibold"
                    >
                      Focal Person Contact:
                    </label>
                    <TextField
                      id="focalPersonContact"
                      name="focalPersonContact"
                      className="text-sm w-full"
                      size="small"
                      placeholder="Focal Person Contact"
                      value={updatefocalPersonContact}
                      onChange={(e) =>
                        setUpdateFocalPersonContact(e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="flex gap-4 mb-4">
                  <div className="form-group w-full">
                    <label htmlFor="code" className="mb-2 block font-semibold">
                      Office code (2-digit)
                    </label>
                    <TextField
                      id="code"
                      name="code"
                      className="text-sm w-full"
                      size="small"
                      placeholder="Enter 2 digit office code"
                      value={updateCode}
                      onChange={(e) => setUpdateCode(e.target.value)}
                    />
                  </div>
                  <div className="form-group w-full">
                    <label
                      htmlFor="payment"
                      className="mb-2 block font-semibold"
                    >
                      Payment Type
                    </label>
                    <Select
                      name="payment"
                      id="payment"
                      className="text-sm w-full"
                      size="small"
                      value={updatePayment}
                      onChange={(e) => setUpdatePayment(e.target.value)}
                    >
                      <MenuItem value="">Select One</MenuItem>
                      <MenuItem value="Paid">Paid</MenuItem>
                      <MenuItem value="PaidAmc">Paid AMC</MenuItem>
                      <MenuItem value="FreeSupport">Free Support</MenuItem>
                      <MenuItem value="FreeSupportPeriodUnderAMC">
                        Free Support Period Under AMC
                      </MenuItem>
                      <MenuItem value="SupportContract">
                        Support Contract
                      </MenuItem>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="card-footer p-4 border-t-1 space-x-6 text-end">
                <Button type="submit" variant="contained" color="primary">
                  Update
                </Button>
              </div>
            </form>
          </Modal>

          {/* Delete Confirmation Modal */}
          <Modal
            isOpen={!!isDeleteModalOpen}
            onRequestClose={cancelDelete}
            contentLabel="Delete Office Confirmation Modal"
            className={"border text-xs rounded-lg bg-white overflow-hidden"}
            style={{
              ...customStyles,
              zIndex: 1,
              position: "absolute",
            }}
          >
            <div className="p-4 flex justify-between items-center bg-blue-600 text-white">
              <label className="font-semibold uppercase ">Confirm Delete</label>
              <button onClick={cancelDelete}>
                <CloseIcon />
              </button>
            </div>
            <div className="card-body p-4">
              <p>Are you sure you want to delete {organizationToDelete}?</p>
            </div>
            <div className="card-footer p-4 border-t-1 space-x-6 text-end">
              <Button onClick={confirmDelete} variant="contained" color="error">
                Delete
              </Button>
            </div>
          </Modal>
        </div>
      </div>
    </>
  );
}

export default OrganizationList;
