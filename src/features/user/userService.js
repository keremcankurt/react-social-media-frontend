
import {get, post} from '../request';
const BASE_URL = "http://localhost:4000/api/user";

const getUser = () => get(`${BASE_URL}/profile`);
export const recommendedUsers = () => get(`${BASE_URL}/recommendedusers`);
const follow = (id) => post(`${BASE_URL}/${id}/follow`);
const unfollow = (id) => post(`${BASE_URL}/${id}/unfollow`);
export const followingUsers = (id) => get(`${BASE_URL}/${id}/followingusers`);
export const followerUsers = (id) => get(`${BASE_URL}/${id}/followerusers`);
export const friendRequests = () => get(`${BASE_URL}/friendrequests`);
export const followRequests = () => get(`${BASE_URL}/followrequests`);
export const getSearchUserNames = (search) => get(`${BASE_URL}/getusers/${search}`);
const acceptFriendRequest = (id) => post(`${BASE_URL}/${id}/accept`);
const declineFriendRequest = (id) => post(`${BASE_URL}/${id}/decline`);
const cancelFollowRequest = (id) => post(`${BASE_URL}/${id}/cancel`);
const editProfile = (data) => post(`${BASE_URL}/edit`,data);

const userService = {
    follow,
    getUser,
    unfollow,
    editProfile,
    cancelFollowRequest,
    acceptFriendRequest,
    declineFriendRequest,
}

export default userService;