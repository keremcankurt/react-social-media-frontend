import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from 'react-toastify';
import authService from "./authService";


const user = JSON.parse(localStorage.getItem("user"));
const initialState = {
  user: user ? user : null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};
export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
  try {
    const response = await authService.login(JSON.stringify(user));
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message);
    }
    localStorage.setItem('user',JSON.stringify(result));
    return result;
  } catch (error) {
    toast.error(error.message);
    return thunkAPI.rejectWithValue(error.message);
  }
});
export const logout = createAsyncThunk('auth/logout', async (data=null,thunkAPI) => {
  try {
    const response = await authService.logout();
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message);
    }
    localStorage.removeItem('user');
    toast.success(result.message);
    return result;
  } catch (error) {
    toast.error(error.message);
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const register = createAsyncThunk('auth/register', async (user, thunkAPI) => {
  try {
    const response = await authService.register(JSON.stringify(user));
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message);
    }
    toast.success(result.message);
    return result;
  } catch (error) {
    toast.error(error.message);
    return thunkAPI.rejectWithValue(error.message);
  }
});



  export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
      reset: (state) => {
        state.isError = false;
        state.isSuccess = false;
        state.isLoading = false;
        state.message = "";
      },
      logoutUser: (state) => {
        state.isError = false;
        state.isSuccess = false;
        state.isLoading = false;
        state.message = "";
        state.user = null;
        localStorage.removeItem("user");
      },
    },
    extraReducers: (builder) => {
        builder
        .addCase(login.pending, (state) => {
          state.isLoading = true
        })
        .addCase(login.fulfilled, (state,action) => {
          state.isLoading = false
          state.user = action.payload;
        })
        .addCase(login.rejected, (state,action) => {
          state.isLoading = false
        })
        .addCase(register.pending, (state) => {
          state.isLoading = true
        })
        .addCase(register.fulfilled, (state,action) => {
          state.isLoading = false
          state.isSuccess = true
        })
        .addCase(register.rejected, (state,action) => {
          state.isLoading = false
        })
        .addCase(logout.fulfilled, (state,action) => {
          state.isLoading = false
          state.isSuccess = false
          state.isError = false
          state.message = ""
          state.user = null
        })
    }

});

export const { reset, logoutUser } = authSlice.actions;
export default authSlice.reducer;