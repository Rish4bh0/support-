import axios from 'axios';
import { environment } from '../../lib/environment'

const API_URL = environment.SERVER_URL+'/api/issues/';

const URL = environment.SERVER_URL;

const createIssueType = async (issueData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, issueData, config);

  return response.data;
};

const getAllIssueTypes = async (token, page, pageSize) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    
    const response = await axios.get(`${URL}/api/issues?page=${page}&pageSize=${pageSize}`, config);
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
