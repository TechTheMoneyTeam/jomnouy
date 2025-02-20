import React, { useState } from 'react';

const UserType= () => {
  const [selectedType, setSelectedType] = useState(null);

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
      backgroundColor: '#f8f9fa'
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
      cursor: 'pointer',
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
      transform: selectedType === id ? 'translateY(-5px)' : 'none'
    }),
    icon: (image) => ({
      width: '120px', // Increased icon size
      height: '120px', // Increased icon size
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
      cursor: 'pointer'
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
      backgroundColor: selectedType ? '#F07900' : '#cccccc',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '20px',
      cursor: selectedType ? 'pointer' : 'not-allowed',
      transition: 'background-color 0.3s ease',
      fontWeight: '600',
      boxShadow: selectedType 
        ? '0 4px 12px rgba(255, 166, 0, 0.3)'
        : 'none'
    }
  };

  const handleCardClick = (id) => {
    setSelectedType(selectedType === id ? null : id);
  };

  return (
    <div style={styles.container}>
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
            />
            <div style={styles.icon(type.image)} />
            <h2 style={styles.cardTitle}>{type.title}</h2>
            <p style={styles.cardDescription}>{type.description}</p>
          </div>
        ))}
      </div>

      <div style={styles.buttonContainer}>
        <button 
          style={styles.button}
          disabled={!selectedType}
          onClick={() => console.log('Selected:', selectedType)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserType;