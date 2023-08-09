import React, { useEffect, useState } from 'react';
import styles from './UpdatePost.module.scss';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { updatePost } from '../../features/post/postSlice';


export default function UpdatePost({ post, setShowModal, setCurrentImageIndex }) {
  const [content, setContent] = useState(post?.content);
  const [images, setImages] = useState([]);
  const dispatch = useDispatch();

  const downloadImage = async (imageUrl) => {
    try {
      const response = await fetch(process.env.REACT_APP_API_BASE_URL +"/images/" +imageUrl);
      if (!response.ok) {
        throw new Error('Error downloading image: ' + response.status + ' ' + response.statusText);
      }
      const blob = await response.blob();
      const filename = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
      return new File([blob], filename, { type: blob.type });
    } catch (error) {
      console.error('Error downloading image:', error.message);
      return null;
    }
  };

  useEffect(() => {
    if (post?.images) {
      const fetchImages = async () => {
        const fetchedImages = await Promise.all(post.images.map(downloadImage));
        const filteredImages = fetchedImages.filter((image) => image !== null);
        setImages(filteredImages);
      };
      fetchImages();
    }
  }, [post]);
  const handleUpdateImageSelect = (event) => {
    console.log("first")
    const files = Array.from(event.target.files);
    setImages([...images, ...files]);
};

  const handleImageRemove = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleUpdateClick = (e) => {
    e.preventDefault();
    if (!content && images?.length === 0) {
      toast.error("Please select images or enter content");
      return;
    }

    const formData = new FormData();
    images.forEach((image) => {
      formData.append("post_image", image);
    });
    formData.append("content", content);
    setShowModal(false)
    dispatch(updatePost({post: formData, id:post._id}))

    setImages([]);
    setContent("");
    setCurrentImageIndex(0)
    
  };

  const handleCloseButton = () => {
    setShowModal(false)
  }
  return (
    <div className={styles["update-modal"]}>
      <div className={styles["modal"]}>
        <button className={styles["close-button"]} onClick={handleCloseButton}>&times;</button>
        <h3 className={styles["title"]}>Post Update</h3>
        <textarea
          placeholder="Sharing some thoughts with my followers!"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <hr className={styles["line"]}></hr>
        <div className={styles["selected-images"]}>
          {images?.map((image, index) => (
            <div key={index} className={styles["selected-image"]}>
              <img src={URL.createObjectURL(image)} alt="Selected" />
              <button onClick={() => handleImageRemove(index)}>X</button>
            </div>
          ))}
        </div>
        <form action="/updatepost" method="post" encType="multipart/form-data" className={styles["actions"]}>
        <label htmlFor="updateFile" style={{ cursor: "pointer" }}>
                <button type="button" className={styles["add"]} style={{ pointerEvents: "none" }}>
                <span>Add Image</span>
                </button>
            </label>
            <input
                type="file"
                id="updateFile"
                style={{ display: "none" }}
                multiple onChange={handleUpdateImageSelect}
                accept="image/*"
            />
          <button className={styles["share"]} onClick={handleUpdateClick}>Update</button>
        </form>
      </div>
    </div>
  );
}
