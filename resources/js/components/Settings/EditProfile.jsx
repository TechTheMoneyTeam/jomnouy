import { useState, useEffect } from 'react';
import styles from './SettingsCSS/EditProfile.module.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navbar2 from '../Navbar/Navbarforsubmit';
import '../Navbar/Navbar.css';

const EditProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    biography: '',
    location: '',
    facebookLink: '',
    youtubeLink: '',
    tiktokLink: '',
    website: ''
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [username, setUsername] = useState('');

  // Array of 25 cities in Cambodia for the dropdown, with ".Cambodia" format
  const cambodiaCities = [
    'Phnom Penh, Cambodia',
    'Siem Reap, Cambodia',
    'Battambang, Cambodia',
    'Sihanoukville, Cambodia',
    'Kampot, Cambodia',
    'Kep, Cambodia',
    'Kampong Cham, Cambodia',
    'Kampong Thom, Cambodia',
    'Kratie, Cambodia',
    'Stung Treng, Cambodia',
    'Banlung, Cambodia',
    'Kampong Chhnang, Cambodia',
    'Pursat, Cambodia',
    'Pailin, Cambodia',
    'Poipet, Cambodia',
    'Svay Rieng, Cambodia',
    'Prey Veng, Cambodia',
    'Takeo, Cambodia',
    'Kampong Speu, Cambodia',
    'Preah Vihear, Cambodia',
    'Mondulkiri, Cambodia',
    'Koh Kong, Cambodia',
    'Oddar Meanchey, Cambodia',
    'Tbong Khmum, Cambodia',
    'Kandal, Cambodia',
    'Outside Cambodia'
  ];

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setUsername(user.username);
      fetchProfileData(user.username);
    }
  }, []);

  const fetchProfileData = async (username) => {
    try {
      const response = await fetch(`/api/profile?username=${username}`);
      const data = await response.json();
      if (data.success) {
        setFormData({
          username: username,
          biography: data.profile.bio || '',
          location: data.profile.location || '',
          facebookLink: data.profile.facebook_link || '',
          youtubeLink: data.profile.youtube_link || '',
          tiktokLink: data.profile.tiktok_link || '',
          website: data.profile.website || ''
        });
        
       
        if (data.profile.profile_picture) {
          setImagePreview(`/storage/${data.profile.profile_picture}`);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearForm = () => {
    setFormData({
      username: username,
      biography: '',
      location: '',
      facebookLink: '',
      youtubeLink: '',
      tiktokLink: '',
      website: ''
    });
    setProfilePicture(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('username', username);
      
   
      Object.keys(formData).forEach(key => {
        if (key !== 'username') { 
          formDataToSend.append(key, formData[key]);
        }
      });

      if (profilePicture) {
        formDataToSend.append('profile_picture', profilePicture);
      }

      const response = await fetch('/api/profile/update', {
        method: 'POST',
        body: formDataToSend
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        alert('Profile updated successfully!');
        clearForm();  
        fetchProfileData(username);  
      } else {
        throw new Error(result.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(`Failed to update profile: ${error.message}`);
    }
  };

  return (
    <>
      <Navbar2 />
      <div className={styles.container}>
        <h1 className={styles.title}>Settings</h1>

        <div className={styles.tabContainer}>
          <Link to="/settings" className={styles.tabButton}>
            Account
          </Link>
          <button className={`${styles.tabButton} ${styles.activeTab}`}>Edit Profile</button>

          <Link to="/followings" className={styles.tabButton}>
            Following
          </Link>
          <Link to="/noti" className={styles.tabButton}>
            Notifications
          </Link>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.leftSection}>
            <div className={styles.formGroup}>
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={username}
                disabled
                className={styles.input} />
            </div>

            <div className={styles.formGroup}>
              <label>Profile Picture</label>
              <div className={styles.imageUpload}>
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className={styles.preview} />
                ) : (
                  <div className={styles.uploadPlaceholder}>
                    <span>Choose Image</span>
                    <span className={styles.fileTypes}>PNG, JPG up to 10MB</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className={styles.fileInput} />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Biography</label>
              <textarea
                name="biography"
                value={formData.biography}
                onChange={handleInputChange}
                className={styles.textarea}
                placeholder="We suggest a short bio. If it's 300 characters or less it'll look great on your profile." />
            </div>

            <div className={styles.formGroup}>
              <label>Location</label>
              <select
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className={styles.input}
              >
                <option value="">Select a city in Cambodia / Outside </option>
                {cambodiaCities.map((city, index) => (
                  <option key={index} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.rightSection}>
            <h2 className={styles.sectionTitle}>Outside Links</h2>

            <div className={styles.formGroup}>
              <label>Facebook Link</label>
              <input
                type="url"
                name="facebookLink"
                value={formData.facebookLink}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="http://www.facebook.com/mypage" />
            </div>

            <div className={styles.formGroup}>
              <label>Youtube Link</label>
              <input
                type="url"
                name="youtubeLink"
                value={formData.youtubeLink}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="http://www.youtube.com/mychannel" />
            </div>

            <div className={styles.formGroup}>
              <label>Tiktok Link</label>
              <input
                type="url"
                name="tiktokLink"
                value={formData.tiktokLink}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="http://www.tiktok.com/@myaccount" />
            </div>

            <div className={styles.formGroup}>
              <label>Your Website</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="http://www.mywebsite.com" />
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.saveButton}>
              Save Settings
            </button>
            <button type="button" onClick={clearForm} className={styles.clearButton}>
              Clear Form
            </button>
            <a href="/profile" className={styles.viewProfileLink}>
              View Profile
            </a>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditProfile;