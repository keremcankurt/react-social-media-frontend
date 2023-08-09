import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getLikePosts } from '../../features/post/postService';
import { toast } from 'react-toastify';
import { logoutUser } from '../../features/auth/authSlice';
import styles from './LikedPosts.module.scss'
import Posts from '../../components/posts/Posts';
export default function LikedPosts() {
    const {isSuccess, posts} = useSelector(
        (state) => state.post
    );
    const {user} = useSelector(
        (state) => state.user
    );
    const [likePosts, setLikePosts] = useState([]);
    const dispatch = useDispatch()
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await getLikePosts();
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message);
            }
            setLikePosts(result.likePosts)
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
        <Posts posts={likePosts}/>
        {
            likePosts?.length === 0 && 
            <span className={styles["error"]}>No liked posts found.</span>
        }
    </div>
  )
}
