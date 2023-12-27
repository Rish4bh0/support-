import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import issueTypeService from './issueService';

const initialState = {
  issueTypes: [],
  selectedIssueType : {},
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: ''
};

export const createIssueType = createAsyncThunk(
  'issues/create',
  async (nameData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const response = await issueTypeService.createIssueType(nameData, token);
      console.log('API Response:', response); 
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


// Get all issue types
export const getAllIssueTypes = createAsyncThunk(
  'issues/getAll',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await issueTypeService.getAllIssueTypes(token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Update issue type
export const updateIssueType = createAsyncThunk(
    'issues/update',
    async ({ id, issueData }, thunkAPI) => {
      try {
        const token = thunkAPI.getState().auth.user.token;
        const updatedIssueType = await issueTypeService.updateIssueType(id, issueData, token);
        console.log('API Response:', updatedIssueType);
        return updatedIssueType;
      } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  );

// Delete issue type
export const deleteIssueType = createAsyncThunk(
  'issues/delete',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      await issueTypeService.deleteIssueType(id, token);
      return id; // Return the deleted issue type's ID
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


  export const selectIssueTypeById = createAsyncThunk(
    'issues/selectById',
    async (id, thunkAPI) => {
      /**
       * thunkAPI: an object containing all of the parameters
       * that are normally passed to a Redux thunk function,
       * as well as additional options: https://redux-toolkit.js.org/api/createAsyncThunk
       */
      try {
        // Token is required for authentication
        const token = thunkAPI.getState().auth.user.token
        return await issueTypeService.selectIssueTypeById(id, token)
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
export const issueTypeSlice = createSlice({
  name: 'issueTypes',
  initialState,
  reducers: {
   
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createIssueType.pending, state => {
        state.isLoading = true
      })
      .addCase(createIssueType.fulfilled, state => {
        state.isLoading = false
        state.isSuccess = true
      })
      .addCase(createIssueType.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getAllIssueTypes.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getAllIssueTypes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.issueTypes = action.payload;
      })
      .addCase(getAllIssueTypes.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(updateIssueType.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = '';
      })
      .addCase(updateIssueType.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Update the issue type in the state with the updated data
        state.issueTypes = state.issueTypes.map((issueType) =>
          issueType._id === action.payload._id ? action.payload : issueType
        );
      })
      .addCase(updateIssueType.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      .addCase(deleteIssueType.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(deleteIssueType.fulfilled, (state, action) => {
        state.isLoading = false;
        // Remove the deleted issue type from the state
        state.issueTypes = state.issueTypes.filter((issueType) => issueType._id !== action.payload);
        
      })
      .addCase(deleteIssueType.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(selectIssueTypeById.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.selectedIssueType = null; // Clear previous data
      })
      .addCase(selectIssueTypeById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.selectedIssueType = action.payload;
      })
      .addCase(selectIssueTypeById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.selectedIssueType = null; // Clear previous data
        state.errorMessage = action.payload;
      });
      
  },
});

export const { reset } = issueTypeSlice.actions;

export default issueTypeSlice.reducer;
