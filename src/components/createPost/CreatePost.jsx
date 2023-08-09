import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import styles from './CreatePost.module.scss'
import MiniProfile from '../miniprofile/MiniProfile';
import { createPost } from '../../features/post/postSlice';
import { toast } from 'react-toastify';
export default function CreatePost() {
    const [selectedImages, setSelectedImages] = useState([]);
    const [content, setContent] = useState("");
    const {user} = useSelector(
        (state) => state.user
    );
    const dispatch = useDispatch()
    const handleImageSelect = (event) => {
        const files = Array.from(event.target.files);
        setSelectedImages([...selectedImages, ...files]);
    };

    const handleImageRemove = (index) => {
        setSelectedImages((prevImages) => prevImages.filter((img, i) => i !== index));
    };

    const handleShareClick = (e) => {
        e.preventDefault();
        if(!content && selectedImages?.length === 0 ){
            toast.error("Please select images or enter content"); 
            return;
        }
        const formData = new FormData()
        selectedImages.forEach((image) => {
            formData.append("post_image", image);
          });
        formData.append("content", content)
        dispatch(createPost(formData))
        setSelectedImages([]);
        setContent("");
    }
  return (
    <div className={styles["create-post"]}>
        <MiniProfile user={user} account={user}/>
        <textarea 
            placeholder="Sharing some thoughts with my followers!" 
            value={content}
            onChange={(e) => setContent(e.target.value)}
        />
        <hr className={styles["line"]}></hr>
        <div className={styles["selected-images"]}>
            {selectedImages?.map((image, index) => (
                <div key={index} className={styles["selected-image"]}>
                    <img src={URL.createObjectURL(image)} alt="Selected" />
                    <button onClick={() => handleImageRemove(index)}>X</button>
                </div>
            ))}
        </div>
        <form action="/uploadfile"
            method="post"
            encType="multipart/form-data"    className={styles["actions"]}>
            <label htmlFor="inputFile" style={{ cursor: "pointer" }}>
                <button type="button" className={styles["add"]} style={{ pointerEvents: "none" }}>
                <span>Add Image</span>
                </button>
            </label>
            <input
                type="file"
                id="inputFile"
                style={{ display: "none" }}
                multiple onChange={handleImageSelect}
                accept="image/*"
            />
            <button className={styles["share"]} onClick={handleShareClick}>Share</button>
        </form>
    </div>
  )
}
