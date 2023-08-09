import React, { useEffect, useState } from 'react'
import styles from './PostSettings.module.scss'
import { useDispatch } from 'react-redux';
import { deletePost } from '../../features/post/postSlice';
import UpdatePost from '../updatePost/UpdatePost';
import { FaEllipsisV } from 'react-icons/fa';

export default function PostSettings({post, setCurrentImageIndex, user}) {
  
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const dispatch = useDispatch()

  const handleUpdatePost = () => {
    setShowUpdateModal(true)
    setShowModal(false)
  };
  useEffect(() => {
    setShowModal(false)
  }, [post])

  const handleDeletePost = () => {
    setShowModal(false)
    dispatch(deletePost(post?._id))
    
  };
  const [showModal, setShowModal] = useState(false);
  const handleSettingsClick = () => {
    setShowModal(!showModal);
  };
  
  return (
    <>
    {
        user?.posts.includes(post?._id) &&
        <button className={styles["settings"]} onClick={handleSettingsClick}>
            <FaEllipsisV color='white' />
        </button>
    }
    {user?.posts.includes(post?._id) && showModal && (
      <div className={styles["modal"]}>
      <div className={styles["modal-content"]}>
        <button onClick={handleUpdatePost}>Update Post</button>
        <button onClick={handleDeletePost} className={styles["delete"]}>Delete Post</button>
      </div>
    </div>
    )}
    {
      showUpdateModal && 
      <UpdatePost 
        post={post} 
        setShowModal={setShowUpdateModal} 
        setCurrentImageIndex={setCurrentImageIndex}
      />
    }
    </>
  )
}
