import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from "./Header.module.scss"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import Notifications from '../../modals/notifications/Notifications';
import { useDispatch, useSelector } from 'react-redux';
import { getSearchUserNames } from '../../features/user/userService';
import { toast } from 'react-toastify';
import { logoutUser } from '../../features/auth/authSlice';
import FollowOperations from '../followOperations/FollowOperations';


export default function Header() {
  const {user} = useSelector(
    (state) => state.user
  );
  const inputRef = useRef(null);

  const handleOutsideClick = (e) => {
    if (!inputRef.current.contains(e.target)) {
      setOpenSearchBar(false);
    }
  };
  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSearchBar, setOpenSearchBar] = useState(false);
  const {isSuccess} = useSelector(
    (state) => state.post
);
  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleNotificationsClick = () => {
    setOpen(!open);
  };
  const dispatch = useDispatch()
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getSearchUserNames(searchQuery);
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message);
        }
        setUsers(result)
      } catch (error) {
        toast.error(error.message);
        if(error.message === "You are not authorized to access this route"){
          dispatch(logoutUser());
        }
      }
    };
    if(isSuccess && searchQuery){
      fetchData();
    }else{
      setUsers([])
    }
  },[isSuccess, searchQuery,dispatch])
  return (
    <nav>
      <div className={styles['logo-container']}>
        <Link to="/">
          KCKMEDIA
        </Link>
      </div>
      <div className={styles["searchbar"]} ref={inputRef}>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchInputChange}
            onClick={() => setOpenSearchBar(true)}
            
          />
            { openSearchBar &&
              <div className={`${styles['searchUsers']} ${users.length > 0 ? styles['open'] : ''}`}>
                {users?.map((_user, index) => 
                (
                  <FollowOperations key={_user._id} _user={_user} users={users} setUsers={setUsers}/>
                ))}
              </div>
            }
            
        </div>
      <div className={styles['nav-items']}>
        <div className={styles['notification-icon']} onClick={handleNotificationsClick}>
          <FontAwesomeIcon icon={faBell} />
          {
            (user?.friendRequests.length > 0 || user?.followRequests.length > 0) &&
            <span className={styles["new-notifications"]}></span>
          }
          
          
        </div>
        <Notifications open={open} setOpen={setOpen}/>
      </div>
    </nav>
  );
}
