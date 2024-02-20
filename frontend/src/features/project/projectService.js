import axios from 'axios';
import { environment } from '../../lib/environment'

const API_URL = environment.SERVER_URL+'/api/project/'
const createProject = async (projectData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, projectData, config);

  return response.data;
};

const getAllProject = async token => {
  try{
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  
  const response = await axios.get(API_URL, config);
  return response.data;
} catch (error) {
  console.error("Error fetching all project:", error);
  return [];
}
};


const updateProject = async (id, projectData, token) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  
    try {
      const response = await axios.put(API_URL + id,  projectData , config);
      return response.data;
    } catch (error) {
      throw error; 
    }
  };

const deleteProject = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  await axios.delete(API_URL + id, config);
};


const selectProjectById = async (id, token) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      },
      responseType: 'json',
    }
  
    const response = await axios.get(API_URL + id, config)
  
    return response.data
  }

const projectService = {
  createProject,
  getAllProject,
  updateProject,
  deleteProject,
  selectProjectById,
  
};

export default projectService;
