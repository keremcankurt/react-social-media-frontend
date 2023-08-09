import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { logoutUser } from "../auth/authSlice";
import commentService from "./commentService";
import { addCommentToPost, deleteCommentToPost } from "../post/postSlice";
import { addCommentIdToComments } from "../user/userSlice";
const initialState = {
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
  };
  export const addComment = createAsyncThunk('comment/create', async (data=null,thunkAPI) => {
    try {
      const response = await commentService.addComment(JSON.stringify(data), data.id);
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }
      thunkAPI.dispatch(addCommentToPost(result))
      thunkAPI.dispatch(addCommentIdToComments(result))
      return result;
    } catch (error) {
        toast.error(error.message);
        if(error.message === "You are not authorized to access this route"){
          thunkAPI.dispatch(logoutUser());
        }
        return thunkAPI.rejectWithValue(error.message);
    }
  });
  export const deleteComment = createAsyncThunk('comment/create', async (data=null,thunkAPI) => {
    try {
      const response = await commentService.deleteComment(data.commentId);
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }
      thunkAPI.dispatch(deleteCommentToPost(data))
      return result;
    } catch (error) {
        toast.error(error.message);
        if(error.message === "You are not authorized to access this route"){
          thunkAPI.dispatch(logoutUser());
        }
        return thunkAPI.rejectWithValue(error.message);
    }
  });
  export const commentSlice = createSlice({
    name: "comment",
    initialState,
    reducers: {
      reset: (state) => {
        state.isError = false;
        state.isSuccess = false;
        state.isLoading = false;
        state.message = "";
      },
    },
    extraReducers: (builder) => {
      builder
      .addCase(addComment.pending, (state,action) => {
        state.isLoading = true
      })
      .addCase(addComment.fulfilled, (state,action) => {
        state.isLoading = false
      })
    }

});

export const { reset } = commentSlice.actions;
export default commentSlice.reducer;