import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { logoutUser } from "../auth/authSlice";
import postService from "./postService";
import { addPost, addPostToLikedPosts } from "../user/userSlice";
const initialState = {
    posts: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
  };
  export const createPost = createAsyncThunk('post/create', async (data=null,thunkAPI) => {
    try {
      const response = await postService.createPost(data);
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }
      toast.success(result.message);
      thunkAPI.dispatch(addPost(result?.post?._id))
      return result;
    } catch (error) {
        toast.error(error.message);
        if(error.message === "You are not authorized to access this route"){
          thunkAPI.dispatch(logoutUser());
        }
        return thunkAPI.rejectWithValue(error.message);
    }
  });
  export const updatePost = createAsyncThunk('post/update', async (data=null,thunkAPI) => {
    try {
      const response = await postService.updatePost(data.post, data.id);
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }
      toast.success(result.message);
      return result;
    } catch (error) {
        toast.error(error.message);
        if(error.message === "You are not authorized to access this route"){
          thunkAPI.dispatch(logoutUser());
        }
        return thunkAPI.rejectWithValue(error.message);
    }
  });
  export const deletePost = createAsyncThunk('post/delete', async (data=null,thunkAPI) => {
    try {
      const response = await postService.deletePost(data);
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }
      toast.success(result.message);
      return data;
    } catch (error) {
        toast.error(error.message);
        if(error.message === "You are not authorized to access this route"){
          thunkAPI.dispatch(logoutUser());
        }
        return thunkAPI.rejectWithValue(error.message);
    }
  });
  export const savePost = createAsyncThunk('post/save', async (data=null,thunkAPI) => {
    try {
      const response = await postService.savePost(data);
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }
      return data;
    } catch (error) {
        toast.error(error.message);
        if(error.message === "You are not authorized to access this route"){
          thunkAPI.dispatch(logoutUser());
        }
        return thunkAPI.rejectWithValue(error.message);
    }
  });
  export const likePost = createAsyncThunk('post/like', async (data=null,thunkAPI) => {
    try {
      const response = await postService.likePost(data.postId);
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }
      thunkAPI.dispatch(addPostToLikedPosts(data))
      return data;
    } catch (error) {
        toast.error(error.message);
        if(error.message === "You are not authorized to access this route"){
          thunkAPI.dispatch(logoutUser());
        }
        return thunkAPI.rejectWithValue(error.message);
    }
  });
  export const getFollowingPosts = createAsyncThunk('post/followingposts', async (data=null,thunkAPI) => {
    try {
      const response = await postService.getFollowingPosts();
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }
      toast.success(result.message);
      return result;
    } catch (error) {
        toast.error(error.message);
        if(error.message === "You are not authorized to access this route"){
          thunkAPI.dispatch(reset())
          thunkAPI.dispatch(logoutUser());
        }
        return thunkAPI.rejectWithValue(error.message);
    }
  });
  export const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
      reset: (state) => {
        state.isError = false;
        state.isSuccess = false;
        state.isLoading = false;
        state.message = "";
        state.posts = [];
      },
      addCommentToPost: (state, action) => {
        const { postId } = action.payload.comment;
        const postIndex = state.posts.findIndex((post) => post._id === postId);
        if (postIndex === -1) {
          return;
        }
        state.posts[postIndex].comments.unshift(action.payload.comment);
      },
      deleteCommentToPost: (state, action) => {
        const { postId, commentId } = action.payload;
        const postIndex = state.posts.findIndex((post) => post._id === postId);
        if (postIndex === -1) {
          return;
        }
        state.posts[postIndex].comments = 
        state.posts[postIndex].comments.filter((comment) => comment._id !== commentId);
      },
      
    },
    extraReducers: (builder) => {
      builder
      .addCase(getFollowingPosts.fulfilled, (state,action) => {
        state.isSuccess = true
        state.posts = action.payload.posts;
      })
      .addCase(createPost.fulfilled, (state,action) => {
        state.posts.unshift(action.payload.post);
      })
      .addCase(deletePost.fulfilled, (state,action) => {
        const postIdToDelete = action.payload; 
        state.posts = state.posts.filter((post) => post._id !== postIdToDelete);
      })
      .addCase(likePost.fulfilled, (state,action) => {
        const { postId, userId } = action.meta.arg;
        const post = state.posts.find((post) => post._id === postId);

        if (post) {
          const isLiked = post.likes.includes(userId);

          if (!isLiked) {
            post.likes.push(userId);
          } else {
            post.likes = post.likes.filter((likedUserId) => likedUserId !== userId);
          }
        }
      })
      .addCase(updatePost.fulfilled, (state,action) => {
        const updatedPostId = action.payload.post._id;
        const updatedPosts = state.posts.map((post) =>
        post._id === updatedPostId ? action.payload.post : post
      );

      state.posts = updatedPosts;
      })
    }

});

export const { reset, addCommentToPost, deleteCommentToPost } = postSlice.actions;
export default postSlice.reducer;