import React, { useEffect, useState } from "react";
import {
  selectOrganizationById,
  updateOrganization,
} from "../features/organization/organizationSlice";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../components/Spinner";

const UpdateOrganization = () => {
  const organization = useSelector(
    (state) => state.organizations.selectedOrganization
  );
  const { id } = useParams();
  const dispatch = useDispatch();

  // State to store form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    description: "",
  });

  // Function to handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Dispatch the updateOrganization action with the updated organization data
    dispatch(
      updateOrganization({
        id,
        organizationData: formData,
      })
    );
  };

  useEffect(() => {
    // Fetch the selected organization by its ID
    dispatch(selectOrganizationById(id));
  }, [id, dispatch]);

  // Update formData with organization data when it's available
  useEffect(() => {
    if (organization) {
      setFormData({
        name: organization.name,
        email: organization.email,
        contact: organization.contact,
        description: organization.description,
      });
    }
  }, [organization]);

  // Display loading message if the organization is being fetched
  if (!organization) {
    return <Spinner />;
  }

  return (
    <>
      <h2>Update Organization</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="contact">Contact</label>
          <input
            type="text"
            id="contact"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Update</button>
      </form>
    </>
  );
};

export default UpdateOrganization;
