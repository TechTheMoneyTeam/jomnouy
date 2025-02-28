import { useState } from 'react';
import styles from './SettingsCSS/Following.module.css';
import { Link } from 'react-router-dom';
import Navbar2 from '../Navbar/Navbarforsubmit';
import '../Navbar/Navbar.css';

const Following = () => {
  const [following, setFollowing] = useState([

  ]);

  const handleUnfollow = (id) => {
    setFollowing(following.filter(user => user.id !== id));
  };

  return (
    <>
      <Navbar2 />
      <div className={styles.container}>
        <h1 className={styles.title}>Settings</h1>
        
        <div className={styles.tabContainer}>
          <Link to="/settings" className={styles.tabButton}>Account</Link>
          <Link to="/profile/edit" className={styles.tabButton}>Edit Profile</Link>
         <button className={`${styles.tabButton} ${styles.activeTab}`}>Following</button>
          <Link to="/noti" className={styles.tabButton}>Notifications</Link>
        </div>

        <h1 className={styles.title}>Following</h1>
        <div className={styles.list}>
          {following.length === 0 ? (
            <p>No one is following you.</p>
          ) : (
            following.map(user => (
              <div key={user.id} className={styles.userCard}>
                <span>{user.name}</span>
                <button 
                  onClick={() => handleUnfollow(user.id)} 
                  className={styles.unfollowButton}
                  aria-label={`Unfollow ${user.name}`}
                >
                  Unfollow
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Following;