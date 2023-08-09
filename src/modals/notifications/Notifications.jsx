import React, { useEffect, useState } from 'react';
import styles from './Notifications.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { logoutUser } from '../../features/auth/authSlice';
import { followRequests, friendRequests } from '../../features/user/userService';
import FollowOperations from '../../components/followOperations/FollowOperations';

export default function Notifications({open, setOpen}) {
  const {user} = useSelector(
    (state) => state.user
  );
  const [friendRequestUsers, setFriendRequestUsers] = useState([])
  const [followRequestsUsers, setFollowRequestsUsers] = useState([])
  
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await friendRequests();
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message);
        }
        setFriendRequestUsers(result.friendRequests);
      } catch (error) {
        toast.error(error.message);
        if(error.message === "You are not authorized to access this route"){
          dispatch(logoutUser());
        }
      }
    };
    fetchData();
    
  }, [dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await followRequests();
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message);
        }
        setFollowRequestsUsers(result.followRequests);
      } catch (error) {
        toast.error(error.message);
        if(error.message === "You are not authorized to access this route"){
          dispatch(logoutUser());
        }
      }
    };
    fetchData();
    
  }, [dispatch, user?.followRequests]);

  const handleCloseButton = () => {
    setOpen(false)
  }
  return (
    <>
    {
      open &&
      <div className={`${styles.container}`}>
       <button className={styles["close"]} onClick={handleCloseButton}>x</button>
       <div className={styles["requests"]}>
        {
          friendRequestUsers && user?.friendRequests?.length> 0 &&
          <div className={styles["requests-container"]}>
            <h2 className={styles["title"]}>Follow Requests</h2>
            <div className={styles["requests-user"]}>
              {friendRequestUsers?.map((_user, index) => 
                (
                  user?.friendRequests?.includes(_user._id) && 
                  <FollowOperations key={_user._id} _user={_user} users={friendRequestUsers} setUsers={setFriendRequestUsers}/>
                ))}
            </div>
          </div>
        }
        {
          followRequestsUsers && user?.followRequests?.length> 0 &&
          <div className={styles["requests-container"]}>
            <h2 className={styles["title"]}>Sent Follow Requests</h2>
            <div className={styles["requests-user"]}>
              {followRequestsUsers?.map((_user, index) => 
                (
                  user?.followRequests?.includes(_user._id) && 
                  <FollowOperations key={_user._id} _user={_user} users={followRequestsUsers} setUsers={setFollowRequestsUsers}/>
                ))}
            </div>
          </div>
        }
       </div>
       <div className={styles["notifications"]}>
          Bildirimler
       </div>
      
      </div>}
    </>
  );
}
