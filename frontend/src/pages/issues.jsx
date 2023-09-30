import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// Import Modal dependencies (e.g., react-modal)
import Modal from 'react-modal';

import {
  getAllIssueTypes,
  createIssueType,
  reset,
} from '../features/issues/issueSlice';

function IssueList() {
  const issues = useSelector((state) => state.issueTypes.issueTypes);
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.issueTypes
  );

  const [name, setNewIssueName] = useState('');
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
      navigate('/');
    }
  }, [dispatch, isError, isSuccess, navigate, message]);

  // Function to handle form submission for creating a new issue
  const handleCreateIssue = (e) => {
    e.preventDefault();
    console.log(name);

    // Dispatch the createIssueType action with the new issue name
    dispatch(createIssueType({ name }));

    // Clear the input field after creating the issue
    setNewIssueName('');
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
    <div>
      <h1>Issue List</h1>

      {/* Add Issue Button */}
      <button onClick={openModal}>Add Issue</button>

      {/* Grid View */}
      <table>
        <thead>
          <tr>
            <th>Issue Name</th>
            <th>Issue ID</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {issues.map((issue) => (
            <tr key={issue._id}>
              <td>{issue.name}</td>
              <td>{issue._id}</td>
              <td>
                <Link to={`/issues/${issue._id}`}>Update</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Issue Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Add Issue Modal"
      >
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
            <button className="btn btn-block">Create Issue</button>
          </div>
        </form>
        <button onClick={closeModal}>Close</button>
      </Modal>
    </div>
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