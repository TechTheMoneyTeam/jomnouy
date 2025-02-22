import React, { useState, useEffect } from 'react';
import Navbar2 from '../Navbar/Navbarforsubmit';
import '../Navbar/Navbar.css';

const ProfileDisplay = () => {
  const [userInfo, setUserInfo] = useState({});
  const [activeSection, setActiveSection] = useState('about');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setUserInfo(user);
    }
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `Joined ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
  };

  const categories = [
    'Music', 'Sport', 'Technologies', 'Art', 'Fashions', 'Games',
    'Theater', 'Publishing', 'Design', 'Food & Beverage', 'Health & Fitness',
    'Education', 'Photography'
  ];

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
      marginBottom: '16px'
    },
    username: {
      fontSize: '20px',
      fontWeight: '600',
      marginBottom: '8px'
    },
    bio: {
      color: '#6b7280',
      marginBottom: '8px'
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
    categoriesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
      gap: '16px',
      textAlign: 'center'
    },
    categoryItem: {
      color: '#6b7280',
      fontSize: '14px',
      cursor: 'pointer'
    }
  };

  return (<><Navbar2 /><div style={styles.container}>
    <h1 style={styles.title}>Profile</h1>

    <div style={styles.profileSection}>
      <div style={styles.avatar}>
        {userInfo.username?.charAt(0).toUpperCase() || '?'}
      </div>
      <h2 style={styles.username}>{userInfo.username || 'No username found'}</h2>
      <p style={styles.bio}>
        Let people know about you more. <a href="#" style={styles.bioLink}>Add a biography</a>
      </p>
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
      <button
        style={{
          ...styles.navButton,
          ...(activeSection === 'invested' ? styles.activeNavButton : {})
        }}
        onClick={() => setActiveSection('invested')}
      >
        Invested <span style={styles.badge}>0</span>
      </button>
    </div>

    {activeSection === 'about' && (
      <>
        <div style={styles.detailsSection}>
          <h3 style={styles.sectionTitle}>Details</h3>
          <p style={styles.detailText}>{formatDate(userInfo.created_at)}</p>
          <p style={styles.detailText}>Invested 0 project</p>
          <p style={styles.detailText}>User ID: {userInfo.user_id || 'No ID found'}</p>
          <p style={styles.detailText}>User Type: {userInfo.user_type || 'No type found'}</p>
        </div>

        <div style={styles.detailsSection}>
          <h3 style={styles.sectionTitle}>Outside link</h3>
          <p style={styles.detailText}>facebook.com/{userInfo.username}</p>
          <p style={styles.detailText}>t.me/{userInfo.username}</p>
        </div>
      </>
    )}

    {activeSection === 'invested' && (
      <p style={styles.detailText}>No investments yet</p>
    )}

  </div>
  
  <div className="categories-container py-4 flex justify-center items-center space-x-6">

                {['Music', 'Sport', 'Technologies', 'Art', 'Fashions', 'Games', 'Theater', 'Publishing', 'Design', 'Food & Beverage', 'Health & Fitness', 'Education', 'Photograph'].map((category) => (
                    <div className="category-item" key={category}>
                        <a href="#" className="text-semibold">{category}</a>
                    </div>
                ))}
            </div></>
    
  );
};

export default ProfileDisplay;