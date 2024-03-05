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
} from "../../features/project/projectSlice";
import { getAllOrganization } from "../../features/organization/organizationSlice"; // Replace with your actual import statements
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import Spinner from "../../components/Spinner";
import { TextField } from "@mui/material";

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
      const selectedProject = projects.find(
        (project) => project._id === projectId
      );
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
      console.log(selectedProjectId);
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
      <div className="border border-gray-300 rounded-2xl bg-white w-full mb-48">
        <div className="border-b-1 p-4 text-sm flex justify-between">
          <div className="font-extrabold">Project List</div>
          <Button variant="contained" color="primary" onClick={openModal}>
            <AddCircleOutlineIcon className="me-2" /> Add Project
          </Button>
        </div>

        <div className="p-4">
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
            className={"border text-xs rounded-lg bg-white overflow-hidden"}
            style={{
              ...customStyles,
              zIndex: 1,
              position: "absolute",
            }}
          >
            <div className="p-4 flex justify-between items-center bg-blue-600 text-white">
              <label className="font-semibold uppercase ">Add Project</label>
              <button onClick={closeModal}>
                <CloseIcon />
              </button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="p-4">
                <div className="form-group">
                  <label htmlFor="name" className="mb-2 block font-semibold">
                    Project Name
                  </label>
                  <TextField
                    type="text"
                    id="name"
                    name="name"
                    className="text-sm w-full"
                    size="small"
                    placeholder="Name"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                  />
                </div>
              </div>
              <div className="card-footer p-4 border-t-1 space-x-6 text-end">
                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>
              </div>
            </form>
          </Modal>

          {/* Update issue Modal */}
          <Modal
            isOpen={!!(isUpdateModalOpen && selectedProjectId)}
            onRequestClose={closeUpdateModal}
            contentLabel="Update Issue Modal"
            className={"border text-xs rounded-lg bg-white overflow-hidden"}
            style={{
              ...customStyles,
              zIndex: 1,
              position: "absolute",
            }}
          >
            <div className="p-4 flex justify-between items-center bg-blue-600 text-white">
              <label className="font-semibold uppercase ">Update Project</label>
              <button onClick={closeModal}>
                <CloseIcon />
              </button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="p-4">
                <div className="form-group">
                  <label htmlFor="name" className="mb-2 block font-semibold">
                    Project Name
                  </label>
                  <TextField
                    id="name"
                    name="name"
                    placeholder="Name"
                    className="text-sm w-full"
                    size="small"
                    value={updateName}
                    onChange={(e) => setUpdateName(e.target.value)}
                  />
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
              <p>Are you sure you want to delete Project?</p>
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

export default ProjectList;
