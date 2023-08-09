import React, { useEffect, useState } from 'react'
import styles from './Post.module.scss'
import { useDispatch, useSelector } from 'react-redux';
import MiniProfile from '../../components/miniprofile/MiniProfile';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { FaComment, FaHeart, FaBookmark } from 'react-icons/fa';
import PostSettings from '../../modals/postSettings/PostSettings';
import { likePost, savePost } from '../../features/post/postSlice';
import Comment from '../comment/Comment';
import { addComment } from '../../features/comment/commentSlice';
export default function Post({post}) {
    const {user} = useSelector(
        (state) => state.user
    );
    const dispatch = useDispatch()
    const getMiniProfileUser = (postAuthor) => {
        if ((postAuthor?._id || postAuthor) === user?._id) {
            return user;
        }
    
        const matchingFollowing = user?.followings.find(following => following._id === (postAuthor?._id || postAuthor));
    
        if (matchingFollowing) {
            return matchingFollowing;
        }
    
        return postAuthor;
    };

const getTimeDifference = (createdAt) => {
    const currentTime = new Date();
    const postTime = new Date(createdAt);
    const diffInSeconds = Math.floor((currentTime - postTime) / 1000);
  
    if (diffInSeconds < 60) {
      return `${diffInSeconds}s`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d`;
    } else if (diffInSeconds < 2419200) {
      const weeks = Math.floor(diffInSeconds / 604800);
      return `${weeks}w`;
    } else {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return postTime.toLocaleDateString(undefined, options);
    }
  };
  
  const handleLikeClick = () => {
    dispatch(likePost({postId: post?._id, userId: user?._id}))
  }
  const handleSaveClick = () => {
    dispatch(savePost(post?._id))
  }

  const [showCommentsModal, setShowCommentsModal] = useState(false)
  const handleCommentsClick = () => {
    setShowCommentsModal(!showCommentsModal)
  }
  useEffect(() => {
    setShowCommentsModal(false)
  },[post?._id])
   const [currentImageIndex, setCurrentImageIndex] = useState(0);


   const [comment, setComment] = useState('');
   const handleSendComment = (e) => {
    e.preventDefault()
    dispatch(addComment({content: comment, id: post?._id}))
    setComment('')
   }
  return (
    <div className={styles["post"]}>
    <PostSettings post={post} setCurrentImageIndex={setCurrentImageIndex} user={user}/>
    <div className={styles['images']}>
    {
        post?.images && post?.images?.length > 0 &&
        <Carousel 
          showThumbs={false} 
          showIndicators={post.images.length === 1 ? false : true} 
          showStatus={false}
          selectedItem={currentImageIndex}
          onChange={(index) => setCurrentImageIndex(index)}
        >
        {
            post.images.map((image, index) =>(
                <div key={index}>
                    <img className={styles["post-image"]} 
                        src={`${process.env.REACT_APP_API_BASE_URL}/images/${image}`} 
                        alt="postimage" />
                </div>
            ))
        } 
    </Carousel>
    }
                        
    </div>
    <div className={styles['top']}>
        <div className={styles["profile"]}>
            <MiniProfile user={getMiniProfileUser(post?.author)} account={user}/>
        </div>
         <span className={styles["createdAt"]}>{getTimeDifference(post?.createdAt)}</span>
    </div>
    <div className={styles["bottom"]}>
        <span className={styles["content"]}>{post?.content}</span>
        <div className={styles["comments-likes-saved"]}>
        <div className={styles["comments-likes"]}>
            <button className={styles["comment-button"]} onClick={handleCommentsClick}>
                <FaComment color='white'/> {post?.comments?.length} Comments
            </button>
            <button className={styles["like-button"]} onClick={handleLikeClick}>
                <FaHeart 
                    className={styles["heart"]}
                    color={user?.likePosts.includes(post?._id) 
                    ? 'red' 
                    : 'gray'} /> 
                {post?.likes?.length} Likes
            </button>
        </div>
        <button className={styles["saved-button"]} onClick={handleSaveClick}>
          <FaBookmark className={styles["bookmark"]} color={user?.savedPosts.includes(post?._id) 
            ? 'white' 
            : 'gray'}/>
        </button>
        
        </div>
    </div>
    {
      showCommentsModal &&
      <div className={styles["comments-container"]}>
        <hr/>
        <form onSubmit={handleSendComment} className={styles["add-comment"]}>
          <input 
            placeholder='Write a review...' 
            required
            value={comment}
            onChange={(event) => setComment(event.target.value)}

          />
          <button type='submit'>Send</button>
        </form>
        <div className={styles["comments"]}>
        {
          post?.comments?.map((comment, index) =>(
            <Comment key={index} getMiniProfileUser={getMiniProfileUser} getTimeDifference={getTimeDifference} comment={comment} user={user}/>
          ))
        }
        </div>
      </div>
    }
    </div>
  )
}
