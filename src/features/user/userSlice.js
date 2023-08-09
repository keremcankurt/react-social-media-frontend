import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import userService from "./userService";
import { toast } from "react-toastify";
import { logout, logoutUser } from "../auth/authSlice";
import { deletePost, savePost } from "../post/postSlice";
const initialState = {
    user: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
  };
  export const getUser = createAsyncThunk('user/getUser', async (data=null,thunkAPI) => {
    try {
      const response = await userService.getUser();
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }
      return result;
    } catch (error) {
        toast.error(error.message);
        if(error.message === "You are not authorized to access this route"){
          thunkAPI.dispatch(logoutUser());
        }
        return thunkAPI.rejectWithValue(error.message);
    }
  });
  export const follow = createAsyncThunk('user/follow', async (data=null,thunkAPI) => {
    try {
      const response = await userService.follow(data);
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }
      
      return result;
    } catch (error) {
        toast.error(error.message);
        if(error.message === "You are not authorized to access this route"){
          thunkAPI.dispatch(logoutUser());
        }
        return thunkAPI.rejectWithValue(error.message);
    }
  });
  export const unfollow = createAsyncThunk('user/unfollow', async (data=null,thunkAPI) => {
    try {
      const response = await userService.unfollow(data);
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
  export const acceptFriendRequest = createAsyncThunk('user/accept', async (data=null,thunkAPI) => {
    try {
      const response = await userService.acceptFriendRequest(data);
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }
      return result;
    } catch (error) {
        toast.error(error.message);
        if(error.message === "You are not authorized to access this route"){
          thunkAPI.dispatch(logoutUser());
        }
        return thunkAPI.rejectWithValue(error.message);
    }
  });
  export const declineFriendRequest = createAsyncThunk('user/decline', async (data=null,thunkAPI) => {
    try {
      const response = await userService.declineFriendRequest(data);
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }
      return result;
    } catch (error) {
        toast.error(error.message);
        if(error.message === "You are not authorized to access this route"){
          thunkAPI.dispatch(logoutUser());
        }
        return thunkAPI.rejectWithValue(error.message);
    }
  });
  export const cancelFollowRequest = createAsyncThunk('user/cancel', async (data=null,thunkAPI) => {
    try {
      const response = await userService.cancelFollowRequest(data);
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }
      return result;
    } catch (error) {
        toast.error(error.message);
        if(error.message === "You are not authorized to access this route"){
          thunkAPI.dispatch(logoutUser());
        }
        return thunkAPI.rejectWithValue(error.message);
    }
  });
  export const editProfile = createAsyncThunk('user/edit', async (data=null,thunkAPI) => {
    try {
      const response = await userService.editProfile(data);
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }
      return result;
    } catch (error) {
        toast.error(error.message);
        if(error.message === "You are not authorized to access this route"){
          thunkAPI.dispatch(logoutUser());
        }
        return thunkAPI.rejectWithValue(error.message);
    }
  });
  export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
      reset: (state) => {
        state.isError = false;
        state.isSuccess = false;
        state.isLoading = false;
        state.message = "";
      },
      updateOwnedStories: (state,action) => {
        state.user.stories.push(action.payload);
        state.user.viewedStories.push(action.payload._id);
      },
      addPost: (state,action) => {
        state.user.posts.push(action.payload)
      },
      addPostToLikedPosts: (state,action) => {
        const postId = action.payload.postId;
          if(state.user?.likePosts?.includes(postId)){
            state.user.likePosts = state.user.likePosts.filter((id) => id !== postId);
          }
          else{
            state.user.likePosts.push(postId)
          }
      },
      addCommentIdToComments: (state,action) => {
        const commentId = action.payload.commentId;
        state.user.comments.push(commentId)
      },
      updateStoryViewers: (state,action) => {
        const { authorId, storyId } = action.payload;
        if(!(authorId && storyId)) return
        const userId = state.user._id;
        state.user.viewedStories.push(storyId)
        const followingUser = state.user.followings.find((user) => user._id === authorId);
        if (followingUser) {
          const story = followingUser.stories.find((story) => story._id === storyId);
          if (story) {
            if (!story.viewers.includes(userId)) {
              story.viewers.push(userId);
            }
          }
        }
      },
      removeStory: (state,action) => {
        state.user.stories = state.user.stories.filter(
          (story) => story._id !== action.payload
        );

      },
      updatedStories: (state) => {
        const followings = state.user.followings;
         state.user.followings = followings.sort((a, b) => {
          const latestStoryA = a.stories.length > 0 ? a.stories[a.stories.length - 1] : null;
          const latestStoryB = b.stories.length > 0 ? b.stories[b.stories.length - 1] : null;

          const isViewerA = latestStoryA ? state.user.viewedStories.includes(latestStoryA._id) : false;
          const isViewerB = latestStoryB ? state.user.viewedStories.includes(latestStoryB._id) : false;

          // If the user is not a viewer in both stories or both stories are null, sort by the latest createdAt date
          if (!isViewerA && !isViewerB) {
              return latestStoryB ? new Date(latestStoryB?.createdAt) - new Date(latestStoryA?.createdAt) : -1;
          }

          // If one story is null or the user is not a viewer in one of the stories, prioritize the one with the viewer status
          if ((!latestStoryA || !isViewerA) && latestStoryB && isViewerB) {
              return -1;
          }
          if ((!latestStoryB || !isViewerB) && latestStoryA && isViewerA) {
              return 1;
          }

          // If both stories have the viewer status, sort by the latest createdAt date
          return new Date(latestStoryB.createdAt) - new Date(latestStoryA.createdAt);
        });
      }
    },
    extraReducers: (builder) => {
        builder
        .addCase(getUser.pending, (state) => {
          state.isLoading = true
        })
        .addCase(getUser.rejected, (state) => {
          state.isLoading = false
          state.user = null
          state.isError = false
          state.isSuccess = false
          state.message = ""
        })
        .addCase(getUser.fulfilled, (state,action) => {
          state.isLoading = false
          state.isSuccess = true
          state.isError = false
          state.user = action.payload.user
          userSlice.caseReducers.updatedStories(state, action);
        })
        .addCase(logout.fulfilled, (state) => {
          state.isLoading = false
          state.isSuccess = false
          state.isError = false
          state.message = ""
          state.user = null
        })  
        .addCase(follow.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = false;
          state.isError = false;
          state.message = "";
        
          const followedUser = action.payload.user;
          if (followedUser.private) {
            if (!state.user.followRequests) {
              state.user.followRequests = [followedUser._id];
            } else if (state.user.followRequests.indexOf(followedUser._id) === -1) {
              state.user.followRequests.push(followedUser._id);
            }
          } else {
            if (!state.user.followings) {
              state.user.followings = [followedUser];
            } else {
              const alreadyFollowing = state.user.followings.find(
                (followingUser) => followingUser._id === followedUser._id
              );
              if (!alreadyFollowing) {
                state.user.followings.push(followedUser);
              }
            }
          }
          userSlice.caseReducers.updatedStories(state, action);
        })
        .addCase(unfollow.fulfilled, (state, action) => {
          const userIdToUnfollow = action.payload;
          state.user.followings = state.user.followings.filter((user) => user._id !== userIdToUnfollow);
        })
        .addCase(acceptFriendRequest.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = false;
          state.isError = false;
          state.message = "";
          state.user.friendRequests = action.payload.friendRequests;
          state.user.followers = action.payload.followers;
          userSlice.caseReducers.updatedStories(state, action);

        })
        .addCase(declineFriendRequest.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = false;
          state.isError = false;
          state.message = "";
          state.user.friendRequests = action.payload.friendRequests;
        })
        .addCase(cancelFollowRequest.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = false;
          state.isError = false;
          state.message = "";
          state.user.followRequests = action.payload.followRequests;
        })
        .addCase(deletePost.fulfilled, (state,action) => {
          const postIdToDelete = action.payload; 
          state.user.posts = state.user.posts.filter((id) => id !== postIdToDelete);
        })
        .addCase(savePost.fulfilled, (state,action) => {
          const postId = action.meta.arg;
          if(state.user?.savedPosts?.includes(postId)){
            state.user.savedPosts = state.user.savedPosts.filter((savedPostId) => savedPostId !== postId);
          }
          else{
            state.user.savedPosts.push(postId)
          }
        })
        .addCase(editProfile.fulfilled, (state,action) => {
          state.user.name = action.payload.name;
          state.user.place = action.payload.place;
          state.user.private = action.payload.private;
          state.user.githubURL = action.payload.githubURL;
          state.user.profilePicture = action.payload.profilePicture;
          const user = {
            profilePicture: action.payload.profilePicture,
            name: action.payload.name
          }
          localStorage.setItem('user', JSON.stringify(user));
        })
        
        
    }

});

export const { 
  reset, 
  addPost,
  removeStory,
  updatedStories, 
  updateStoryViewers, 
  updateOwnedStories, 
  addPostToLikedPosts,
  addCommentIdToComments
 } = userSlice.actions;
export default userSlice.reducer;