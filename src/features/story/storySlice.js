import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import storyService from "./storyService";
import { toast } from "react-toastify";
import { logoutUser } from "../auth/authSlice";
import { removeStory, updateOwnedStories, updateStoryViewers } from "../user/userSlice";
const initialState = {
    stories: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
  };
  export const addStory = createAsyncThunk('story/add', async (data=null,thunkAPI) => {
    try {
      const response = await storyService.addStory(data);
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }
      toast.success(result.message);
      thunkAPI.dispatch(updateOwnedStories(result.story))
      return result;
    } catch (error) {
        toast.error(error.message);
        if(error.message === "You are not authorized to access this route"){
          thunkAPI.dispatch(logoutUser());
        }
        return thunkAPI.rejectWithValue(error.message);
    }
  });
  export const addStoryViewer = createAsyncThunk('story/viewers', async (data=null,thunkAPI) => {
    try {
      const response = await storyService.addStoryViewer(data);
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }
      thunkAPI.dispatch(updateStoryViewers(result))
      return result;
    } catch (error) {
        toast.error(error.message);
        if(error.message === "You are not authorized to access this route"){
          thunkAPI.dispatch(logoutUser());
        }
        return thunkAPI.rejectWithValue(error.message);
    }
  });
  export const deleteStory = createAsyncThunk('story/delete', async (data=null,thunkAPI) => {
    try {
      const response = await storyService.deleteStory(data);
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }
      thunkAPI.dispatch(removeStory(data))
      return result;
    } catch (error) {
        toast.error(error.message);
        if(error.message === "You are not authorized to access this route"){
          thunkAPI.dispatch(logoutUser());
        }
        return thunkAPI.rejectWithValue(error.message);
    }
  });
  export const storySlice = createSlice({
    name: "story",
    initialState,
    reducers: {
      reset: (state) => {
        state.isError = false;
        state.isSuccess = false;
        state.isLoading = false;
        state.message = "";
        state.stories = [];
      },
    },
    extraReducers: (builder) => {
        builder
        .addCase(addStory.rejected, (state) => {
          state.isLoading = false
          state.isError = false
          state.isSuccess = false
          state.message = ""
        })
        .addCase(addStory.fulfilled, (state,action) => {
          state.isLoading = false
          state.isSuccess = true
          state.isError = false
        }) 
    }

});

export const { reset } = storySlice.actions;
export default storySlice.reducer;