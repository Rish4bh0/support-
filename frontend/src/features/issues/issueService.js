import axios from 'axios';

const API_URL = '/api/issues/';

const createIssueType = async (nameData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, nameData, config);

  return response.data;
};

const getAllIssueTypes = async token => {
  try{
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  
  const response = await axios.get(API_URL, config);
  return response.data;
} catch (error) {
  console.error("Error fetching all tickets:", error);
  return [];
}
};


const updateIssueType = async (id, name, token) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  
    try {
      const response = await axios.put(API_URL + id, { name }, config);
      return response.data; // Assuming the API returns the updated issue type data.
    } catch (error) {
      throw error; // Rethrow the error for handling in Redux action.
    }
  };

const deleteIssueType = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  await axios.delete(API_URL + id, config);
};

// Add this function to issueTypeService
const selectIssueTypeById = async (id, token) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      },
      responseType: 'json',
    }
  
    const response = await axios.get(API_URL + id, config)
  
    return response.data
  }

const issueTypeService = {
  createIssueType,
  getAllIssueTypes,
  updateIssueType,
  deleteIssueType,
  selectIssueTypeById,
  
};

export default issueTypeService;
