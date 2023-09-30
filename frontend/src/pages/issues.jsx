import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Modal from "react-modal";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  getAllIssueTypes,
  createIssueType,
  reset,
  deleteIssueType,
} from "../features/issues/issueSlice";
import BackButton from "../components/BackButton";

function IssueList() {
  const issues = useSelector((state) => state.issueTypes.issueTypes);
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.issueTypes
  );
  const [name, setNewIssueName] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Local state for the modal
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    }
  }, [dispatch, isError, isSuccess, message]);

  // Function to handle form submission for creating a new issue
  const handleCreateIssue = (e) => {
    e.preventDefault();
    // Dispatch the createIssueType action with the new issue name
    dispatch(createIssueType({ name }));

    // Clear the input field after creating the issue
    setNewIssueName("");
    closeModal();
  };
  // Function to handle issue deletion
  const handleDeleteIssue = (issueId) => {
    const token = // Retrieve the user token from your authentication system
      dispatch(deleteIssueType(issueId, token))
        .then(() => {
          // Optionally, you can show a success message here.
          toast.success("Issue deleted successfully");
        })
        .catch((error) => {
          // Handle the error and display it to the user, if necessary.
          toast.error(`Error deleting issue: ${error.message}`);
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

  return (
    <>
      <BackButton url="/" />
      <div>
        <h1>Issue List</h1>

        {/* Add Issue Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={openModal}
          style={{ marginBottom: "10px" }}
        >
          Add Issue
        </Button>

        {/* Table View */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Issue Name</TableCell>
                <TableCell>Issue ID</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {issues.map((issue) => (
                <TableRow key={issue._id}>
                  <TableCell>{issue.name}</TableCell>
                  <TableCell>{issue._id}</TableCell>
                  <TableCell>
                    <Link to={`/issues/${issue._id}`}>
                      <Button
                        variant="contained"
                        style={{ backgroundColor: "green", marginRight: "8px" }}
                      >
                        <EditIcon style={{ background: "transparent" }} />
                      </Button>
                    </Link>
                    <Button
                      variant="contained"
                      style={{ backgroundColor: "red", marginRight: "8px" }}
                      onClick={() => handleDeleteIssue(issue._id)}
                    >
                      <DeleteIcon style={{ background: "transparent" }} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Add Issue Modal */}
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
          {/* Close button */}
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
