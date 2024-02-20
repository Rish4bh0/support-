import axios from 'axios'
import { environment } from '../../lib/environment'

const API_URL = '/api/tickets/'
// Get ticket notes
const getNotes = async (ticketId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const response = await axios.get(API_URL + ticketId + '/notes', config)

  return response.data
}

// Create ticket note
const createNote = async (noteData, ticketId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  
  const response = await axios.post(
    API_URL + ticketId + '/notes',
    noteData,
    config
  )

  return response.data
}

const noteService = {
  getNotes,
  createNote
}

export default noteService
