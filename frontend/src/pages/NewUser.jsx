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
import { fetchAllUsers, createUser, reset, deleteUser, updateUser, selectUserById } from "../features/auth/authSlice";
import BackButton from "../components/BackButton";
import { DataGrid } from "@mui/x-data-grid";
import { getAllOrganization } from "../features/organization/organizationSlice";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Spinner from "../components/Spinner";

function UserList() {
  const users = useSelector((state) => state.auth.users);
  const { isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);
  const organizations = useSelector((state) => state.organizations.organizations);
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
      organization: selectedUserId ? updateUserOrganization : newUserOrganization,
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
            onClick={() => handleDeleteUser(params.row._id, params.row.name)}
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
          onClick={closeModal}
          style={{ position: "absolute", top: "10px", right: "10px" }}
        >
          <CloseIcon />
        </Button>
        <h2>Add User</h2>
        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Name"
              value={newUserName}
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
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">New user password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={newUserPassword}
              placeholder="Enter your password"
              onChange={(e) => setNewUserPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              name="role"
              id="role"
              value={newUserRole}
              onChange={(e) => setNewUserRole(e.target.value)}
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
            <label htmlFor="organization">Office</label>
            <select
              name="organization"
              id="organization"
              value={newUserOrganization}
              onChange={(e) => setNewUserOrganization(e.target.value)}
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

      {/* Update User Modal */}
      <Modal
        isOpen={!!(isUpdateModalOpen && selectedUserId)}
        onRequestClose={closeUpdateModal}
        contentLabel="Update User Modal"
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
        <h2>Update User</h2>
        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Name"
              value={updateUserName}
              onChange={(e) => setUpdateUserName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="text"
              id="email"
              name="email"
              placeholder="Email"
              value={updateUserEmail}
              onChange={(e) => setUpdateUserEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">New user password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={updateUserPassword}
              placeholder="Enter your password"
              onChange={(e) => setUpdateUserPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Role:</label>
            <select
              name="role"
              id="role"
              value={updateUserRole}
              onChange={(e) => setUpdateUserRole(e.target.value)}
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
              <option value="SUPERVISOR">SUPERVISOR</option>
              <option value="EMPLOYEE">EMPLOYEE</option>
              <option value="ORGAGENT">ORGAGENT</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="organization">Office:</label>
            <select
              name="organization"
              id="organization"
              value={updateUserOrganization}
              onChange={(e) => setUpdateUserOrganization(e.target.value)}
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
        <p>Are you sure you want to delete {userNameToDelete}?</p>
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

export default UserList;
