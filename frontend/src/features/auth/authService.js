import axios from 'axios'
import { environment } from '../../lib/environment'

const API_URL = environment.SERVER_URL+'/api/users/'
 
// Register user
const register = async userData => {
  // userData is an object with an email and password i.e {name: 'Hina', email: 'hina@*****.com', password: '******'}
  const response = await axios.post(API_URL, userData)

  if (response.data) {
    // localStorage can only hold strings
    localStorage.setItem('user', JSON.stringify(response.data))
  }

  return response.data
}

// Login user
const login = async userData => {
  // userData is an object with an email and password i.e {email: 'arif@*****.com', password: '******'}
  const response = await axios.post(API_URL + '/login', userData)

  if (response.data) {
    // localStorage can only hold strings
    // Save the user data to localStorage in a key called 'user'
    localStorage.setItem('user', JSON.stringify(response.data))
  }

  return response.data
}

// Logout user
const logout = () => localStorage.removeItem('user')

const getAllUsers = async () => {
  try {
    const response = await axios.get(API_URL + '/get');
    return response.data;
  } catch (error) {
    throw error;
  }
};

const createUser = async (createData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL + '/create/', createData, config);

  return response.data;
};

const updateUser = async (id, userData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.put(API_URL + '/create/' + id, userData, config);
    return response.data; 
  } catch (error) {
    throw error; 
  }
};

const deleteUser = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  await axios.delete(API_URL + '/create/' +id, config);
};

const selectUserById = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    },
    responseType: 'json',
  }

  const response = await axios.get(API_URL + 'create/' + id, config)

  return response.data
}

const authService = {
  register,
  logout,
  login,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  selectUserById
}

export default authService
