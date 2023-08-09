import React, { useState } from 'react'
import styles from './Leftbar.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCameraRetro } from '@fortawesome/free-solid-svg-icons';
import MiniProfile from '../miniprofile/MiniProfile';
import { useDispatch, useSelector } from 'react-redux';
import AddStoryModal from '../../modals/addStory/AddStoryModal';
import { addStory } from '../../features/story/storySlice';
import { logout } from '../../features/auth/authSlice';

export default function Leftbar() {
  const {user} = useSelector(
    (state) => state.user
  );
  const [showModal, setShowModal] = useState(false);
  const [image, setImage] = useState(null);



  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    const fileInput = document.getElementById('fileInput');
        if (fileInput) {
          fileInput.value = '';
        }
    setShowModal(false);
    
    setImage(null);
  };

  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];
    setImage(selectedImage);
  };

  const dispatch = useDispatch()
  const handleShareButtonClick = (e) => {
    const data = new FormData();
    data.append("story_image", image);
    dispatch(addStory(data))
    closeModal();
  };

  const handleLogoutButtonClick = (e) => {
    dispatch(logout())
  }

  const [storyIndex, setStoryIndex] = useState(1)
  
  const [nextStoryButton, setNextStoryButton] = useState();
  return (
    <div className={styles["container"]}>
      <div className={styles["stories-container"]}>
        <div className={styles["new-story"]}>
          <button className={styles["add-story-button"]} onClick={openModal}>
            <FontAwesomeIcon icon={faCameraRetro} /> New Story
          </button>
        </div>
        <hr />
        <div className={styles["stories"]}>
  {user?.followings.length === 0 ? (
    <p className={styles["no-stories"]}>No friends found.</p>
  ) : (
    user?.followings.some(_user => _user?.stories && _user.stories.length > 0) ? (
      user?.followings.map((_user, index) => 
        _user?.stories && _user.stories.length > 0 ? (
          <MiniProfile  
            key={_user._id}
            storyIndex={storyIndex} 
            setStoryIndex={setStoryIndex} 
            account={user} 
            user={_user}
            nextStoryButton={nextStoryButton} 
            setNextStoryButton={setNextStoryButton}
          />
        ) : null
      )
    ) : (
      <p className={styles["no-stories"]}>No stories available from your friends.</p>
    )
  )}
</div>

      </div>
      <hr />
      <div className={styles["profile"]}>
        <MiniProfile account={user} user={user} />
        <button className={styles["logout"]} onClick={handleLogoutButtonClick}>Sign out</button>
      </div>

      {/* Add Story Modal */}
      <AddStoryModal
        showModal={showModal}
        closeModal={closeModal}
        handleImageChange={handleImageChange}
        handleShareButtonClick={handleShareButtonClick}
        image={image}
      />
    </div>
  );
}
