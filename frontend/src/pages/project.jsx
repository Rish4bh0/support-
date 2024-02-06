import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Modal from "react-modal";
import { DataGrid } from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import {
  getAllProject,
  createProject,
  reset,
  deleteProject,
  updateProject,
  selectProjectById,
} from "../features/project/projectSlice"; // Replace with your actual import statements
import BackButton from "../components/BackButton";
import { getAllOrganization } from "../features/organization/organizationSlice"; // Replace with your actual import statements
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import ViewListIcon from "@mui/icons-material/ViewList";
import Spinner from "../components/Spinner";

function ProjectList() {
  const projects = useSelector((state) => state.project.project);
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.project
  );
  const userRole = useSelector((state) => state.auth.user.role);
  const [newProjectName, setNewProjectName] = useState(""); // Change to 'newIssueName'
  const [updateName, setUpdateName] = useState(""); // Change to 'updateName'
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectIdToDelete, setProjectIdToDelete] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState("");

  useEffect(() => {
    dispatch(getAllProject());
    dispatch(getAllOrganization());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess) {
      dispatch(reset());
      toast.success("Project added");
      dispatch(getAllProject());
    }
  }, [dispatch, isError, isSuccess, message]);

  const handleUpdateProject = (projectId) => {
    setSelectedProjectId(projectId);

    // Check if it's a new user or an existing user being updated
    if (!projectId) {
      // It's a new user, open the modal for creating
      setIsUpdateModalOpen(true);
    } else {
      // It's an existing user, set the update form state variables
      const selectedProject = projects.find((project) => project._id === projectId);
      if (selectedProject) {
        setUpdateName(selectedProject.name);
      }

      // Open the modal for updating
      setIsUpdateModalOpen(true);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const projectData = {
      projectName: selectedProjectId ? updateName : newProjectName,
    };
  

    if (selectedProjectId) {
      console.log(selectedProjectId)
      dispatch(updateProject({ id: selectedProjectId, projectData }))
        .then(() => {
          closeUpdateModal();
          toast.success("Project updated successfully");
        })
        .catch((error) => {
          toast.error(`Error updating issue: ${error.message}`);
        });
    } else {
      dispatch(createProject(projectData))
        .then(() => {
          closeModal();
          toast.success("Project added");
        })
        .catch((error) => {
          toast.error(`Error creating project: ${error.message}`);
        });
    }

    setNewProjectName(""); // Change to 'newIssueName'
    setUpdateName("");
  };

  useEffect(() => {
    dispatch(selectProjectById(selectedProjectId));
  }, [selectedProjectId, dispatch]);

  const handleDeleteProject = (projectId) => {
    setProjectIdToDelete(projectId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    const token = "your-token-here";

    dispatch(deleteProject(projectIdToDelete, token))
      .then(() => {
        toast.success(`Project deleted successfully`);
      })
      .catch((error) => {
        toast.error(`Error deleting project: ${error.message}`);
      })
      .finally(() => {
        setIsDeleteModalOpen(false);
        setProjectIdToDelete(null);
      });
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setProjectIdToDelete(null);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const openUpdateModal = () => {
    setIsUpdateModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProjectId("");
    setNewProjectName(""); 
    setUpdateName("");
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedProjectId("");
    setNewProjectName(""); 
    setUpdateName("");
  };

  if (!["ADMIN", "SUPERVISOR", "EMPLOYEE"].includes(userRole)) {
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
        <h1 className="text-xl font-extrabold text-14">
          {" "}
          <ViewListIcon /> Project List
        </h1>
        <div className="flex justify-end p-2 md:mx-6 relative">
          <Button
            variant="contained"
            color="primary"
            onClick={openModal}
            style={{ marginBottom: "10px" }}
          >
            <AddCircleOutlineIcon /> Add Project
          </Button>
        </div>

        <DataGrid
          rows={projects.map((project, index) => ({ ...project, id: index }))}
          columns={[
            { field: "projectName", headerName: "Project Name", flex: 1 },
            { field: "_id", headerName: "Project ID", flex: 1 },
            {
              field: "actions",
              headerName: "Action",
              flex: 1,
              renderCell: (params) => (
                <div>
                  <button onClick={() => handleUpdateProject(params.row._id)}>
                    <ModeEditIcon className="text-blue-500 group-hover:text-blue-700 mr-8" />
                  </button>
                  <button
                    onClick={() => handleDeleteProject(params.row._id)}
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

        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Add Project Modal"
          style={{
            overlay: {
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "flex-end",
              backgroundColor: "rgba(0, 0, 0, 0.3)",
            },
            content: {
              width: "500px",
              height: "250px",
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

          <h2>Add Project</h2>
          <form onSubmit={handleFormSubmit}>
            <div className="form-group">
              <label htmlFor="name">New Project Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <Button type="submit" variant="contained" color="primary">
                Create Project
              </Button>
            </div>
          </form>
        </Modal>

           {/* Update issue Modal */}
      <Modal
        isOpen={!!(isUpdateModalOpen && selectedProjectId)}
        onRequestClose={closeUpdateModal}
        contentLabel="Update Issue Modal"
        style={{
          overlay: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
          },
          content: {
            width: "500px",
            height: "250px",
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
        <h2>Update Project</h2>
        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Name"
              value={updateName}
              onChange={(e) => setUpdateName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <Button type="submit" variant="contained" color="primary">
              Update Project
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
        <p>Are you sure you want to delete Project?</p>
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

export default ProjectList;
