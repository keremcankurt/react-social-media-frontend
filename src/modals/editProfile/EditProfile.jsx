import React, { useState } from 'react';
import Modal from 'react-modal';
import styles from './EditProfile.module.scss';
import { editProfile } from '../../features/user/userSlice';
import { useDispatch } from 'react-redux';

const EditProfile = ({ onClose, profile }) => {
    const [formData, setFormData] = useState({
        name: profile?.name,
        githubURL: profile?.githubURL,
        place: profile?.place,
        isPrivate: profile?.private,
    })
    const [image, setImage] = useState('');

    const {name, place, githubURL, isPrivate} = formData
    const dispatch = useDispatch()
    const handleSubmit = (e) => {
      e.preventDefault()
      const formData = new FormData()
      if(image){
        formData.append("profile_image", image)
      } 
      const info = {
        name,
        place,
        githubURL,
        private: isPrivate,
      }

      formData.append("info", JSON.stringify(info))
      dispatch(editProfile(formData))
      onClose();
    };
    const handleImageChange = (event) => {
        const selectedImage = event.target.files[0];
        setImage(selectedImage);
      };

  return (
    <Modal
      isOpen={true}
      onRequestClose={onClose}
      contentLabel="Edit Profile"
      className={styles['modal-container']}
      overlayClassName={styles['modal-content']}
      appElement={document.getElementById('root')}
    >
    <div className={styles["container"]}>
        <button className={styles['close-button']} onClick={() => {onClose(); }}>
          X
        </button>
      <h2>Edit Profile</h2>
      <div className={styles["profile-image"]}>
      {<img 
      src={image ? URL.createObjectURL(image) : profile?.profilePicture ? `${process.env.REACT_APP_API_BASE_URL}/images/${profile?.profilePicture}`:
      "https://www.newheightschurch.com/sites/default/files/default_images/default-team-member.png"
      } 
      alt="profile" />}
      <label htmlFor="inputFile" style={{ cursor: "pointer" }}>
                <button type="button" className={styles["add"]} style={{ pointerEvents: "none" }}>
                <span>Change Image</span>
                </button>
            </label>
            <input
                type="file"
                id="inputFile"
                style={{ display: "none" }}
                multiple onChange={handleImageChange}
                accept="image/*"
            />
      </div>
      <form onSubmit={handleSubmit}>
        <input
            type="text"
            value={name}
            className={styles['form-input']}
            placeholder='Name'
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            />
            <input
            type="text"
            value={place}
            className={styles['form-input']}
            placeholder='Place'
            onChange={(e) => setFormData({ ...formData, place: e.target.value })}
            />
            <input
            type="text"
            value={githubURL}
            className={styles['form-input']}
            placeholder='https://github.com/keremcankurt'
            onChange={(e) => setFormData({ ...formData, githubURL: e.target.value })}
            />
            <label className={styles['form-checkbox']}>
            <input
                type="checkbox"
                checked={isPrivate}
                onChange={() => setFormData({ ...formData, isPrivate: !isPrivate })}
            />
            <span className={styles['checkbox-label']}>
                {isPrivate ? 'Private' : 'Public'}
            </span>
        </label>

        <button type="submit" className={styles['form-button']}>
          Update
        </button>
      </form>
    </div>
      
    </Modal>
  );
};

export default EditProfile;
