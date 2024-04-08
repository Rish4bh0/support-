import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { environment } from '../../lib/environment';

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Send a POST request to your API endpoint (e.g., /api/users/reset-password/:token) with the new password and token data
    try {
      const response = await fetch(`/api/users/reset-password/${token}`, {
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
      <section >
    <div class="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 z-10 relative">

        <h1 class="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">Reset Password</h1>
        <p class="mb-8 text-lg font-normal text-gray-700 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-200">Please enter your new password.</p>
        <form onSubmit={handleSubmit} class="w-full max-w-md mx-auto">   
            <label for="default-email" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">New assword</label>
            <div class="relative mb-52">
                <div class="absolute inset-y-0 rtl:inset-x-0 start-0 flex items-center ps-3.5 pointer-events-none">
                    <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
                        <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z"/>
                        <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z"/>
                    </svg>
                </div>
                <input  type="password"  value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required id="default-email" class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter your password here..."/>
                <button type="submit" class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Reset password</button>
            </div>
        </form>
    </div>
    <div class="bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-900 w-full h-full absolute top-0 left-0 z-0"></div>
</section>
{/*
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
      */}
    </div>
  );
};

export default ResetPassword;
