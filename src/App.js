import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"
import HomeLayout from "./layouts/homeLayout/HomeLayout";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getUser } from "./features/user/userSlice";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import LikedPosts from "./pages/likedPosts/LikedPosts";
import SavedPosts from "./pages/savedPosts/SavedPosts";
function App() {
  const {user} = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  useEffect(() => {
    if(user){
      dispatch(getUser());
    }
  },[dispatch,user])
  return (
    <>
      <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path="/" element={<HomeLayout/>}>
          <Route index={true} element={<Home/>}/>
          <Route path="profile" element={<Profile/>}/>
          <Route path="likedposts" element={<LikedPosts/>}/>
          <Route path="savedposts" element={<SavedPosts/>}/>
        </Route>
      </Routes>
      <ToastContainer/>
    </>
  );
}

export default App;
