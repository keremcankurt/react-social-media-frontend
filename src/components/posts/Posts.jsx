import React from 'react'
import styles from './Posts.module.scss'

import Post from '../post/Post';
export default function Posts({posts}) {
    
  return (
    <div className={styles["posts"]}>
        {
            posts && posts.length > 0 && posts?.map((post, index) =>(
                <Post key={index} post={post}/>
            ))
        }
        
    </div>
  )
}
