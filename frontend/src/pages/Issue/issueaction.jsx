import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectIssueTypeById,
  updateIssueType,
  deleteIssueType,
} from '../../features/issues/issueSlice';
import { Button, TextField } from '@mui/material';

function IssueDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedIssue = useSelector((state) => state.issueTypes.selectedIssueType);
  const isLoading = useSelector((state) => state.issueTypes.isLoading);
  const errorMessage = useSelector((state) => state.issueTypes.errorMessage);

  const [updatedName, setUpdatedName] = useState('');

  useEffect(() => {
    dispatch(selectIssueTypeById(id));
  }, [dispatch, id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = ''; // Retrieve the user token from your authentication system
    await dispatch(updateIssueType({ id, name: updatedName, token }));
    setUpdatedName('');
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Issue Details</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : selectedIssue ? (
        <>
          <TextField
            label="Name"
            value={updatedName}
            onChange={(e) => setUpdatedName(e.target.value)}
          />
          <br />
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdate}
            disabled={!updatedName.trim() || isLoading}
          >
            {isLoading ? 'Updating...' : 'Update'}
          </Button>
          <br />
          {errorMessage && <p className="error-message">Error: {errorMessage}</p>}
        </>
      ) : (
        <p>No issue details available.</p>
      )}
    </div>
  );
}

export default IssueDetail;
