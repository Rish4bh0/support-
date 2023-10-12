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
} from "../features/issues/issueSlice";
import BackButton from "../components/BackButton";
import { getAllOrganization } from "../features/organization/organizationSlice";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import ViewListIcon from "@mui/icons-material/ViewList";

function IssueList() {
  const issues = useSelector((state) => state.issueTypes.issueTypes);
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.issueTypes
  );
  const userRole = useSelector((state) => state.auth.user.role);
  const [name, setNewIssueName] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);

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
    }
  }, [dispatch, isError, isSuccess, message]);

  const handleCreateIssue = (e) => {
    e.preventDefault();
    dispatch(createIssueType({ name }));
    setNewIssueName("");
    closeModal();
  };

  const handleDeleteIssue = (issueId) => {
    const token = ""; // Retrieve the user token from your authentication system
    dispatch(deleteIssueType(issueId, token))
      .then(() => {
        toast.success("Issue deleted successfully");
      })
      .catch((error) => {
        toast.error(`Error deleting issue: ${error.message}`);
      });
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
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
            { field: "name", headerName: "Issue Name", flex: 1 },
            { field: "_id", headerName: "Issue ID", flex: 1 },
            {
              field: "actions",
              headerName: "Action",
              flex: 1,
              renderCell: (params) => (
                <div>
                  <Link to={`/issues/${params.row._id}`}>
                    <button className="group">
                      <ModeEditIcon className="text-blue-500 group-hover:text-blue-700 mr-8" />
                    </button>
                  </Link>

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

          <h2>Add Issue</h2>
          <form onSubmit={handleCreateIssue}>
            <div className="form-group">
              <label htmlFor="name">New Issue Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Name"
                value={name}
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
