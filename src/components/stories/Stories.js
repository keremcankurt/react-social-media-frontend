// MiniProfile.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Stories.module.scss';

const FollowingStories = ({ profile, setShowModal, setCurrentProfileIndex }) => {
  const handleStoryClick = (e) => {
    e.preventDefault();
    setShowModal(true);
    setCurrentProfileIndex();
  };

  return (
    <>
      <Link className={styles["profile"]} to="/profile">
        <button onClick={handleStoryClick}>
          <img
            className={styles["profile-image"]}
            src={profile.profileImage}
            alt="profile_image"
          />
        </button>
        <span>{profile.name}</span>
      </Link>
    </>
  );
};

export default FollowingStories;
