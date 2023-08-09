/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Posts from '../../components/posts/Posts';
import styles from './Profile.module.scss'
import MiniProfile from '../../components/miniprofile/MiniProfile';
import { getUserPosts } from '../../features/post/postService';
import { toast } from 'react-toastify';
import { logoutUser } from '../../features/auth/authSlice';
import { acceptFriendRequest, cancelFollowRequest, declineFriendRequest, follow, unfollow } from '../../features/user/userSlice';
import EditProfile from '../../modals/editProfile/EditProfile';
import { MdLocationOn } from 'react-icons/md';
import { FaGithub } from 'react-icons/fa';
import { followerUsers, followingUsers } from '../../features/user/userService';
import Following from '../../modals/following/Following';
export default function Profile() {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [followingUserProfiles, setFollowingUsers] = useState([]);
    const [followerUserProfiles, setFollowerUsers] = useState([]);
    const [showFollowingModal, setShowFollowingModal] = useState(false);
    const [showFollowerModal, setShowFollowerModal] = useState(false);
    const openFollowingModal = () => {
      setShowFollowingModal(true);
    };
    const openFollowerModal = () => {
      setShowFollowerModal(true);
    };
  
    const closeFollowingModal = () => {
      setShowFollowingModal(false);
      setShowFollowerModal(false);
    };
    const openEditModal = () => {
      setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
      setIsEditModalOpen(false);
    };
    const [profile, setProfile] = useState({})
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');

    const {isSuccess, posts} = useSelector(
        (state) => state.post
    );
    const {isLoading} = useSelector(
        (state) => state.comment
    );
    const {user} = useSelector(
        (state) => state.user
    );
    const [profilePosts, setProfilePosts] = useState([])
    const dispatch = useDispatch()
    useEffect(() => {
        if(isSuccess){
            if(user?._id === id){
                setProfile(user)
            }
            else{
                setProfile(user?.followings.find(following => following?._id === id))
            }
        
      }
        
    },[isSuccess, id, dispatch, user, isLoading])
    const fetchData = async () => {
      try {
        const response = await getUserPosts(id);
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message);
        }
        setProfilePosts(result.posts)
          setProfile(result.user)
      } catch (error) {
        toast.error(error.message);
        if(error.message === "You are not authorized to access this route"){
          dispatch(logoutUser());
        }
      }
    };
    useEffect(() => {
      closeFollowingModal()
      if(!isLoading){
        if(isSuccess){
            if(user?._id === id || posts?.find((post) => (post?.author || post?.author?._id) === id)){
                const filteredPosts = posts.filter((post) => (post?.author || post?.author?._id)=== id);
                setProfilePosts(filteredPosts);
            }else{
                fetchData();
            }
        }
      }
        
    },[isSuccess,id,user,posts, isLoading])
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await followingUsers(id);
          const result = await response.json();
          if (!response.ok) {
              throw new Error(result.message);
          }
          setFollowingUsers(result.followingUsers)
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
    },[isSuccess,id, user])
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await followerUsers(id);
          const result = await response.json();
          if (!response.ok) {
              throw new Error(result.message);
          }
          setFollowerUsers(result.followerUsers)
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
    },[isSuccess,id, user])
    const handleFollowButton = async (id) => {
        await dispatch(follow(id)).then(() => {
          setProfilePosts([])
          fetchData()
      
        });
      };
    const handleUnfollowButton = async (id) => {
        await dispatch(unfollow(id)).then(() => {
          setProfilePosts([])
          fetchData()
      
        });
      };
      const handleAcceptRequestButton = async (id) => {
        await dispatch(acceptFriendRequest(id)).then((res) => {
          if (res.payload.success) {
            setProfilePosts([])
            fetchData()
          }
        });
      };
      const handleDeclineRequestButton = async (id) => {
        await dispatch(declineFriendRequest(id)).then((res) => {
          if (res.payload.success) {
            setProfilePosts([])
            fetchData()
          }
        });
      };
      const handleCancelRequestButton = async (id) => {
        await dispatch(cancelFollowRequest(id)).then((res) => {
          if (res.payload.success) {
            setProfilePosts([])
            fetchData()
          }
        });
      };
  return (
  <>
    <div className={styles["container"]}>
        <div className={styles["profile"]}>
            <div className={styles["left"]}>
              {
                user?._id === id ? <MiniProfile user={user} account={user}/> 
                :user?.followings.find(following => following?._id === id)
                ?  <MiniProfile user={user?.followings.find(following => following?._id === id)} account={user}/>
                :
                <MiniProfile user={profile} account={user}/>

              }
                
                
                {
                    user?._id === id ? <button className={styles["edit"]} onClick={openEditModal}>
                      Edit Profile
                    </button>
                    :
                    user?.followRequests?.includes(id)
                    ?
                    <button 
                    className={styles.loading}
                    onClick={() => handleCancelRequestButton(id)}
                    >
                    Cancel Request
                    </button>
                    :
                    user?.friendRequests?.includes(id) 
                    ?
                    <div className={styles['buttons']}>
                        <button 
                        className={`${styles.follow}`}
                        onClick={() => handleAcceptRequestButton(id)}>Confirm
                        </button>
                        {
                        <button
                        className={styles.loading}
                        onClick={() => handleDeclineRequestButton(id)}>
                        Dismiss
                        </button>
                        }
                    </div> 
                    :
                    user?.followings?.find((u) => u._id === id) 
                    ?
                      <button
                      className={`${styles.unfollow}`}
                      onClick={() => handleUnfollowButton(id)}>Unfollow
                      </button>
                      :
                    user?.followers?.includes(id)
                    ? 
                    <button
                    className={`${styles.follow}`}
                    onClick={() => handleFollowButton(id)}>Follow Back
                    </button>
                    :
                    <button
                    className={`${styles.follow}`}
                    onClick={() => handleFollowButton(id)}>Follow
                    </button>
                }
            </div>
            <div className={styles["right"]}>
                <span className={styles["post-count"]}>{profile?.postsCount || profilePosts?.length || 0}<span>Posts</span></span>
                <button 
                  className={styles["follower-count"]}
                  disabled={!( profile?.followers?.length === 0 || user?._id ===  id  || (user?.followings.find((u) => u._id === id) || !profile?.private))}
                  onClick={openFollowerModal}
                  >
                  {profile?.followersCount || profile?.followers?.length}
                  <span>Followers</span>
                </button>
                <button 
                  className={styles["following-count"]} 
                  onClick={openFollowingModal}
                  disabled={!((profile?.followings?.length === 0) || user?._id ===  id  || (user?.followings.find((u) => u._id === id) || !profile?.private))}
                  >
                  {profile?.followingsCount ||profile?.followings?.length}
                  <span>Followings</span>
                </button>
            </div>

            <div className={styles["info"]}>
              {profile?.place && (
                  <div className={styles.locationContainer}>
                      <MdLocationOn color="white" className={styles.locationIcon} />
                      <span className={styles.placeText}>{profile.place}</span>
                  </div>
              )}
              {profile?.githubURL && (
                <div className={styles.githubContainer}>
                <a href={profile.githubURL} target="_blank" rel="noopener noreferrer">
                    <FaGithub color="white" className={styles.githubIcon} />
                </a>
            </div>
              )}
                
            </div>
            
        </div>
        <Posts posts={profilePosts} />{isEditModalOpen && (
      <EditProfile onClose={closeEditModal} profile={profile} />
    )}
    </div>
    {showFollowingModal && 
    <Following 
    onClose={closeFollowingModal} 
    user={user} 
    users={followingUserProfiles} 
    setUsers={setFollowingUsers}
    text={"Followings"}
     />}
    {showFollowerModal && 
    <Following 
    onClose={closeFollowingModal} 
    user={user} 
    users={followerUserProfiles} 
    setUsers={setFollowerUsers}
    text={"Followers"}
     />}
    
    </>
  )
}
