import axios from 'axios';

const API_URL = '/api/organizations/';

const createOrganization = async (organizationData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, organizationData, config);

  return response.data;
};

const getAllOrganization = async token => {
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


const updateOrganization = async (id, organizationData, token) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  
    try {
      const response = await axios.put(API_URL + id, organizationData, config);
      return response.data; 
    } catch (error) {
      throw error; 
    }
  };

const deleteOrganization = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  await axios.delete(API_URL + id, config);
};


const selectOrganizationById = async (id, token) => {
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
    createOrganization,
  getAllOrganization,
  updateOrganization,
  deleteOrganization,
  selectOrganizationById,
  
};

export default issueTypeService;
