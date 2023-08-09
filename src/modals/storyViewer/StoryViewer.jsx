import React from 'react'
import styles from './StoryViewer.module.scss'
import { Link } from 'react-router-dom'

export default function StoryViewer({viewer, handleCloseModal}) {
  return (
    <Link className={styles["viewer"]} to={`/profile?id=${viewer?._id}`} onClick={handleCloseModal}>
      <div className={styles["viewer-profile"]}>
        <img alt='img' 
          src={viewer?.profilePicture ?
            `${process.env.REACT_APP_API_BASE_URL}/images/${viewer?.profilePicture}`
            : "https://www.newheightschurch.com/sites/default/files/default_images/default-team-member.png"}/>
        <span>{viewer?.name}</span>
      </div>
    </Link>
  )
}
