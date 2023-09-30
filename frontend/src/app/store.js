import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import ticketReducer from '../features/tickets/ticketSlice';
import issueTypeReducer from '../features/issues/issueSlice'; // Import your issueTypeSlice
import noteReducer from '../features/notes/noteSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tickets: ticketReducer,
    issueTypes: issueTypeReducer, // Add issueTypeSlice to the reducers
    notes: noteReducer,
  },
});
