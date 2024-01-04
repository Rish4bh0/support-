import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import organizationService from './organizationService';

const initialState = {
  organizations: [],
  selectedOrganization : {},
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: ''
};

export const createOrganization = createAsyncThunk(
  'organizations/create',
  async (organizationData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const response = await organizationService.createOrganization(organizationData, token);
      console.log('API Response:', response); // Log the entire response
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


// Get all organizations
export const getAllOrganization = createAsyncThunk(
  'organizations/getAll',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await organizationService.getAllOrganization(token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Update issue type
export const updateOrganization = createAsyncThunk(
    'organizations/update',
    async ({ id, organizationData, token }, thunkAPI) => {
      try {
        const updatedIssueType = await organizationService.updateOrganization(id, organizationData, token);
        return updatedIssueType;
      } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  );

// Delete organization
export const deleteOrganization = createAsyncThunk(
  'organizations/delete',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      await organizationService.deleteOrganization(id, token);
      return id; // Return the deleted organization ID
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


  export const selectOrganizationById = createAsyncThunk(
    'organizations/selectById',
    async (id, thunkAPI) => {
      /**
       * thunkAPI: an object containing all of the parameters
       * that are normally passed to a Redux thunk function,
       * as well as additional options: https://redux-toolkit.js.org/api/createAsyncThunk
       */
      try {
        // Token is required for authentication
        const token = thunkAPI.getState().auth.user.token
        return await organizationService.selectOrganizationById(id, token)
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


// Issue Type Slice
export const organizationSlice = createSlice({
  name: 'organizations',
  initialState,
  reducers: {
   
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrganization.pending, state => {
        state.isLoading = true
      })
      .addCase(createOrganization.fulfilled, state => {
        state.isLoading = false
        state.isSuccess = true
      })
      .addCase(createOrganization.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getAllOrganization.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getAllOrganization.fulfilled, (state, action) => {
        state.isLoading = false;
        state.organizations = action.payload;
      })
      .addCase(getAllOrganization.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(updateOrganization.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = '';
      })
      .addCase(updateOrganization.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Update the organization in the state with the updated data
        state.organizations = state.organizations.map((organization) =>
        organization._id === action.payload._id ? action.payload : organization
        );
      })
      .addCase(updateOrganization.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      .addCase(deleteOrganization.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(deleteOrganization.fulfilled, (state, action) => {
        state.isLoading = false;
        // Remove the deleted organization from the state
        state.organizations = state.organizations.filter((organization) => organization._id !== action.payload);
        
      })
      .addCase(deleteOrganization.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(selectOrganizationById.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.selectedOrganization = null; // Clear previous data
      })
      .addCase(selectOrganizationById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.selectedOrganization = action.payload;
      })
      .addCase(selectOrganizationById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.selectedOrganization = null; // Clear previous data
        state.selectedOrganization = action.payload;
      });
      
  },
});

export const { reset } = organizationSlice.actions;

export default organizationSlice.reducer;
