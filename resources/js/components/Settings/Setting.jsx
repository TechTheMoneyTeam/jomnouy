import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import styles from './SettingsCSS/Settings.module.css';
import Navbar2 from '../Navbar/Navbarforsubmit';
import '../Navbar/Navbar.css';

export default function Settings() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setUsername(user.username);
      fetchSettings(user.username);
    }
  }, []);

  const fetchSettings = async (username) => {
    try {
      const response = await axios.get(`/api/settings`, {
        params: { username }
      });
      if (response.data.data) {
        setEmail(response.data.data.email);
      }
    } catch (err) {
      setError('Failed to load settings');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword && newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      const response = await axios.post('/api/settings/change-password', {
        username,
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword
      });

      setSuccess('Settings updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update settings');
    }
  };

  return (
    <><Navbar2 /><div className={styles.container}>
          <h1 className={styles.title}>Settings</h1>

          <nav className={styles.nav}>
              <Link to="/settings" className={`${styles.navLink} ${styles.activeNavLink}`}>
                  Account
              </Link>
              <Link to="/profile/edit" className={styles.navLink}>
                  Edit Profile
              </Link>
              <Link to="/followings" className={styles.navLink}>
                  Followings
              </Link>
              <Link to="/notifications" className={styles.navLink}>
                  Notifications
              </Link>
          </nav>

          {error && (
              <div className={styles.errorAlert}>
                  <p className={styles.errorText}>{error}</p>
              </div>
          )}

          {success && (
              <div className={styles.successAlert}>
                  <p className={styles.successText}>{success}</p>
              </div>
          )}

          <form onSubmit={handleSave} className={styles.form}>
              <div className={styles.formGroup}>
                  <label className={styles.label}>Email</label>
                  <input
                      type="email"
                      value={email}
                      disabled
                      className={`${styles.input} ${styles.inputDisabled}`} />
              </div>

              <div className={styles.formGroup}>
                  <label className={styles.label}>Password</label>
                  <button
                      type="button"
                      className={styles.changePasswordBtn}
                      onClick={() => setShowChangePassword(true)}
                  >
                      Change Password
                  </button>
              </div>

              {showChangePassword && (
                  <>
                      <div className={styles.formGroup}>
                          <label className={styles.label}>New Password</label>
                          <input
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className={styles.input} />
                      </div>

                      <div className={styles.formGroup}>
                          <label className={styles.label}>Confirm Password</label>
                          <input
                              type="password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className={styles.input} />
                      </div>

                      <div className={styles.formGroup}>
                          <label className={styles.label}>Current Password</label>
                          <input
                              type="password"
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              className={styles.input}
                              placeholder="Enter your current password to save these things" />
                      </div>
                  </>
              )}

              <button type="submit" className={styles.saveButton}>
                  Save Settings
              </button>
          </form>
      </div></>
  );
}