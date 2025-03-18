import { useState, useEffect } from 'react';
import styles from './SettingsCSS/Following.module.css';
import { Link } from 'react-router-dom';
import Navbar2 from '../Navbar/Navbarforsubmit';
import '../Navbar/Navbar.css';
import axios from 'axios';

const Following = () => {
  // State for following list, search input, search results, and loading states
  const [following, setFollowing] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('following'); // 'following' or 'search'
  
  // Get current user ID from localStorage or context
  const currentUserId = localStorage.getItem('user_id') || 1; // Default to 1 for testing

  // Fetch following list on component mount
  useEffect(() => {
    fetchFollowing();
  }, []);

  // Fetch user's following list
  const fetchFollowing = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/following?user_id=${currentUserId}`);
      if (response.data.success) {
        setFollowing(response.data.following);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching following:', error);
      setIsLoading(false);
    }
  };

  // Handle search for users
  const handleSearch = async () => {
    if (!searchInput.trim()) return;
    
    try {
      setIsSearching(true);
      const response = await axios.get(`/api/users/search?username=${searchInput}&user_id=${currentUserId}`);
      if (response.data.success) {
        setSearchResults(response.data.users);
        setActiveTab('search');
      }
      setIsSearching(false);
    } catch (error) {
      console.error('Error searching for users:', error);
      setIsSearching(false);
    }
  };

  // Handle follow user
  const handleFollow = async (userId) => {
    try {
      const response = await axios.post('/api/follow', {
        user_id: currentUserId,
        followed_user_id: userId
      });
      
      if (response.data.success) {
        // Update search results to reflect the new follow status
        setSearchResults(searchResults.map(user => 
          user.id === userId ? { ...user, isFollowing: true } : user
        ));
        
        // Refresh the following list to include the new follow
        fetchFollowing();
      }
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  // Handle unfollow user
  const handleUnfollow = async (userId) => {
    try {
      const response = await axios.post('/api/unfollow', {
        user_id: currentUserId,
        followed_user_id: userId
      });
      
      if (response.data.success) {
        // Update the following list
        setFollowing(following.filter(user => user.id !== userId));
        
        // Update search results if in search tab
        setSearchResults(searchResults.map(user => 
          user.id === userId ? { ...user, isFollowing: false } : user
        ));
      }
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  // Handle keyboard events for search
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
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

        {/* Search bar */}
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search for users by username..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className={styles.searchInput}
          />
          <button 
            onClick={handleSearch} 
            className={styles.searchButton}
            disabled={isSearching || !searchInput.trim()}
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Tab buttons */}
        <div className={styles.subTabContainer}>
          <button 
            className={`${styles.subTabButton} ${activeTab === 'following' ? styles.activeSubTab : ''}`}
            onClick={() => setActiveTab('following')}
          >
            People You Follow
          </button>
          <button 
            className={`${styles.subTabButton} ${activeTab === 'search' ? styles.activeSubTab : ''}`}
            onClick={() => setActiveTab('search')}
            disabled={searchResults.length === 0}
          >
            Search Results
          </button>
        </div>

        {/* Following list */}
        {activeTab === 'following' && (
          <div className={styles.list}>
            {isLoading ? (
              <p>Loading your following list...</p>
            ) : following.length === 0 ? (
              <p>You're not following anyone yet.</p>
            ) : (
              following.map(user => (
                <div key={user.id} className={styles.userCard}>
                  <div className={styles.userInfo}>
                    {user.profile_picture ? (
                      <img 
                        src={`/storage/${user.profile_picture}`}
                        alt={`${user.username}'s profile`} 
                        className={styles.userAvatar}
                      />
                    ) : (
                      <div className={styles.defaultAvatar}>{user.username.charAt(0).toUpperCase()}</div>
                    )}
                    <span className={styles.username}>{user.username}</span>
                  </div>
                  <button 
                    onClick={() => handleUnfollow(user.id)} 
                    className={styles.unfollowButton}
                  >
                    Unfollow
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Search results */}
        {activeTab === 'search' && (
          <div className={styles.list}>
            {isSearching ? (
              <p>Searching for users...</p>
            ) : searchResults.length === 0 ? (
              <p>No users found. Try a different search term.</p>
            ) : (
              searchResults.map(user => (
                <div key={user.id} className={styles.userCard}>
                  <div className={styles.userInfo}>
                    {user.profile_picture ? (
                      <img 
                        src={`/storage/${user.profile_picture}`}
                        alt={`${user.username}'s profile`} 
                        className={styles.userAvatar}
                      />
                    ) : (
                      <div className={styles.defaultAvatar}>{user.username.charAt(0).toUpperCase()}</div>
                    )}
                    <span className={styles.username}>{user.username}</span>
                  </div>
                  {user.isFollowing ? (
                    <button 
                      onClick={() => handleUnfollow(user.id)} 
                      className={styles.unfollowButton}
                    >
                      Unfollow
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleFollow(user.id)} 
                      className={styles.followButton}
                    >
                      Follow
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Following;