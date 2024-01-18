import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import ticketReducer from '../features/tickets/ticketSlice';
import issueTypeReducer from '../features/issues/issueSlice'; 
import projectReducer from '../features/project/projectSlice';
import noteReducer from '../features/notes/noteSlice';
import organizationreducer from '../features/organization/organizationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tickets: ticketReducer,
    issueTypes: issueTypeReducer, 
    project: projectReducer,
    notes: noteReducer,
    organizations : organizationreducer
  },
});
