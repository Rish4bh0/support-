import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { environment } from '../lib/environment';

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Send a POST request to your API endpoint (e.g., /api/users/reset-password/:token) with the new password and token data
    try {
      const response = await fetch(environment.SERVER_URL+`/api/users/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPassword }),
      });
      const data = await response.json();
      alert(data.message);
      // Redirect to the login page or another appropriate page
      window.location.href = '/login'; // Replace with the actual login route
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h1>Reset Password</h1>
      <form onSubmit={handleSubmit}>
        <label>New Password:</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
