import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import ticketService from './ticketService'

const initialState = {
  tickets: [],
  ticketss: [],
  ticket: {},
  allTickets: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: ''
}

// Create new ticket
/**
 * createAsyncThunk: A function that accepts a Redux action type string and
 * a callback function that should return a promise.
 * It generates promise lifecycle action types based
 * on the action type prefix that you pass in,
 * and returns a thunk action creator that will
 * run the promise callback and dispatch the
 * lifecycle actions based on the returned promise.
 * This abstracts the standard recommended approach for handling async request lifecycles.
 */
export const createTicket = createAsyncThunk(
  'tickets/create',
  async (ticketData, thunkAPI) => {
    /**
     * thunkAPI: an object containing all of the parameters
     * that are normally passed to a Redux thunk function,
     * as well as additional options: https://redux-toolkit.js.org/api/createAsyncThunk
     */
    try {
      // Token is required for authentication
      const token = thunkAPI.getState().auth.user.token
      const response = await ticketService.createTicket(ticketData, token)
      console.log('API Response:', response);
      return response;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()

      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Get user tickets
export const getTickets = createAsyncThunk(
  'tickets/getAll',
  async (_, thunkAPI) => {
    /**
     * thunkAPI: an object containing all of the parameters
     * that are normally passed to a Redux thunk function,
     * as well as additional options: https://redux-toolkit.js.org/api/createAsyncThunk
     */
    try {
      // Token is required for authentication
      const token = thunkAPI.getState().auth.user.token
      return await ticketService.getTickets(token)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()

      return thunkAPI.rejectWithValue(message)
    }
  }
)
// Get user tickets
export const getTicketss = createAsyncThunk(
  'tickets/getAlls',
  async (_, thunkAPI) => {
    /**
     * thunkAPI: an object containing all of the parameters
     * that are normally passed to a Redux thunk function,
     * as well as additional options: https://redux-toolkit.js.org/api/createAsyncThunk
     */
    try {
      // Token is required for authentication
      const token = thunkAPI.getState().auth.user.token
      return await ticketService.getTicketss(token)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()

      return thunkAPI.rejectWithValue(message)
    }
  }
)
export const getAllTickets = createAsyncThunk(
  'tickets/getAllTickets',
  async (_, thunkAPI ) => {
    try {
      // Token is required for authentication
      const token = thunkAPI.getState().auth.user.token
      const allTickets = await ticketService.getAllTickets(token);
      return allTickets;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
// Get user ticket
export const getTicket = createAsyncThunk(
  'tickets/get',
  async (ticketId, thunkAPI) => {
    /**
     * thunkAPI: an object containing all of the parameters
     * that are normally passed to a Redux thunk function,
     * as well as additional options: https://redux-toolkit.js.org/api/createAsyncThunk
     */
    try {
      // Token is required for authentication
      const token = thunkAPI.getState().auth.user.token
      return await ticketService.getTicket(ticketId, token)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()

      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const updateTicket = createAsyncThunk(
  'tickets/update',
  async ({ ticketId, updatedTicketData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const response = await ticketService.updateTicket(
        ticketId,
        updatedTicketData,
        token
      );
      console.log('API Response:', response);
      return response;
      
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Close ticket
export const closeTicket = createAsyncThunk(
  'tickets/close',
  async (ticketId, thunkAPI) => {
    /**
     * thunkAPI: an object containing all of the parameters
     * that are normally passed to a Redux thunk function,
     * as well as additional options: https://redux-toolkit.js.org/api/createAsyncThunk
     */
    try {
      // Token is required for authentication
      const token = thunkAPI.getState().auth.user.token
      return await ticketService.closeTicket(ticketId, token) // Service function
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()

      return thunkAPI.rejectWithValue(message)
    }
  }
)
// Update ticket
export const updateTicketAsync = createAsyncThunk(
  'tickets/update',
  async ({ ticketId, updatedTicketData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const response = await ticketService.updateTicket(
        ticketId,
        updatedTicketData,
        token
      );
      console.log('API Response:', response);
      return response;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);


export const ticketSlice = createSlice({
  name: 'ticket',
  initialState,
  reducers: {
    reset: state => initialState
  },
  extraReducers: builder => {
    builder
      .addCase(createTicket.pending, state => {
        state.isLoading = true
      })
      .addCase(createTicket.fulfilled, state => {
        state.isLoading = false
        state.isSuccess = true
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getTickets.pending, state => {
        state.isLoading = true
      })
      .addCase(getTickets.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.tickets = action.payload
      })
      .addCase(getTickets.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getTicketss.pending, state => {
        state.isLoading = true
      })
      .addCase(getTicketss.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.ticketss = action.payload
      })
      .addCase(getTicketss.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getTicket.pending, state => {
        state.isLoading = true
      })
      .addCase(getTicket.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.ticket = action.payload
      })
      .addCase(getTicket.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getAllTickets.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(getAllTickets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allTickets = action.payload;
      })
      .addCase(getAllTickets.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.error.message;
      })
      .addCase(closeTicket.fulfilled, (state, action) => {
        state.isLoading = false
        state.tickets.map(ticket =>
          ticket._id === action.payload._id ? (ticket.status = 'close') : ticket
        )
      })
      .addCase(updateTicketAsync.pending, state => {
        state.isLoading = true;
      })
      .addCase(updateTicketAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        // Assuming the API response contains the updated ticket data
        // You can update the corresponding ticket in the state
        const updatedTicket = action.payload;
        const ticketIndex = state.tickets.findIndex(
          ticket => ticket.id === updatedTicket.id
        );

        if (ticketIndex !== -1) {
          state.tickets[ticketIndex] = updatedTicket;
        }
      })
      .addCase(updateTicketAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  }
})

export const { reset } = ticketSlice.actions
export default ticketSlice.reducer
