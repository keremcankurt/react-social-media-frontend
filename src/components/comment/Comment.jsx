import React from 'react'
import MiniProfile from '../miniprofile/MiniProfile'
import styles from './Comment.module.scss'
import { MdDelete } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { deleteComment } from '../../features/comment/commentSlice';

export default function Comment({getMiniProfileUser, user, comment, getTimeDifference}) {

  const dispatch = useDispatch()
  const handleDeleteButton = () => {
    dispatch(deleteComment({postId: comment?.postId, commentId: comment?._id}))
  }
  return (
    <div className={styles["comment"]}>
        <div className={styles["comment-header"]}>
          <div className={styles["left"]}>
            <MiniProfile user={getMiniProfileUser(comment?.author)} account={user}/>
            <span className={styles["comment-createdAt"]}>{getTimeDifference(comment?.createdAt)}</span>
          </div>
          {
            user?._id === comment?.author?._id &&
            <button className={styles["right"]} onClick={handleDeleteButton}>
            <MdDelete color='red'/>
          </button>
          }
            
        </div>
        <span className={styles["content"]}>{comment.content}</span>
    </div>
  )
}
