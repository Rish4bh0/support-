import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Modal from "react-modal";
import { DataGrid } from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import {
  getAllIssueTypes,
  createIssueType,
  reset,
  deleteIssueType,
  updateIssueType,
  selectIssueTypeById,
} from "../features/issues/issueSlice"; // Replace with your actual import statements
import BackButton from "../components/BackButton";
import { getAllOrganization } from "../features/organization/organizationSlice"; // Replace with your actual import statements
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import ViewListIcon from "@mui/icons-material/ViewList";
import Spinner from "../components/Spinner";

function IssueList() {
  const issues = useSelector((state) => state.issueTypes.issueTypes);
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.issueTypes
  );
  const userRole = useSelector((state) => state.auth.user.role);
  const [newIssueName, setNewIssueName] = useState(""); // Change to 'newIssueName'
  const [updateName, setUpdateName] = useState(""); // Change to 'updateName'
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [issueIdToDelete, setIssueIdToDelete] = useState(null);
  const [selectedIssueId, setSelectedIssueId] = useState("");

  useEffect(() => {
    dispatch(getAllIssueTypes());
    dispatch(getAllOrganization());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess) {
      dispatch(reset());
      toast.success("Issue added");
      dispatch(getAllIssueTypes());
    }
  }, [dispatch, isError, isSuccess, message]);

  const handleUpdateIssue = (issueId) => {
    setSelectedIssueId(issueId);

    // Check if it's a new user or an existing user being updated
    if (!issueId) {
      // It's a new user, open the modal for creating
      setIsUpdateModalOpen(true);
    } else {
      // It's an existing user, set the update form state variables
      const selectedIssue = issues.find((issue) => issue._id === issueId);
      if (selectedIssue) {
        setUpdateName(selectedIssue.name);
      }

      // Open the modal for updating
      setIsUpdateModalOpen(true);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const issueData = {
      name: selectedIssueId ? updateName : newIssueName,
    };
  

    if (selectedIssueId) {
      console.log(selectedIssueId)
      dispatch(updateIssueType({ id: selectedIssueId, issueData }))
        .then(() => {
          closeUpdateModal();
          toast.success("Issue updated successfully");
        })
        .catch((error) => {
          toast.error(`Error updating issue: ${error.message}`);
        });
    } else {
      dispatch(createIssueType(issueData))
        .then(() => {
          closeModal();
          toast.success("Issue added");
        })
        .catch((error) => {
          toast.error(`Error creating issue: ${error.message}`);
        });
    }

    setNewIssueName(""); // Change to 'newIssueName'
    setUpdateName("");
  };

  useEffect(() => {
    dispatch(selectIssueTypeById(selectedIssueId));
  }, [selectedIssueId, dispatch]);

  const handleDeleteIssue = (issueId) => {
    setIssueIdToDelete(issueId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    const token = "your-token-here";

    dispatch(deleteIssueType(issueIdToDelete, token))
      .then(() => {
        toast.success(`Issue deleted successfully`);
      })
      .catch((error) => {
        toast.error(`Error deleting issue: ${error.message}`);
      })
      .finally(() => {
        setIsDeleteModalOpen(false);
        setIssueIdToDelete(null);
      });
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setIssueIdToDelete(null);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const openUpdateModal = () => {
    setIsUpdateModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedIssueId("");
    setNewIssueName(""); // Change to 'newIssueName'
    setUpdateName("");
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedIssueId("");
    setNewIssueName(""); // Change to 'newIssueName'
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
      <div>
        <h1 className="text-xl font-extrabold text-14">
          {" "}
          <ViewListIcon /> Issue List
        </h1>
        <div className="flex justify-end p-2 md:mx-6 relative">
          <Button
            variant="contained"
            color="primary"
            onClick={openModal}
            style={{ marginBottom: "10px" }}
          >
            <AddCircleOutlineIcon /> Add Issue
          </Button>
        </div>

        <DataGrid
          rows={issues.map((issue, index) => ({ ...issue, id: index }))}
          columns={[
            { field: "name", headerName: "Issue Name", flex: 1, minWidth: 150, // Set a minimum width for the column
            headerClassName: "text-sm md:text-base", // Adjust font size for responsiveness
            cellClassName: "text-sm md:text-base", },
            { field: "_id", headerName: "Issue ID", flex: 1,  minWidth: 150, // Set a minimum width for the column
            headerClassName: "text-sm md:text-base", // Adjust font size for responsiveness
            cellClassName: "text-sm md:text-base",},
            {
              field: "actions",
              headerName: "Action",
              flex: 1,  minWidth: 150, // Set a minimum width for the column
              headerClassName: "text-sm md:text-base", // Adjust font size for responsiveness
              cellClassName: "text-sm md:text-base",
              renderCell: (params) => (
                <div>
                  <button onClick={() => handleUpdateIssue(params.row._id)}>
                    <ModeEditIcon className="text-blue-500 group-hover:text-blue-700 mr-8" />
                  </button>
                  <button
                    onClick={() => handleDeleteIssue(params.row._id)}
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
          className="min-w-full overflow-x-auto md:w-full"
        />

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

          <h2>Add Issue</h2>
          <form onSubmit={handleFormSubmit}>
            <div className="form-group">
              <label htmlFor="name">New Issue Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Name"
                value={newIssueName}
                onChange={(e) => setNewIssueName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <Button type="submit" variant="contained" color="primary">
                Create Issue
              </Button>
            </div>
          </form>
        </Modal>

           {/* Update issue Modal */}
      <Modal
        isOpen={!!(isUpdateModalOpen && selectedIssueId)}
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
        <h2>Update Issue</h2>
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
              Update Issue
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
        <p>Are you sure you want to delete issue?</p>
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

export default IssueList;

/*

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { getAllIssueTypes, createIssueType, reset } from '../features/issues/issueSlice';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

function IssueList() {
  
  const issues = useSelector((state) => state.issueTypes.issueTypes);
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.issueTypes
  );
  const [name, setNewIssueName] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    // Load the initial issue list when the component mounts
    dispatch(getAllIssueTypes());
  }, [dispatch]);


  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess) {
      dispatch(reset());
      navigate("/");
    }
  }, [dispatch, isError, isSuccess, navigate, message]);



  // Function to handle form submission for creating a new issue
  const handleCreateIssue = (e) => {
    e.preventDefault();
console.log(name)
    // Dispatch the createIssueType action with the new issue name
   
    dispatch(createIssueType({ name }));

    // Clear the input field after creating the issue
    
  };

  return (
    <div>
      <h1>Issue List</h1>

      // Form for creating a new issue 
      <form onSubmit={handleCreateIssue}>
        <div className='form-group'>
        <label htmlFor="description">New Issue Name:</label>
          
          <textarea
          className='form-control'
            id = "name"
            name = "name"
            placeholder="Name"
            value={name}
            onChange={(e) => setNewIssueName(e.target.value)}
          ></textarea>
        </div>
        <div className="form-group">
        <button className="btn btn-block" >Create Issue</button>
        </div>
      </form>

      <ul>
        {issues.map((issue) => (
          <li key={issue._id}>
            <Link to={`/issues/${issue._id}`}>{issue.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default IssueList;
*/
