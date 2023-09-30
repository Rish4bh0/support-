import { React,  useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateTicketAsync, getTicket } from '../features/tickets/ticketSlice';
import { useParams } from 'react-router-dom';
import { fetchAllUsers } from '../features/auth/authSlice';
import { getAllIssueTypes } from '../features/issues/issueSlice';

const UpdateProductPage = () => {
  const { ticketId } = useParams();
  const { ticket } = useSelector((state) => state.tickets);
  const users = useSelector((state) => state.auth.users);
  const issues = useSelector((state) => state.issueTypes.issueTypes);

  const dispatch = useDispatch();

  // State for form data including media
  const [formData, setFormData] = useState({
    customerName: '',
    description: '',
    product: '',
    priority: '',
    assignedTo: '',
    issueType: '',
    customerEmail: '',
    customerContact: '',
  });

  // State to store selected media files
  const [media, setMedia] = useState([]);
  const [isEmailValid, setIsEmailValid] = useState(false);

  useEffect(() => {
    // Fetch the list of registered users when the component loads
    dispatch(fetchAllUsers());
    // Load the initial issue list when the component mounts
    dispatch(getAllIssueTypes());
  }, [dispatch]);

  useEffect(() => {
    // Fetch the ticket data from the store and update the form data
    if (ticket && ticket._id === ticketId) {
      setFormData({
        customerName: ticket.customerName,
        description: ticket.description,
        product: ticket.product,
        priority: ticket.priority,
        assignedTo: ticket.assignedTo,
        issueType: ticket.issueType,
        customerEmail: ticket.customerEmail,
        customerContact: ticket.customerContact,
      });
    } else {
      // If the ticket data is not available in the store, fetch it
      dispatch(getTicket(ticketId));
    }
  }, [ticketId, ticket, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Function to handle media file selection
  const handleMedia = (e) => {
    const selectedMedia = e.target.files;
    const mediaArray = [];

    for (let i = 0; i < selectedMedia.length; i++) {
      const file = selectedMedia[i];
      setFileToBase(file, (base64Media) => {
        mediaArray.push(base64Media);

        if (i === selectedMedia.length - 1) {
          setMedia(mediaArray);
        }
      });
    }
  };

  // Function to convert file to base64
  const setFileToBase = (file, callback) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64Media = reader.result;
      callback(base64Media);
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Dispatch the updateTicketAsync action with media data
    dispatch(
      updateTicketAsync({
        ticketId,
        updatedTicketData: {
          customerName: formData.customerName,
          description: formData.description,
          media, // Include the selected media files
          product: formData.product,
        priority: formData.priority,
        assignedTo: formData.assignedTo,
        issueType: formData.issueType,
        customerEmail: formData.customerEmail,
        customerContact: formData.customerContact,
        },
      })
    );
  };

  

  return (
    <div>
      <h1>Update Ticket</h1>
      <h4>Ticket ID: {ticket._id}</h4>
      <form onSubmit={handleSubmit}>
      <div className="form-group">
            <label htmlFor="customerName">Customer Name</label>
            <input
              className="form-control"
              placeholder="customerName"
              value={formData.customerName}
              name="customerName"
              id="customerName"
              onChange={handleChange}
            ></input>
          </div>
        <div className="form-group" >
            <label htmlFor="customerEmail">Customer Email</label>
            <input
              className="form-control"
              placeholder="customerEmail"
              value={formData.customerEmail}
              name="customerEmail"
              id="customerEmail"
              onChange={handleChange}
            />
           
          </div>

          <div className="form-group">
            <label htmlFor="customerContact">Customer Contact</label>
            <input
              className="form-control"
              placeholder="customerContact"
              value={formData.customerContact}
              name="customerContact"
              id="customerContact"
              onChange={handleChange}
            ></input>
          </div>

          <div className="form-group">
            <label htmlFor="assignedTo">Assign To</label>
            <select
              name="assignedTo"
              id="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
            >
              <option value="">Select One</option>
              {users && users.length > 0 ? (
                users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No users available
                </option>
              )}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="product">Product Name</label>
            <select
              name="product"
              id="product"
              value={formData.product}
              onChange={handleChange}
            >
              <option value="Ecommernce">Ecommerce</option>
              <option value="Employee management system">
                Employee management system
              </option>
              <option value="HR management system">HR management system</option>
              <option value="CMS">CMS</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select
              name="priority"
              id="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="High">High</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="issueType">Issue Type</label>
            <select
              name="issueType"
              id="issueType"
              value={formData.issueType}
              onChange={handleChange}
            >
              <option value="">Select One</option>
              {issues && issues.length > 0 ? (
                issues.map((issue) => (
                  <option key={issue._id} value={issue._id}>
                    {issue.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No issue available
                </option>
              )}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="description">Description of the issue</label>
            <textarea
              className="form-control"
              placeholder="Description"
              value={formData.description}
              name="description"
              id="description"
              onChange={handleChange}
            ></textarea>
          </div>
        
        {/* File input for media */}
        <div className='form-group'>
        <div className="form-outline mb-4">
              <input
                onChange={handleMedia}
                type="file"
                id="formupload"
                name="media"
                className="form-control"
                multiple // Allow multiple file selection
              />
              <label className="form-label" htmlFor="formupload">
                Media (Images and Videos)
              </label>
            </div>

        {/* Display selected media files */}
        {media.length > 0 && (
          <div className="selected-media">
            <h3>Selected Media:</h3>
            {media.map((mediaItem, index) => (
              <div key={index} className="media-item">
                {mediaItem.startsWith('data:image') ? (
                  <img
                    src={mediaItem}
                    alt={`Selected Image ${index + 1}`}
                    style={{ maxWidth: '100px', maxHeight: '100px' }}
                  />
                ) : (
                  <video
                    controls
                    src={mediaItem}
                    alt={`Selected Video ${index + 1}`}
                    style={{ maxWidth: '100px', maxHeight: '100px' }}
                  />
                )}
              </div>
            ))}
          </div>
        )}
        </div>

        <button type="submit" >Update Ticket</button>
      </form>
    </div>
  );
};

export default UpdateProductPage;



// UpdateProductPage.js
{/*
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateTicketAsync, getTicket } from '../features/tickets/ticketSlice';
import { useParams } from 'react-router-dom';

const UpdateProductPage = () => {
  const { ticketId } = useParams();
  const { ticket } = useSelector((state) => state.tickets);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    customerName: '', // Initialize with an empty string
    description: '',  // Initialize with an empty string
  });

  useEffect(() => {
    // Fetch the ticket data from the store and update the form data
    if (ticket && ticket._id === ticketId) {
      setFormData({
        customerName: ticket.customerName,
        description: ticket.description,
      });
    } else {
      // If the ticket data is not available in the store, fetch it
      dispatch(getTicket(ticketId));
    }
  }, [ticketId, ticket, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Dispatch the updateTicketAsync action
    dispatch(
      updateTicketAsync({
        ticketId,
        updatedTicketData: {
          customerName: formData.customerName,
          description: formData.description,
        },
      })
    );
  };

  return (
    <div>
      <h2>Update Ticket</h2>
      <h2>{ticket._id}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="customerName">Customer Name:</label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Update Ticket</button>
      </form>
    </div>
  );
};

export default UpdateProductPage;*/}


