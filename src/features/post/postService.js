
import { del, get, post, put} from '../request';
const BASE_URL = "http://localhost:4000/api/post";

const createPost = data => post(`${BASE_URL}/create`,data);
const updatePost = (data, id) => put(`${BASE_URL}/${id}`,data);
const getFollowingPosts = () => get(`${BASE_URL}/followingposts`);
export const getUserPosts = (id) => get(`${BASE_URL}/userposts/${id}`);
export const getLikePosts = () => get(`${BASE_URL}/likeposts`);
export const getSavedPosts = () => get(`${BASE_URL}/savedposts`);
const deletePost = (id) => del(`${BASE_URL}/${id}`);
const savePost = (id) => post(`${BASE_URL}/${id}/save`);
const likePost = (id) => post(`${BASE_URL}/${id}/like`);


const postService = {
    savePost,
    likePost,
    createPost,
    deletePost,
    updatePost,
    getFollowingPosts
}

export default postService;