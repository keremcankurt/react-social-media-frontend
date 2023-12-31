import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import userReducer from "../features/user/userSlice";
import storyReducer from "../features/story/storySlice";
import postReducer from "../features/post/postSlice";
import commentReducer from "../features/comment/commentSlice";

export const store = configureStore({
    reducer: {
      auth: authReducer,
      user: userReducer,
      post: postReducer,
      story: storyReducer,
      comment: commentReducer,
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})