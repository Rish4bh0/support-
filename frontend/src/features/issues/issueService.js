import axios from 'axios';

const API_URL = 'https://dryicesupport.onrender.com/api/issues/';

const createIssueType = async (issueData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, issueData, config);

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


const updateIssueType = async (id, issueData, token) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  
    try {
      const response = await axios.put(API_URL + id,  issueData , config);
      return response.data;
    } catch (error) {
      throw error; 
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
