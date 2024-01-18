import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import projectService from './projectService';

const initialState = {
    project: [],
  selectedProject : {},
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: ''
};

export const createProject = createAsyncThunk(
  'project/create',
  async (nameData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const response = await projectService.createProject(nameData, token);
      console.log('API Response:', response); 
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


// Get all project
export const getAllProject = createAsyncThunk(
  'project/getAll',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await projectService.getAllProject(token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Update issue type
export const updateProject = createAsyncThunk(
    'project/update',
    async ({ id, projectData }, thunkAPI) => {
      try {
        const token = thunkAPI.getState().auth.user.token;
        const updatedProject = await projectService.updateProject(id, projectData, token);
        console.log('API Response:', updatedProject);
        return updatedProject;
      } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  );

// Delete issue type
export const deleteProject = createAsyncThunk(
  'project/delete',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      await projectService.deleteProject(id, token);
      return id; // Return the deleted project's ID
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


  export const selectProjectById = createAsyncThunk(
    'project/selectById',
    async (id, thunkAPI) => {
      /**
       * thunkAPI: an object containing all of the parameters
       * that are normally passed to a Redux thunk function,
       * as well as additional options: https://redux-toolkit.js.org/api/createAsyncThunk
       */
      try {
        // Token is required for authentication
        const token = thunkAPI.getState().auth.user.token
        return await projectService.selectProjectById(id, token)
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
export const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
   
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProject.pending, state => {
        state.isLoading = true
      })
      .addCase(createProject.fulfilled, state => {
        state.isLoading = false
        state.isSuccess = true
      })
      .addCase(createProject.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getAllProject.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getAllProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.project = action.payload;
      })
      .addCase(getAllProject.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(updateProject.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = '';
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Update the issue type in the state with the updated data
        state.project = state.project.map((project) =>
        project._id === action.payload._id ? action.payload : project
        );
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      .addCase(deleteProject.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.isLoading = false;
        // Remove the deleted issue type from the state
        state.project = state.project.filter((project) => project._id !== action.payload);
        
      })
      .addCase(deleteProject.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(selectProjectById.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.selectedProject = null; // Clear previous data
      })
      .addCase(selectProjectById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.selectedProject = action.payload;
      })
      .addCase(selectProjectById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.selectedProject = null; // Clear previous data
        state.errorMessage = action.payload;
      });
      
  },
});

export const { reset } = projectSlice.actions;

export default projectSlice.reducer;
