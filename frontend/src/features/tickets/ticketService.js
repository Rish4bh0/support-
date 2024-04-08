import axios from 'axios'
import { environment } from '../../lib/environment'

// eslint-disable-next-line no-unused-vars
const page = undefined;
// eslint-disable-next-line no-unused-vars
const pageSize = undefined;


const API_URL = '/api/tickets/'
// Create new ticket
const createTicket = async (ticketData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const response = await axios.post(API_URL, ticketData, config)
  console.log(ticketData)
  return response.data
}

// Get user tickets
const getTickets = async token => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const response = await axios.get(API_URL, config)

  return response.data
}
// Get user tickets
const getTicketss = async token => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const response = await axios.get(API_URL + '/my', config)

  return response.data
}

// Get user ticket
const getTicket = async (ticketId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const response = await axios.get(API_URL + ticketId, config)

  return response.data
}
// Get all tickets
export const getAllTickets = async token => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    const response = await axios.get(API_URL + '/all', config);
    return response.data;
  } catch (error) {
    console.error("Error fetching all tickets:", error);
    return [];
  }
};

export const report = async token => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    const response = await axios.get(API_URL + '/report', config);
    return response.data;
  } catch (error) {
    console.error("Error fetching report:", error);
    return [];
  }
};

// Close ticket
const closeTicket = async (ticketId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const response = await axios.put(
    API_URL + ticketId,
    { status: 'close' },
    config
  )

  return response.data
}

// review ticket
const reviewTicket = async (ticketId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const response = await axios.put(
    API_URL + ticketId,
    { status: 'review' },
    config
  )

  return response.data
}

// Draft ticket
const openTicket = async (ticketId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const response = await axios.put(
    API_URL + ticketId,
    { status: 'open' },
    config
  )

  return response.data
}

// Update ticket
export const updateTicket = async (ticketId, updatedTicketData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(
    `${API_URL}${ticketId}`,
    updatedTicketData,
    config
  );

  return response.data;
};

// Add a new function to save elapsed time
export const saveElapsedTime = async (ticketId, timeSpent, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(
    `${API_URL}${ticketId}/elapsed-time`,
    { timeSpent },
    config
  );

  return response.data;
};


const ticketService = {
  createTicket,
  getTickets,
  getTicketss,
  getTicket,
  closeTicket,
  getAllTickets,
  updateTicket,
  reviewTicket,
  saveElapsedTime,
  report,
  openTicket
}

export default ticketService
