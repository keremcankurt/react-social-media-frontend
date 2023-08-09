import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './MiniProfile.module.scss';
import Stories from 'react-insta-stories';
import { useDispatch } from 'react-redux';
import { addStoryViewer, deleteStory } from '../../features/story/storySlice';
import { formatUserStories } from '../../helpers/formatUserStories';
import { updatedStories } from '../../features/user/userSlice';
import { FaEllipsisV } from 'react-icons/fa';
import StoryViewer from '../../modals/storyViewer/StoryViewer';
const MiniProfile = ({
  user,
  account, 
  storyIndex, 
  setStoryIndex, 
  nextStoryButton, 
  setNextStoryButton}) => {
  const [stories, setStories] = useState([]);
  const [isStopped, setIsStopped] = useState(false);
  const [openViewers, setOpenViewers] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  useEffect(() => {
    if (user) {
      const formattedStories = formatUserStories(user);
      setStories(formattedStories);
    }
  }, [user]);
  const [profile, setProfile] = useState({
    
  })
  useEffect(() => {
    setProfile({
      name: user?.name,
      profileImage: user?.profilePicture ? 
      `${process.env.REACT_APP_API_BASE_URL}/images/${user?.profilePicture}`:
      "https://www.newheightschurch.com/sites/default/files/default_images/default-team-member.png"
      ,
      stories
    })
    
  },[stories, user]);
  const [currentStory, setCurrentStory] = useState(0);
  const handleStoryClick = (e) => {
    e.preventDefault();
    if(storyIndex){
      let button;
      if(storyIndex === 1){
        button = e.target.parentNode?.parentNode;
      }
      else{
        button = nextStoryButton?.parentNode;
      }
        button = button?.nextElementSibling?.firstElementChild
        setNextStoryButton(button)
        setStoryIndex(storyIndex+1)
    }
    if (profile && profile?.stories && profile.stories?.length > 0) {
      const firstUnwatchedIndex = profile.stories.findIndex(
        (story) => !account?.viewedStories.includes(story?.storyId)
      );

      setCurrentStory(firstUnwatchedIndex >= 0 ? firstUnwatchedIndex : 0);
    }
    const isPrivateProfile = user?.private;
    const isFollowingUser = user?.followers?.includes(account?._id);
    if (profile?.stories.length !== 0 && (user?._id === account?._id || (!isPrivateProfile || isFollowingUser))) {
      setShowModal(true);
    }
  }

  const [allStoriesWatched, setAllStoriesWatched] = useState(false);

  const handleDeleteStory= () => {
    dispatch(deleteStory(profile?.stories[currentStory]?.storyId))
    handleCloseModal()
  }
  
  useEffect(() => {
    if(user?.private && !user?.followers?.includes(account?._id)){
      setAllStoriesWatched(false);
    }
    else{
      if (profile && profile.stories && profile.stories?.length > 0) {
        const allWatched = profile.stories?.every((story) => {
          return account?.viewedStories?.includes(story.storyId);
        });
  
        setAllStoriesWatched(!allWatched);
      } else {
        setAllStoriesWatched(false);
      }
    }
    
  }, [profile,account, user]);

  const [showModal, setShowModal] = useState(false);

  const dispatch = useDispatch()
  const handleCloseModal = (e) => {
    setOpenViewers(false)
    setIsStopped(false);
    setOpenSettings(false)
    storyIndex && setStoryIndex(1)
    dispatch(updatedStories())
    setShowModal(false);
  };
  
  const handleStoryEnd = (e) => {
    setOpenSettings(false)
    setOpenViewers(false)
    setIsStopped(false);
    const updatedProfile = { ...profile };
  
    const currentStoryObject = updatedProfile.stories[currentStory];
    if (!account?.viewedStories?.includes(currentStoryObject?.storyId)) {
      
      if(account?.followings?.find((_user) => _user?._id === user._id)){
        dispatch(addStoryViewer(currentStoryObject.storyId));
      }
      else{
        dispatch(addStoryViewer(currentStoryObject.storyId));
        try{
          updatedProfile?.stories[currentStory]?.viewers?.push(account?._id);
        }catch(e){

        }
      }
    }
  
    if (currentStory + 1 === updatedProfile.stories.length) {
      setShowModal(false);
      if (nextStoryButton) {
        nextStoryButton?.click();
      } else {
        storyIndex && setStoryIndex(1);
        dispatch(updatedStories(e));
      }
    }
  
    setProfile(updatedProfile);
  
    setCurrentStory((prevStory) => prevStory + 1);
  };
  

  const handleAllStoriesEnd = (e) => {
    setOpenSettings(false)
    setOpenViewers(false)
    setIsStopped(false);
    setShowModal(false);
    if(nextStoryButton){
      nextStoryButton?.click(e)
    }
    else{
      storyIndex && setStoryIndex(1)
      dispatch(updatedStories())
    }
    
  }
  return (
    <>
      <Link className={styles["profile"]} to={`/profile?id=${user?._id}`}>
        <button onClick={handleStoryClick}>
          <img
            className={`${styles["profile-image"]} ${!allStoriesWatched ? styles["gray-border"] : styles["red-border"]}`}
            src={profile.profileImage}
            alt="profile_image"
          />
        </button>
        <span className={styles["name"]}>{profile.name}</span>
      </Link>
      {showModal && (
        <div className={styles["modal-overlay"]}>
          <div className={styles["modal"]}>
            {
              user?._id === account?._id && openViewers &&
              <div className={styles["viewers"]}>
                <span className={styles["title"]}>Viewers</span>
                <button className={styles["close-viewers"]} onClick={() => {setIsStopped(false); setOpenViewers(false)}}>&times;</button>
                <div className={styles["profiles"]}>
                {
                profile.stories[currentStory].viewers.map((viewer) => (
                  (viewer?._id || viewer) !== account?._id &&
                  <StoryViewer viewer={viewer} handleCloseModal={handleCloseModal}/>
                ))}
                {
                  profile.stories[currentStory].viewers.length === 1 &&
                  <span className={styles["no-viewers"]}>No Views Yet</span>
                }
                </div>
              </div>
            }
            <button className={styles["close-button"]} onClick={handleCloseModal}>
              Close
            </button>
            {account?._id === user._id && !openViewers &&
            <button className={styles["settings"]} onClick={() => {setIsStopped(true); setOpenSettings(!openSettings); setOpenViewers(false)}}>
                <FaEllipsisV color='white' />
            </button>
            }
            {
              openSettings && account?._id === user?._id  &&
              <div className={styles["settings-modal"]}>
                <button className={styles["open-viewers"]} onClick={() => {setOpenSettings(false); setOpenViewers(true)}}>Viewers</button>
                <button className={styles["delete-story"]} onClick={handleDeleteStory}>Delete Story</button>
              </div>
            }
            <Stories
              loop={false}
              stories={profile.stories}
              width={432}
              height={768}
              isPaused={isStopped}
              onAllStoriesEnd={handleAllStoriesEnd}
              onStoryEnd={handleStoryEnd}
              currentIndex={currentStory}
              onNext={handleStoryEnd}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default MiniProfile;
