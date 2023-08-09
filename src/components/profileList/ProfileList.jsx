import React, { useState } from 'react'
import MiniProfile from '../miniprofile/MiniProfile';
import Stories from 'react-insta-stories';
import styles from './ProfileList.module.scss'
import FollowingStories from '../stories/Stories';
export default function ProfileList() {
    const profiles = [
        // List of profiles and their stories
        {
          name: 'Kerem Can KURT',
          profileImage: 'https://i.pinimg.com/originals/b2/ce/42/b2ce42557c7d705de051665d8e562dd7.jpg',
          stories: [
            {
                url: 'https://i.pinimg.com/originals/b2/ce/42/b2ce42557c7d705de051665d8e562dd7.jpg',
                duration: 2000,
                header: {
                  heading: 'Kerem Can KURT',
                  subheading: 'Posted 30m ago',
                  profileImage: 'https://i.pinimg.com/originals/b2/ce/42/b2ce42557c7d705de051665d8e562dd7.jpg',
                },
              },
              {
                url: 'https://avatars.mds.yandex.net/i?id=9fa84ec0db4cc92d5ff0f7eb9ceeb160b5c1c380-9227998-images-thumbs&n=13',
                duration: 2000,
                header: {
                  heading: 'Kerem Can KURT',
                  subheading: 'Posted 30m ago',
                  profileImage: 'https://i.pinimg.com/originals/b2/ce/42/b2ce42557c7d705de051665d8e562dd7.jpg',
                },
              },
          ],
        },
        {
          name: 'Emirhan YAMAN',
          profileImage: 'https://lastfm.freetls.fastly.net/i/u/ar0/0a087701e16a6f89cf98f0242dcdb3e8.png',
          stories: [
            {
                url: 'https://lastfm.freetls.fastly.net/i/u/ar0/0a087701e16a6f89cf98f0242dcdb3e8.png',
                duration: 2000,
                header: {
                  heading: 'Emirhan YAMAN',
                  subheading: 'Posted 30m ago',
                  profileImage: 'https://lastfm.freetls.fastly.net/i/u/ar0/0a087701e16a6f89cf98f0242dcdb3e8.png',
                },
              },
          ],
        },
        {
          name: 'Emirhan YAMAN',
          profileImage: 'https://lastfm.freetls.fastly.net/i/u/ar0/0a087701e16a6f89cf98f0242dcdb3e8.png',
          stories: [
            {
                url: 'https://lastfm.freetls.fastly.net/i/u/ar0/0a087701e16a6f89cf98f0242dcdb3e8.png',
                duration: 2000,
                header: {
                  heading: 'Emirhan YAMAN',
                  subheading: 'Posted 30m ago',
                  profileImage: 'https://lastfm.freetls.fastly.net/i/u/ar0/0a087701e16a6f89cf98f0242dcdb3e8.png',
                },
              },
          ],
        },
        {
          name: 'Emirhan YAMAN',
          profileImage: 'https://lastfm.freetls.fastly.net/i/u/ar0/0a087701e16a6f89cf98f0242dcdb3e8.png',
          stories: [
            {
                url: 'https://lastfm.freetls.fastly.net/i/u/ar0/0a087701e16a6f89cf98f0242dcdb3e8.png',
                duration: 2000,
                header: {
                  heading: 'Emirhan YAMAN',
                  subheading: 'Posted 30m ago',
                  profileImage: 'https://lastfm.freetls.fastly.net/i/u/ar0/0a087701e16a6f89cf98f0242dcdb3e8.png',
                },
              },
          ],
        },
        {
          name: 'Emirhan YAMAN',
          profileImage: 'https://lastfm.freetls.fastly.net/i/u/ar0/0a087701e16a6f89cf98f0242dcdb3e8.png',
          stories: [
            {
                url: 'https://lastfm.freetls.fastly.net/i/u/ar0/0a087701e16a6f89cf98f0242dcdb3e8.png',
                duration: 2000,
                header: {
                  heading: 'Emirhan YAMAN',
                  subheading: 'Posted 30m ago',
                  profileImage: 'https://lastfm.freetls.fastly.net/i/u/ar0/0a087701e16a6f89cf98f0242dcdb3e8.png',
                },
              },
          ],
        },
        // Add more profiles with their stories if needed
      ];
      const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
      const [showModal, setShowModal] = useState(false);
    
      const handleCloseModal = () => {
        setShowModal(false);
      };
    
      const handleAllStoriesEnd = () => {
        const nextIndex = currentProfileIndex + 1;
        handleCloseModal();
        if (nextIndex < profiles?.length) {
          setCurrentProfileIndex(nextIndex);
          setTimeout(() => {
            setShowModal(true);
          }, 5);
          
        }
      };
    
      return (
        <>
          {profiles.map((profile, index) => (
            <FollowingStories
              key={index}
              profile={profile}
              setShowModal={setShowModal}
              setCurrentProfileIndex={() => setCurrentProfileIndex(index)}
            />
          ))}
          {showModal && (
            <div className={styles["modal-overlay"]}>
              <div className={styles["modal"]}>
                <button className={styles["close-button"]} onClick={handleCloseModal}>
                  X
                </button>
                <Stories
                  loop={false}
                  stories={profiles[currentProfileIndex]?.stories}
                  width={432}
                  height={768}
                  onAllStoriesEnd={handleAllStoriesEnd}
                  isPaused={false}
                />
              </div>
            </div>
          )}
        </>
      );
}


