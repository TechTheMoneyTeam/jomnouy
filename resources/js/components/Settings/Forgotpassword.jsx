import { useState } from 'react';
import axios from 'axios';
import styles from './SettingsCSS/Forgotpassword.module.css';
import { Link } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (!email) {
      setError('Please enter your email address');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post('/#', { email }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setSuccess('Password reset instructions have been sent to your email');
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset instructions');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.logoContainer}>
        <h1 className={styles.logo}>
          <span className={styles.jom}>jom-</span>
          <span className={styles.nouy}>nouy</span>
        </h1>
      </div>

      <div className={styles.formContainer}>
        <h2 className={styles.title}>Forgot your password?</h2>

        <p className={styles.description}>
          Enter your email address below and we'll send you instructions
          to reset your password.
        </p>

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

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              placeholder="Enter your email address"
              required
            />
          </div>

          <button
            type="submit"
            className={styles.resetButton}
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send me reset instructions'}
          </button>
        </form>

        <div className={styles.links}>
          <Link to="/login" className={styles.backLink}>
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;