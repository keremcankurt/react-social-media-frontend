import React from 'react';
import styles from './AddStoryModal.module.scss';

export default function AddStoryModal({
  showModal,
  image,
  closeModal,
  handleImageChange,
  handleShareButtonClick,
}) {
  return (
    <div className={styles['modal-container']} style={{ display: showModal ? 'block' : 'none' }}>
      <div className={styles['modal-content']}>
        <button className={styles['close-button']} onClick={() => {closeModal(); }}>
          X
        </button>
        <h2>Add New Story</h2>
        <div className={styles['modal-body']}>
          {image && <img src={ URL.createObjectURL(image)} alt="Selected" />}
          <input type="file" id='fileInput' accept="image/*" defaultValue="" onChange={handleImageChange} />
          <button onClick={() => {handleShareButtonClick(); }}>Share</button>
        </div>
      </div>
    </div>
  );
}
