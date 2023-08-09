import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Header from '../../components/header/Header'
import Leftbar from '../../components/leftbar/Leftbar'
import styles from "./HomeLayout.module.scss"
import Rightbar from '../../components/rightbar/Rightbar'
import { useDispatch, useSelector } from 'react-redux'
import { getFollowingPosts } from '../../features/post/postSlice'

export default function HomeLayout() {
  const {user} = useSelector(
    (state) => state.auth
  );
  const navigate = useNavigate()
  const dispatch = useDispatch()
  useEffect(() =>{
    if(!user){
        navigate("/login");
    }else{
      dispatch(getFollowingPosts())
    }
}, [user,navigate, dispatch])
  return (
    <div>
        <Header/>
        <div className={styles["container"]}>
          <div className={styles["leftbar"]}>
            <Leftbar/>
          </div>
          <div className={styles["content"]}>
            <Outlet/>
          </div>
          <div className={styles["rightbar"]}>
            <Rightbar/>
          </div>
        </div>
        
    </div>
  )
}
