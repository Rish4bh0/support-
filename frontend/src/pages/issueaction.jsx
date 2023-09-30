import React, { useEffect, useState } from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectIssueTypeById, updateIssueType, deleteIssueType } from '../features/issues/issueSlice';

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
    const token = // Retrieve the user token from your authentication system
    await dispatch(updateIssueType({ id, name: updatedName, token }));
    setUpdatedName('');
  };

  const handleDelete = async () => {
    const token = // Retrieve the user token from your authentication system
    await dispatch(deleteIssueType(id, token));
    // After deletion, you can redirect the user to a different page, such as the issue list.
    navigate('/issues'); // Redirect to the issue list page
  };

  return (
    <div>
      <h1>Issue Details</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : selectedIssue ? (
        <>
          <p>Name: {selectedIssue.name}</p>
          <form onSubmit={handleUpdate}>
            <label>
              Update Name:
              <input
                type="text"
                value={updatedName}
                onChange={(e) => setUpdatedName(e.target.value)}
              />
            </label>
            <button type="submit">Update</button>
          </form>
          <button onClick={handleDelete}>Delete</button>
          {errorMessage && <p>Error: {errorMessage}</p>}
        </>
      ) : (
        <p>No issue details available.</p>
      )}
    </div>
  );
}

export default IssueDetail;
