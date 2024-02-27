import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Modal from "react-modal";
import { Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import ViewListIcon from "@mui/icons-material/ViewList";
import {
  fetchAllUsers,
  createUser,
  deleteUser,
  updateUser,
  selectUserById,
} from "../../features/auth/authSlice";
import { DataGrid } from "@mui/x-data-grid";
import { getAllOrganization } from "../../features/organization/organizationSlice";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Spinner from "../../components/Spinner";
import { TextField } from "@mui/material";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

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

function UserList() {
  const users = useSelector((state) => state.auth.users);
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );
  const organizations = useSelector(
    (state) => state.organizations.organizations
  );
  const organizationMap = {};

  organizations.forEach((organization) => {
    organizationMap[organization._id] = organization.name;
  });

  const userRole = useSelector((state) => state.auth.user.role);

  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserOrganization, setNewUserOrganization] = useState("");

  const [updateUserName, setUpdateUserName] = useState("");
  const [updateUserEmail, setUpdateUserEmail] = useState("");
  const [updateUserRole, setUpdateUserRole] = useState("");
  const [updateUserPassword, setUpdateUserPassword] = useState("");
  const [updateUserOrganization, setUpdateUserOrganization] = useState("");

  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [userNameToDelete, setUserNameToDelete] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState("");

  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(getAllOrganization());
  }, [dispatch]);

  const handleUpdateUser = (userId) => {
    setSelectedUserId(userId);

    // Check if it's a new user or an existing user being updated
    if (!userId) {
      // It's a new user, open the modal for creating
      setIsUpdateModalOpen(true);
    } else {
      // It's an existing user, set the update form state variables
      const selectedUser = users.find((user) => user._id === userId);
      if (selectedUser) {
        setUpdateUserName(selectedUser.name);
        setUpdateUserEmail(selectedUser.email);
        setUpdateUserRole(selectedUser.role);
        setUpdateUserOrganization(selectedUser.organization);
      }

      // Open the modal for updating
      setIsUpdateModalOpen(true);
    }
  };

  const handleDeleteUser = (userId, userName) => {
    setUserIdToDelete(userId);
    setUserNameToDelete(userName);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    const token = "your-token-here";

    dispatch(deleteUser(userIdToDelete, token))
      .then(() => {
        toast.success(`${userNameToDelete} deleted successfully`);
      })
      .catch((error) => {
        toast.error(`Error deleting ${userNameToDelete}: ${error.message}`);
      })
      .finally(() => {
        setIsDeleteModalOpen(false);
        setUserIdToDelete(null);
      });
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setUserIdToDelete(null);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const openUpdateModal = () => {
    setIsUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedUserId("");
    setNewUserName("");
    setNewUserEmail("");
    setNewUserRole("");
    setNewUserPassword("");
    setNewUserOrganization("");

    setUpdateUserName("");
    setUpdateUserEmail("");
    setUpdateUserRole("");
    setUpdateUserPassword("");
    setUpdateUserOrganization("");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUserId("");
    setNewUserName("");
    setNewUserEmail("");
    setNewUserRole("");
    setNewUserPassword("");
    setNewUserOrganization("");

    setUpdateUserName("");
    setUpdateUserEmail("");
    setUpdateUserRole("");
    setUpdateUserPassword("");
    setUpdateUserOrganization("");
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const userData = {
      name: selectedUserId ? updateUserName : newUserName,
      email: selectedUserId ? updateUserEmail : newUserEmail,
      role: selectedUserId ? updateUserRole : newUserRole,
      password: selectedUserId ? updateUserPassword : newUserPassword,
      organization: selectedUserId
        ? updateUserOrganization
        : newUserOrganization,
    };

    if (selectedUserId) {
      dispatch(updateUser({ id: selectedUserId, userData }))
        .then(() => {
          closeUpdateModal();
          toast.success("User updated successfully");
          dispatch(fetchAllUsers());
        })
        .catch((error) => {
          toast.error(`Error updating user: ${error.message}`);
        });
    } else {
      dispatch(createUser(userData))
        .then(() => {
          closeModal();
          toast.success("User added");
          dispatch(fetchAllUsers());
        })
        .catch((error) => {
          toast.error(`Error creating user: ${error.message}`);
        });
    }

    setNewUserName("");
    setNewUserEmail("");
    setNewUserPassword("");
    setNewUserRole("");
    setNewUserOrganization("");
    setUpdateUserName("");
    setUpdateUserEmail("");
    setUpdateUserPassword("");
    setUpdateUserRole("");
    setUpdateUserOrganization("");
    setSelectedUserId("");
  };

  useEffect(() => {
    dispatch(selectUserById(selectedUserId));
  }, [selectedUserId, dispatch]);

  /*

  if (!["ADMIN", "SUPERVISOR", "EMPLOYEE"].includes(userRole)) {
    return (
      <div>
        <h1>Unauthorized Access</h1>
        <p>You do not have permission to access this page.</p>
      </div>
    );
  }
*/
  return (
    <>
      <div className="border border-gray-300 rounded-2xl bg-white w-full mb-48">
        <div className="border-b-1 p-4 text-sm flex justify-between">
          <div className="font-extrabold">User List</div>
          <Button variant="contained" color="primary" onClick={openModal}>
            <AddCircleOutlineIcon className="me-2" /> Add User
          </Button>
        </div>
        <div className="p-4">
          <DataGrid
            rows={users.map((user, index) => ({ ...user, id: index }))}
            columns={[
              { field: "name", headerName: "User Name", flex: 1 },
              { field: "email", headerName: "User email", flex: 1 },
              { field: "role", headerName: "User role", flex: 1 },
              {
                field: "organization",
                headerName: "Office",
                width: 200,
                renderCell: (params) =>
                  organizationMap[params.value] || "Unassigned",
              },
              { field: "_id", headerName: "User Id", flex: 1 },
              {
                field: "actions",
                headerName: "Action",
                flex: 1,
                renderCell: (params) => (
                  <div>
                    <button onClick={() => handleUpdateUser(params.row._id)}>
                      <ModeEditIcon className="text-blue-500 group-hover:text-blue-700 mr-8" />
                    </button>

                    <button
                      onClick={() =>
                        handleDeleteUser(params.row._id, params.row.name)
                      }
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
            loading={isLoading}
            components={{
              loadingOverlay: () => <Spinner />, // Custom spinner component
            }}
          />

          {/* Add User Modal */}
          <Modal
            isOpen={!!isModalOpen}
            onRequestClose={closeModal}
            contentLabel="Add User Modal"
            className={"border text-xs rounded-lg bg-white overflow-hidden"}
            style={{
              ...customStyles,
              zIndex: 1,
              position: "absolute",
            }}
          >
            <div className="p-4 flex justify-between items-center bg-blue-600 text-white">
              <label className="font-semibold uppercase ">Add User</label>
              <button onClick={closeModal}>
                <CloseIcon />
              </button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="card-body p-4">
                <div className="form-group mb-4">
                  <label htmlFor="name" className="mb-2 block font-semibold">
                    Name
                  </label>
                  <TextField
                    id="name"
                    name="name"
                    className="text-sm w-full"
                    size="small"
                    placeholder="Enter name"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                  />
                </div>
                <div className="form-group mb-4">
                  <label htmlFor="email" className="mb-2 block font-semibold">
                    Email Address
                  </label>
                  <TextField
                    type="text"
                    id="email"
                    name="email"
                    className="text-sm w-full px-2 py-1"
                    size="small"
                    placeholder="Enter email address"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                  />
                </div>
                <div className="form-group mb-4">
                  <label
                    htmlFor="password"
                    className="mb-2 block font-semibold"
                  >
                    Enter password
                  </label>
                  <TextField
                    type="password"
                    id="password"
                    name="password"
                    value={newUserPassword}
                    placeholder="Enter your password"
                    className="text-sm w-full"
                    size="small"
                    onChange={(e) => setNewUserPassword(e.target.value)}
                  />
                </div>
                <div className="flex gap-4">
                  <div className="form-group w-full">
                    <label htmlFor="role" className="mb-2 block font-semibold">
                      Role
                    </label>
                    <Select
                      name="role"
                      id="role"
                      className="text-sm w-full"
                      size="small"
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value)}
                    >
                      <MenuItem value="">Select One</MenuItem>
                      {[
                        "USER",
                        "ADMIN",
                        "SUPERVISOR",
                        "EMPLOYEE",
                        "ORGAGENT",
                      ].map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </div>
                  <div className="form-group w-full">
                    <label
                      htmlFor="organization"
                      className="mb-2 block font-semibold"
                    >
                      Office
                    </label>
                    <Select
                      name="organization"
                      id="organization"
                      className="text-sm w-full"
                      size="small"
                      value={newUserOrganization}
                      onChange={(e) => setNewUserOrganization(e.target.value)}
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
                  </div>
                </div>
              </div>
              <div className="card-footer p-4 border-t-1 space-x-6 text-end">
                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>
              </div>
            </form>
          </Modal>

          {/* Update User Modal */}
          <Modal
            isOpen={!!(isUpdateModalOpen && selectedUserId)}
            onRequestClose={closeUpdateModal}
            contentLabel="Update User Modal"
            className={"border text-xs rounded-lg bg-white overflow-hidden"}
            style={{
              ...customStyles,
              zIndex: 1,
              position: "absolute",
            }}
          >
            <div className="p-4 flex justify-between items-center bg-blue-600 text-white">
              <label className="font-semibold uppercase ">Update User</label>
              <button onClick={closeUpdateModal}>
                <CloseIcon />
              </button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="card-body p-4">
                <div className="form-group mb-4">
                  <label htmlFor="name" className="mb-2 block font-semibold">
                    Name
                  </label>
                  <TextField
                    id="name"
                    name="name"
                    className="text-sm w-full"
                    size="small"
                    placeholder="Name"
                    value={updateUserName}
                    onChange={(e) => setUpdateUserName(e.target.value)}
                  />
                </div>
                <div className="form-group mb-4">
                  <label htmlFor="email" className="mb-2 block font-semibold">
                    Email Address
                  </label>
                  <TextField
                    id="email"
                    name="email"
                    className="text-sm w-full"
                    size="small"
                    placeholder="Email"
                    value={updateUserEmail}
                    onChange={(e) => setUpdateUserEmail(e.target.value)}
                  />
                </div>
                <div className="form-group mb-4">
                  <label
                    htmlFor="password"
                    className="mb-2 block font-semibold"
                  >
                    Enter password
                  </label>
                  <TextField
                    type="password"
                    id="password"
                    name="password"
                    className="text-sm w-full"
                    size="small"
                    value={updateUserPassword}
                    placeholder="Enter your password"
                    onChange={(e) => setUpdateUserPassword(e.target.value)}
                  />
                </div>
                <div className="flex gap-4">
                  <div className="form-group w-full">
                    <label htmlFor="role" className="mb-2 block font-semibold">
                      Role
                    </label>
                    <Select
                      name="role"
                      id="role"
                      className="text-sm w-full"
                      size="small"
                      value={updateUserRole}
                      onChange={(e) => setUpdateUserRole(e.target.value)}
                    >
                      <MenuItem value="">Select One</MenuItem>
                      {[
                        "USER",
                        "ADMIN",
                        "SUPERVISOR",
                        "EMPLOYEE",
                        "ORGAGENT",
                      ].map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </div>
                  <div className="form-group w-full">
                    <label
                      htmlFor="organization"
                      className="mb-2 block font-semibold"
                    >
                      Office
                    </label>
                    <Select
                      name="organization"
                      id="organization"
                      className="text-sm w-full"
                      size="small"
                      value={updateUserOrganization}
                      onChange={(e) =>
                        setUpdateUserOrganization(e.target.value)
                      }
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
                  </div>
                </div>
              </div>
              <div className="card-footer p-4 border-t-1 space-x-6 text-end">
                <Button type="submit" variant="contained" color="primary">
                  Update User
                </Button>
              </div>
            </form>
          </Modal>

          {/* Delete Confirmation Modal */}
          <Modal
            isOpen={!!isDeleteModalOpen}
            onRequestClose={cancelDelete}
            contentLabel="Delete User Confirmation Modal"
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
              <p>Are you sure you want to delete {userNameToDelete}?</p>
            </div>
            <div className="card-footer p-4 border-t-1 space-x-6 text-end">
              <Button onClick={confirmDelete} variant="contained" color="error">
                Yes, Delete
              </Button>
            </div>
          </Modal>
        </div>
      </div>
    </>
  );
}

export default UserList;
