import React from 'react'
import styles from "./FollowOperations.module.scss"
import { MagnifyingGlass } from 'react-loader-spinner';
import { useDispatch, useSelector } from 'react-redux';
import { acceptFriendRequest, cancelFollowRequest, declineFriendRequest, follow, unfollow } from '../../features/user/userSlice';
import MiniProfile from '../miniprofile/MiniProfile';

export default function FollowOperations({users, setUsers, _user}) {
    const {user} = useSelector(
        (state) => state.user
      );
    const dispatch = useDispatch()
  const handleFollowButton = async (id) => {
    const followedUser = users?.find((user) => user?._id === id);
    if (!followedUser) return;
    followedUser.isLoading = true;
    setUsers([...users]);
    await dispatch(follow(id)).then(() => {
      
  
        followedUser.isLoading = false;
        setUsers([...users]);
    });
  };
  const handleAcceptRequestButton = async (id) => {
    const followedUser = users?.find((user) => user?._id === id);
    if (!followedUser) return;
    followedUser.isLoading = true;
    setUsers([...users]);
    await dispatch(acceptFriendRequest(id)).then((res) => {
      if (res.payload.success) {
        followedUser.isLoading = false;
        setUsers([...users]);
      }
    });
  };
  const handleDeclineRequestButton = async (id) => {
    const followedUser = users?.find((user) => user?._id === id);
    if (!followedUser) return;
    followedUser.isLoading = true;
    setUsers([...users]);
    await dispatch(declineFriendRequest(id)).then((res) => {
      if (res.payload.success) {
        followedUser.isLoading = false;
        setUsers([...users]);
      }
    });
  };
  const handleCancelRequestButton = async (id) => {
    const followedUser = users?.find((user) => user?._id === id);
    if (!followedUser) return;
    followedUser.isLoading = true;
    setUsers([...users]);
    await dispatch(cancelFollowRequest(id)).then((res) => {
      if (res.payload.success) {
        followedUser.isLoading = false;
        setUsers([...users]);
      }
    });
  };
  const handleUnfollowButton = async (id) => {
    await dispatch(unfollow(id)).then(() => {
  
    });
  };
  return (
    <div className={styles["friend"]} >
        <MiniProfile  
            account={user} 
            user={_user}
        />
        {
            user?._id !== _user?._id &&
            (user?.followRequests?.includes(_user?._id)
            ?
            <button 
            className={styles.loading}
            onClick={() => handleCancelRequestButton(_user?._id)}
            >
            Cancel Request
            </button>
            :
            user?.friendRequests?.includes(_user?._id) 
            ?
            <div className={styles['buttons']}>
                <button disabled={_user.isLoading} 
                className={`${styles.follow} ${_user.isLoading ? styles.loading : ''}`}
                onClick={() => handleAcceptRequestButton(_user._id)}>
                {
                    !_user.isLoading ? "Confirm" :
                    <MagnifyingGlass color='blue'  height={20} width={50} />
                }
                </button>
                {!_user?.isLoading &&
                <button
                className={styles.loading}
                onClick={() => handleDeclineRequestButton(_user._id)}>
                Dismiss
                </button>
                }
            </div> 
            :
            user?.followings?.find((u) => u._id === _user._id) 
            ?
              <button
                className={`${styles.unfollow}`}
                  onClick={() => handleUnfollowButton(_user._id)}>Unfollow
              </button>
              :
              user?.followers?.includes(_user._id)
            ?
            <button disabled={_user.isLoading} 
            className={`${styles.follow} ${_user.isLoading ? styles.loading : ''}`}
            onClick={() => handleFollowButton(_user._id)}>
            {
                !_user.isLoading ? "Follow Back" :
                <MagnifyingGlass color='blue'  height={20} width={50} />
            }
            </button>
            :
            <button disabled={_user.isLoading} 
            className={`${styles.follow} ${_user.isLoading ? styles.loading : ''}`}
            onClick={() => handleFollowButton(_user._id)}>
            {
                !_user.isLoading ? "Follow" :
                <MagnifyingGlass color='blue'  height={20} width={50} />
            }
            </button>)
        }
    </div>
  )
}
