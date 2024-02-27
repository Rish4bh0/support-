import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import Spinner from "../../components/Spinner";
import {
  getAllOrganization,
  selectOrganizationById,
} from "../../features/organization/organizationSlice";
import {
  createUser,
  deleteUser,
  fetchAllUsers,
  reset,
} from "../../features/auth/authSlice";
import CloseIcon from "@mui/icons-material/Close";
import Modal from "react-modal";
import { Typography, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import { DataGrid } from "@mui/x-data-grid";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ViewListIcon from "@mui/icons-material/ViewList";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

const OrganizationDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [name, setNewUserName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const organizations = useSelector(
    (state) => state.organizations.organizations
  );
  const organizationMap = {};
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));
  // Create a mapping of organization IDs to their names
  organizations.forEach((organization) => {
    organizationMap[organization._id] = organization.name;
  });
  const authUser = useSelector((state) => state.auth.user);
  const myorganization = useSelector(
    (state) => state.organizations.selectedOrganization
  );

  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [userNameToDelete, setUserNameToDelete] = useState(null);
  const users = useSelector((state) => state.auth.users);
  const openModal = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
  }, [dispatch, isError, message]);

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
    console.log(role, id);
    dispatch(createUser({ name, email, password, role, organization: id }))
      .then(() => {
        // After successfully creating a new user, fetch all users
        dispatch(fetchAllUsers());

        toast.success("User created successfully");
        closeModal();
        dispatch(reset());
      })
      .catch((error) => {
        toast.error(`Error creating User: ${error.message}`);
      });
    setNewUserName("");
    setEmail("");
    setPassword("");
    setRole(""); // Clear the role input field
    closeModal();
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
  // Filter users based on the organization of the authenticated user
  const filteredUsers = users.filter(
    (user) => user.organization === authUser.organization
  );

  if (!myorganization) {
    return <Spinner />;
  }

  return (
    <>
      <div className="card bg-white rounded-lg border mb-4">
        <div className="card-header p-4 border-b-1 pb-3">
          <Typography variant="h6">My Office Details</Typography>
        </div>

        <Box sx={{ flexGrow: 1 }} className="card-body px-4 py-6 text-xs">
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <div className="font-semibold">Office Name:</div>
                </Grid>
                <Grid item xs={8}>
                  {myorganization.name}
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <div className="font-semibold">Office Email:</div>
                </Grid>
                <Grid item xs={8}>
                  {myorganization.email}
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <div className="font-semibold">Office Contact:</div>
                </Grid>
                <Grid item xs={8}>
                  {myorganization.contact}
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <div className="font-semibold">Focal Person Name:</div>
                </Grid>
                <Grid item xs={8}>
                  {myorganization.focalPersonName}
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <div className="font-semibold">Focal Person Email:</div>
                </Grid>
                <Grid item xs={8}>
                  {myorganization.focalPersonEmail}
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <div className="font-semibold">Focal Person Contact:</div>
                </Grid>
                <Grid item xs={8}>
                  {myorganization.focalPersonContact}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </div>
      <div className="card bg-white rounded-lg border">
        <div className="card-header p-4 border-b-1 pb-3">
          <Typography variant="h6">
            <div className="flex justify-between">
              <div>My office users</div>
              <Button
                variant="contained"
                color="primary"
                onClick={openModal}
                style={{ marginBottom: "10px" }}
              >
                <AddCircleOutlineIcon /> Add User
              </Button>
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
                    height: "500px",
                    margin: "0 auto",
                    backgroundColor: "white",
                    borderRadius: "4px",
                    padding: 0,
                    border: 0,
                    top: "100px",
                  },
                }}
              >
                <div className="flex justify-between bg-blue-800 text-white p-4">
                  <div>Add User</div>
                  <div onClick={closeModal} className="cursor-pointer">
                    <CloseIcon />
                  </div>
                </div>
                <form onSubmit={handleCreateUser} className="p-4">
                  <div className="form-group">
                    <label htmlFor="name">New Issue Name:</label>

                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Name"
                      className="form-control"
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
                      <option value="ADMIN">ADMIN</option>
                      <option value="USER">USER</option>
                      <option value="SUPERVISOR">SUPERVISOR</option>
                      <option value="EMPLOYEE">EMPLOYEE</option>
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
            </div>
          </Typography>
        </div>
        <div className="card-body px-4 py-6 text-xs">
          <DataGrid
            rows={filteredUsers.map((user, index) => ({ ...user, id: index }))}
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
                    <Link to={`/createuser/${params.row._id}`}>
                      <Button variant="outlined" size="small">
                        <ModeEditIcon />
                      </Button>
                    </Link>

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
              loadingOverlay: () => <Spinner />,
            }}
          />
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
      </div>
    </>
  );
};

export default OrganizationDetail;
