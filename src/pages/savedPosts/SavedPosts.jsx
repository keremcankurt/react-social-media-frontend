import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getSavedPosts } from '../../features/post/postService';
import { toast } from 'react-toastify';
import { logoutUser } from '../../features/auth/authSlice';
import styles from './SavedPosts.module.scss'
import Posts from '../../components/posts/Posts';
export default function SavedPosts() {
    const {isSuccess, posts} = useSelector(
        (state) => state.post
    );
    const {user} = useSelector(
        (state) => state.user
    );
    const [savedPosts, setsavedPosts] = useState([]);
    const dispatch = useDispatch()
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await getSavedPosts();
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message);
            }
            setsavedPosts(result.savedPosts)
          } catch (error) {
            toast.error(error.message);
            if(error.message === "You are not authorized to access this route"){
              dispatch(logoutUser());
            }
          }
        };
        if(isSuccess){
  
          fetchData();
        }
      },[isSuccess,user,posts,dispatch])
  return (
    <div className={styles["container"]}>
        <Posts posts={savedPosts}/>
        {
          savedPosts?.length === 0 && 
            <span className={styles["error"]}>No saved posts found.</span>
        }
    </div>
  )
}
