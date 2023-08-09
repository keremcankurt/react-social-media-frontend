import React from 'react';
import styles from './Following.module.scss';
import FollowOperations from '../../components/followOperations/FollowOperations';

const Following = ({ users, setUsers, user, onClose, text }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>{text}</h2>
        <hr/>
        <button className={styles.closeButton} onClick={onClose}>
          X
        </button>
        <div className={styles["following"]}>
            {users?.map((_user, index) => 
            (
              <FollowOperations key={_user._id} _user={_user} users={users} setUsers={setUsers}/>
              
            ))}
          </div>
      </div>
    </div>
  );
};

export default Following;
