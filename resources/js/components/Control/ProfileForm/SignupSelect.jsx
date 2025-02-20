import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserType = () => {
 const navigate = useNavigate();
 const [selectedType, setSelectedType] = useState(null);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState(null);

 // Verify user on component mount
 useEffect(() => {
   const userName = localStorage.getItem('tempUserId');
   if (!userName) {
     navigate('/signup');
   }
 }, [navigate]);

 const userTypes = [
   {
     id: 'investor',
     title: 'Investor', 
     description: 'Looking to invest in projects',
     color: '#FFD700',
     image: '/img/invest.png'
   },
   {
     id: 'entrepreneur',
     title: 'Entrepreneur',
     description: 'Looking for funding',
     color: '#4169E1', 
     image: '/img/business.png'
   },
   {
     id: 'startup',
     title: 'Project Startup',
     description: 'Planning to launch but not yet started',
     color: '#9370DB',
     image: '/img/payment.png'
   }
 ];

 const handleCardClick = (id) => {
   if (!loading) {
     setSelectedType(selectedType === id ? null : id);
     setError(null);
   }
 };

 const handleSubmit = async () => {
  if (!selectedType || loading) return;

  setLoading(true);
  setError(null);

  try {
    const userName = localStorage.getItem('tempUserId');
    
    // Add this console.log to see what we're sending
    console.log('Sending data:', {
      username: userName,
      user_type: selectedType
    });

    const response = await axios.post('/api/update-user-type', {
      username: userName,
      user_type: selectedType
    });

    // Add this to see the response
    console.log('Response:', response.data);

    localStorage.removeItem('tempUserId');
    navigate('/login');
  } catch (err) {
    // Improve error logging
    console.error('Error details:', err.response?.data);
    setError(err.response?.data?.message || 'Failed to update user type');
  } finally {
    setLoading(false);
  }
};

 const styles = {
   container: {
     width: '100vw',
     height: '100vh',
     display: 'flex',
     flexDirection: 'column',
     justifyContent: 'center',
     alignItems: 'center',
     padding: '40px',
     fontFamily: 'Arial, sans-serif',
     backgroundColor: '#f8f9fa',
     position: 'relative'
   },
   title: {
     textAlign: 'center',
     fontSize: '36px',
     fontWeight: 'bold',
     marginBottom: '60px',
     color: '#333'
   },
   cardContainer: {
     display: 'flex',
     gap: '40px',
     justifyContent: 'center',
     alignItems: 'stretch',
     width: '100%',
     maxWidth: '1400px',
     marginBottom: '20px'
   },
   card: (id) => ({
     flex: 1,
     padding: '60px 40px',
     borderRadius: '12px',
     cursor: loading ? 'not-allowed' : 'pointer',
     backgroundColor: selectedType === id ? 'rgba(248, 161, 69, 0.26)' : 'white',
     border: selectedType === id ? '3px solid #F07900' : '1px solid #e0e0e0',
     boxShadow: selectedType === id
       ? '0 8px 24px rgba(255, 136, 0, 0.2)'
       : '0 4px 16px rgba(0, 0, 0, 0.1)',
     transition: 'all 0.3s ease',
     display: 'flex',
     flexDirection: 'column',
     alignItems: 'center',
     position: 'relative',
     minWidth: '350px',
     maxWidth: '450px',
     transform: selectedType === id ? 'translateY(-5px)' : 'none',
     opacity: loading ? 0.7 : 1
   }),
   icon: (image) => ({
     width: '120px',
     height: '120px',
     borderRadius: '50%',
     backgroundImage: `url(${image})`,
     backgroundSize: 'cover',
     backgroundPosition: 'center',
     marginBottom: '30px'
   }),
   cardTitle: {
     fontSize: '24px',
     fontWeight: '600',
     marginBottom: '16px',
     color: '#333'
   },
   cardDescription: {
     fontSize: '18px',
     color: '#666',
     textAlign: 'center',
     margin: 0,
     lineHeight: '1.5'
   },
   checkbox: {
     position: 'absolute',
     top: '10px',
     right: '10px',
     cursor: loading ? 'not-allowed' : 'pointer'
   },
   buttonContainer: {
     display: 'flex',
     justifyContent: 'flex-end',
     width: '100%',
     maxWidth: '1400px',
     marginTop: '20px'
   },
   button: {
     padding: '16px 48px',
     backgroundColor: selectedType && !loading ? '#F07900' : '#cccccc',
     color: 'white',
     border: 'none',
     borderRadius: '8px',
     fontSize: '20px',
     cursor: selectedType && !loading ? 'pointer' : 'not-allowed',
     transition: 'background-color 0.3s ease',
     fontWeight: '600',
     boxShadow: selectedType && !loading
       ? '0 4px 12px rgba(255, 166, 0, 0.3)'
       : 'none',
     opacity: loading ? 0.7 : 1
   },
   errorMessage: {
     color: '#dc2626',
     textAlign: 'center',
     marginTop: '20px',
     fontSize: '16px'
   },
   loadingOverlay: loading ? {
     position: 'fixed',
     top: 0,
     left: 0,
     right: 0,
     bottom: 0,
     backgroundColor: 'rgba(255, 255, 255, 0.7)',
     display: 'flex',
     justifyContent: 'center',
     alignItems: 'center',
     zIndex: 1000
   } : null
 };

 return (
   <div style={styles.container}>
     {loading && (
       <div style={styles.loadingOverlay}>
         <div>Processing...</div>
       </div>
     )}

     <h1 style={styles.title}>What type of user are you?</h1>
     
     <div style={styles.cardContainer}>
       {userTypes.map((type) => (
         <div
           key={type.id}
           style={styles.card(type.id)}
           onClick={() => handleCardClick(type.id)}
         >
           <input
             type="checkbox"
             checked={selectedType === type.id}
             onChange={() => handleCardClick(type.id)}
             style={styles.checkbox}
             disabled={loading}
           />
           <div style={styles.icon(type.image)} />
           <h2 style={styles.cardTitle}>{type.title}</h2>
           <p style={styles.cardDescription}>{type.description}</p>
         </div>
       ))}
     </div>

     {error && <div style={styles.errorMessage}>{error}</div>}

     <div style={styles.buttonContainer}>
       <button 
         style={styles.button}
         disabled={!selectedType || loading}
         onClick={handleSubmit}
       >
         {loading ? 'Processing...' : 'Next'}
       </button>
     </div>
   </div>
 );
};

export default UserType;