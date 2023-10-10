import React, { useEffect, useState } from "react";
import {
  reset,
  selectUserById,
  updateUser,
} from "../features/auth/authSlice";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import { getAllOrganization } from "../features/organization/organizationSlice";
const UpdateUser = () => {
  const user = useSelector(
    (state) => state.auth.selectedUser
  );
  const userRole = useSelector((state) => state.auth.user?.role);
  const allowedRoles = ["ADMIN", "SUPERVISOR", "EMPLOYEE"];
  const organizations = useSelector((state) => state.organizations.organizations);
  const { id } = useParams();
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");
  // State to store form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    organization: "",
  });

  // Function to handle form input changes except for password
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Function to handle password input changes
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Dispatch the updateOrganization action with the updated organization data
    dispatch(
      updateUser({
        id,
        userData: {
          ...formData,  // Include other form data
          password,      // Include the password
        },
      })
    );
  };

  useEffect(() => {
    // Fetch the selected organization by its ID
    dispatch(selectUserById(id));
    dispatch(getAllOrganization());
  }, [id, dispatch]);

  // Update formData with organization data when it's available
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        organization: user.organization,
      });
    }
  }, [user]);

  // Display loading message if the organization is being fetched
  if (!user) {
    return <Spinner />;
  }

  return (
    <>
      <h2>Update User</h2>
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
          <label htmlFor="password">New user password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            placeholder="Enter your password"
            onChange={handlePasswordChange}  // Use the separate handler
          />
        </div>
        {(userRole && allowedRoles.includes(userRole)) && (
        <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              name="role"
              id="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="USER">USER</option>
              <option value="ADMIN">
              ADMIN
              </option>
              <option value="SUPERVISOR">SUPERVISOR</option>
              <option value="EMPLOYEE">EMPLOYEE</option>
              <option value="ORGAGENT">ORGAGENT</option>
            </select>
          </div>
        )}
         {(userRole && allowedRoles.includes(userRole)) && (
          <div className="form-group">
              <label htmlFor="organization">Organization</label>
              <select
                name="organization"
                id="organization"
                value={formData.organization}
              onChange={handleChange}
              >
                <option value="">Select One</option>
                {organizations && organizations.length > 0 ? (
                  organizations.map((organization) => (
                    <option key={organization._id} value={organization._id}>
                      {organization.name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    No organization available
                  </option>
                )}
              </select>
            </div>
         )}
        <button className="btn btn-reverse btn-block" type="submit">Update</button>
      </form>
    </>
  );
};

export default UpdateUser;
