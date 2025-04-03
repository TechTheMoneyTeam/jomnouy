import React, { useState, useEffect } from 'react';
import Navbar2 from '../Navbar/Navbarforsubmit';
import '../Navbar/Navbar.css';

const ProfileDisplay = () => {
  const [userInfo, setUserInfo] = useState({});
  const [profileData, setProfileData] = useState({
    bio: '',
    location: '',
    facebook_link: '',
    youtube_link: '',
    tiktok_link: '',
    website: '',
    profile_picture: null
  });
  const [activeSection, setActiveSection] = useState('about');
  const [loading, setLoading] = useState(true);
  const [investments, setInvestments] = useState([]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setUserInfo(user);
      fetchProfileData(user.username);
      fetchUserInvestments(user.user_id);
    }
  }, []);

  const fetchProfileData = async (username) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/profile?username=${username}`);
      const data = await response.json();
      if (data.success) {
        setProfileData(data.profile);
      } else {
        console.error('Failed to fetch profile:', data.message);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserInvestments = async (userId) => {
    try {
      const response = await fetch(`/api/user-investments-grouped/${userId}`);
      const data = await response.json();
      setInvestments(data);
    } catch (error) {
      console.error('Error fetching investments:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Joined recently';
    const date = new Date(dateString);
    return `Joined ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
  };

  const getProfilePictureOrInitial = () => {
    if (profileData.profile_picture) {
      return (
        <img
          src={`/storage/${profileData.profile_picture}`}
          alt={`${userInfo.username}'s profile`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '50%'
          }}
        />
      );
    }

    return userInfo.username?.charAt(0).toUpperCase() || '?';
  };

  const styles = {
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '24px'
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '32px'
    },
    profileSection: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: '32px'
    },
    avatar: {
      width: '96px',
      height: '96px',
      backgroundColor: '#f97316',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '32px',
      marginBottom: '16px',
      overflow: 'hidden'
    },
    username: {
      fontSize: '20px',
      fontWeight: '600',
      marginBottom: '8px'
    },
    bio: {
      color: '#6b7280',
      marginBottom: '8px',
      textAlign: 'center',
      maxWidth: '500px'
    },
    bioLink: {
      color: '#f97316',
      textDecoration: 'none'
    },
    navigation: {
      borderBottom: '1px solid #e5e7eb',
      marginBottom: '24px',
      display: 'flex',
      gap: '16px'
    },
    navButton: {
      padding: '8px 16px',
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      position: 'relative',
      color: '#6b7280'
    },
    activeNavButton: {
      color: '#111827',
      borderBottom: '2px solid #111827'
    },
    badge: {
      backgroundColor: '#fff7ed',
      color: '#f97316',
      padding: '2px 6px',
      borderRadius: '4px',
      fontSize: '12px',
      marginLeft: '4px'
    },
    detailsSection: {
      marginBottom: '32px'
    },
    sectionTitle: {
      fontSize: '16px',
      fontWeight: '600',
      marginBottom: '16px'
    },
    detailText: {
      color: '#6b7280',
      marginBottom: '8px'
    },
    linksSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    linkItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: '#6b7280',
      textDecoration: 'none'
    },
    editProfileBtn: {
      backgroundColor: '#f97316',
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '4px',
      cursor: 'pointer',
      marginTop: '16px',
      fontWeight: '500'
    },
    location: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      color: '#6b7280',
      marginBottom: '16px'
    }
  };

  return (
    <>
      <Navbar2 />
      <div style={styles.container}>
        <h1 style={styles.title}>Profile</h1>

        {loading ? (
          <p>Loading profile...</p>
        ) : (
          <>
            <div style={styles.profileSection}>
              <div style={styles.avatar}>
                {getProfilePictureOrInitial()}
              </div>
              <h2 style={styles.username}>{userInfo.username || 'No username found'}</h2>

              {profileData.bio ? (
                <p style={styles.bio}>{profileData.bio}</p>
              ) : (
                <p style={styles.bio}>
                  Let people know about you more. <a href="/profile/edit" style={styles.bioLink}>Add a biography</a>
                </p>
              )}

              {profileData.location && (
                <div style={styles.location}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 22C16 18 20 14.4183 20 10C20 5.58172 16.4183 2 12 2C7.58172 2 4 5.58172 4 10C4 14.4183 8 18 12 22Z" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>{profileData.location}</span>
                </div>
              )}

              <a href="/profile/edit" style={styles.editProfileBtn}>
                Edit Profile
              </a>
            </div>

            <div style={styles.navigation}>
              <button
                style={{
                  ...styles.navButton,
                  ...(activeSection === 'about' ? styles.activeNavButton : {})
                }}
                onClick={() => setActiveSection('about')}
              >
                About
              </button>
       
            </div>

            {activeSection === 'about' && (
              <>
                <div style={styles.detailsSection}>
                  <h3 style={styles.sectionTitle}>Details</h3>
                  <p style={styles.detailText}>{formatDate(userInfo.created_at)}</p>
           
                  <p style={styles.detailText}>User Type: {userInfo.user_type || 'No type found'}</p>
                </div>

                <div style={styles.detailsSection}>
                  <h3 style={styles.sectionTitle}>Outside links</h3>
                  <div style={styles.linksSection}>
                    {profileData.facebook_link && (
                      <a href={profileData.facebook_link} target="_blank" rel="noopener noreferrer" style={styles.linkItem}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#6b7280" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                        </svg>
                        {profileData.facebook_link}
                      </a>
                    )}

                    {profileData.youtube_link && (
                      <a href={profileData.youtube_link} target="_blank" rel="noopener noreferrer" style={styles.linkItem}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#6b7280" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                          <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                        </svg>
                        {profileData.youtube_link}
                      </a>
                    )}

                    {profileData.tiktok_link && (
                      <a href={profileData.tiktok_link} target="_blank" rel="noopener noreferrer" style={styles.linkItem}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#6b7280" xmlns="http://www.w3.org/2000/svg">
                          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"></path>
                        </svg>
                        {profileData.tiktok_link}
                      </a>
                    )}

                    {profileData.website && (
                      <a href={profileData.website} target="_blank" rel="noopener noreferrer" style={styles.linkItem}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="10" strokeWidth="2"></circle>
                          <line x1="2" y1="12" x2="22" y2="12" strokeWidth="2"></line>
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" strokeWidth="2"></path>
                        </svg>
                        {profileData.website}
                      </a>
                    )}

                    {!profileData.facebook_link && !profileData.youtube_link &&
                      !profileData.tiktok_link && !profileData.website && (
                        <p style={styles.detailText}>
                          No outside links added. <a href="/profile/edit" style={styles.bioLink}>Add links</a>
                        </p>
                      )}
                  </div>
                </div>
              </>
            )}

          </>
        )}
      </div>


    </>
  );
};

export default ProfileDisplay;