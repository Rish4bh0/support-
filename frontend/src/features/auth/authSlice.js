import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService from './authService'

// Get logged in user info from localStorage
const user = JSON.parse(localStorage.getItem('user'))

const initialState = {
  user: user ? user : null,
  users: [],
  selectedUser: {},
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: ''
}

// Register new user
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

/**
 * 'auth/register' is the action type string in this case.
 * Whenever this function is dispatched from a component within our application,
 * 'createAsyncThunk' generates promise lifecycle action types using this
 * string as a prefix.
 * pending: auth/register/pending
 * fulfilled: auth/register/fulfilled
 * rejected: auth/register/rejected
 */

/**
 * On its initial call, 'createAsyncThunk' dispatches the auth/register/pending
 * lifecycle action type. The payloadCreator then executes to return either a
 * result or an error.
 *
 * In the event of an error, auth/register/rejected is dispatched and
 * 'createAsyncThunk' should either return a rejected promise containing
 * an Error instance, a plain descriptive message,
 * or a resolved promise with a RejectWithValue
 * argument as returned by the thunkAPI.rejectWithValue function.
 *
 * If our data fetch is successful, the posts/getPosts/fulfilled action
 * type gets dispatched.
 *
 */

export const register = createAsyncThunk(
  //action type string
  'auth/register',

  // callback function
  async (user, thunkAPI) => {
    try {
      return await authService.register(user)
    } catch (error) {
      /**
       * Remember that when your 'payloadCreator' returns a rejected promise,
       * the 'rejected' action is dispatched (with 'action.payload' as 'undefined').
       */
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      /**
       * By using 'thunkAPI', you can return a resolved promise to the reducer,
       * which has 'action.payload' set to a custom value of your choice.
       * 'thunkAPI' uses its 'rejectWithValue' property to perform this.
       */
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Login user
export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
  try {
    return await authService.login(user)
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString()

    return thunkAPI.rejectWithValue(message)
  }
})

// Logout user
export const logout = createAsyncThunk('auth/logout', async () => {
  await authService.logout()
})

export const fetchAllUsers = createAsyncThunk(
  'auth/fetchAllUsers',
  async (_, thunkAPI) => {
    try {
      return await authService.getAllUsers();
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


export const createUser = createAsyncThunk(
  'auth/create',
  async (createData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const response = await authService.createUser(createData, token);
      console.log('API Response:', response); // Log the entire response
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  'auth/update',
  async ({ id, userData, token }, thunkAPI) => {
    try {
      const updatedUser = await authService.updateUser(id, userData, token);
      return updatedUser;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
export const deleteUser = createAsyncThunk(
  'auth/delete',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      await authService.deleteUser(id, token);
      return id; // Return the deleted user ID
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const selectUserById = createAsyncThunk(
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
      return await authService.selectUserById(id, token)
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
/**
 * A Slice 'createSlice' function that accepts an initial state, an object of reducer functions,
 * and a "slice name", and automatically generates action creators and
 * action types that correspond to the reducers and state.
 */
/**
 * Within 'createSlice', synchronous requests made to the store are handled
 * in the reducers object while extraReducers handles asynchronous requests
 */
export const authSlice = createSlice({
  // A name, used in action types
  name: 'auth',
  // The initial state for the reducer
  initialState,
  // An object of "case reducers". Key names will be used to generate actions.
  reducers: {
    reset: state => {
      state.isError = false
      state.isLoading = false
      state.isSuccess = false
      state.message = ''
    }
  },
  /**
   *
   * extraReducers: One of the key concepts of Redux is that each slice reducer "owns"
   * its slice of state, and that many slice reducers can independently
   * respond to the same action type. extraReducers allows createSlice
   * to respond to other action types besides the types it has generated.
   *
   */

  /**
   *
   * The three lifecycle action types mentioned earlier can then be evaluated
   * in extraReducers, where we make our desired changes to the store.
   * In this case
   */
  extraReducers: builder => {
    builder
    .addCase(fetchAllUsers.pending, state => {
      state.isLoading = true;
    })
    .addCase(fetchAllUsers.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true
      state.users = action.payload; // Store the list of users
    })
    .addCase(fetchAllUsers.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
    })
      .addCase(register.pending, state => {
        state.isLoading = true
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        state.user = null
      })
      .addCase(login.pending, state => {
        state.isLoading = true
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        state.user = null
      })
      .addCase(createUser.pending, state => {
        state.isLoading = true
      })
      .addCase(createUser.fulfilled, state => {
        state.isLoading = false
        state.isSuccess = true
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = '';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = state.users.map((user) =>
        user._id === action.payload._id ? action.payload : user
        );
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false;
        // Remove the deleted organization from the state
        state.users = state.users.filter((user) => user._id !== action.payload);
        
      })
      .addCase(deleteUser.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(logout.fulfilled, state => {
        state.user = null
      })
      .addCase(selectUserById.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.selectedUser = null; // Clear previous data
      })
      .addCase(selectUserById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.selectedUser = action.payload;
      })
      .addCase(selectUserById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.selectedUser = null; // Clear previous data
        state.selectedUser = action.payload;
      });
  }
})

export const { reset } = authSlice.actions
/**
 * Every slice you create must be added to your Redux store (src/app/store.js)
 * so you can gain access to its contents.
 */
export default authSlice.reducer
