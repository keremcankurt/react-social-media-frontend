import React, { useEffect, useState } from 'react'
import styles from './Rightbar.module.scss'
import { recommendedUsers } from '../../features/user/userService';
import { toast } from 'react-toastify';
import { FaBookmark, FaGamepad, FaHeart, FaUser } from 'react-icons/fa';
import FollowOperations from '../followOperations/FollowOperations';
import { logoutUser } from '../../features/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
export default function Rightbar() {
  const [recommended, setRecommended] = useState([])
  const {user} = useSelector(
    (state) => state.user
);
  const dispatch = useDispatch()
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await recommendedUsers();
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message);
        }
        setRecommended(result.recommendedUsers);
      } catch (error) {
        toast.error(error.message);
        if(error.message === "You are not authorized to access this route"){
          dispatch(logoutUser());
        }
      }
    };
    fetchData();
    
  }, [dispatch]);
  return (
    <div className={styles["container"]}>
      <div className={styles["top"]}>
        <div className={styles['content-container']}>
          <Link to='/likedposts' className={styles["liked-posts"]}>Liked Posts  <FaHeart style={{ color: 'red' }}/></Link>
          <Link  className={styles["games"]}>Games <FaGamepad /></Link>
          <Link to={`/profile?id=${user?._id}`} className={styles["profile"]}>Profile <FaUser /></Link>
          <Link to='savedposts' className={styles["saved"]}>Saved <FaBookmark /></Link>
        </div>

      </div>
      <div className={styles["bottom"]}>
        <div className={styles["recommendedfriends"]}>
          <h2 className={styles["title"]}>Suggested for You</h2>
          <div className={styles["recommended"]}>
            {recommended?.map((_user, index) => 
            (
              !user?.followings?.find((u) => u._id === _user._id) &&
              <FollowOperations key={_user._id} _user={_user} users={recommended} setUsers={setRecommended}/>
              
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
