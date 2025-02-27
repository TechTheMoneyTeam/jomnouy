import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock } from 'lucide-react';
import Navbars from '../Navbar/Navbarformyproject';
import styles from './MyProjects.module.css';

const Card = ({ className, children }) => (
  <div className={`${styles.card} ${className || ''}`}>
    {children}
  </div>
);

const CardContent = ({ className, children }) => (
  <div className={`${styles.cardContent} ${className || ''}`}>{children}</div>
);

const MyProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState('');

  // Get user from localStorage on component mount
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        console.log("User data from localStorage:", user);
        setUsername(user.username || '');
        setUserId(user.user_id);
      } catch (error) {
        console.error("Error parsing user data:", error);
        setError("Invalid user data in local storage");
      }
    }
  }, []);

  // Fetch projects when user ID is available
  useEffect(() => {
    if (userId) {
      fetchUserProjects();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const fetchUserProjects = async () => {
    try {
      console.log("Fetching projects for user ID:", userId);
      
      // Check your Laravel routes to find the correct endpoint
      // Try using the API prefix correctly (with leading slash)
      const response = await axios.get(`/api/user-projects/${userId}`);
      
      console.log("Projects fetched successfully:", response.data);
      
      // If response structure is different, adjust accordingly
      const projectsData = Array.isArray(response.data) ? response.data : 
                          (response.data.projects || response.data.data || []);
      
      setProjects(projectsData);
      setError(null);
    } catch (firstError) {
      console.error('First attempt to fetch projects failed:', firstError);
      
      try {
        // Try alternative endpoint formats based on common Laravel conventions
        console.log("Trying alternative endpoint with 'users' prefix");
        const altResponse = await axios.get(`/api/users/${userId}/projects`);
        
        const projectsData = Array.isArray(altResponse.data) ? altResponse.data : 
                            (altResponse.data.projects || altResponse.data.data || []);
        
        setProjects(projectsData);
        setError(null);
      } catch (secondError) {
        console.error('Second attempt failed:', secondError);
        
        try {
          // Third attempt - try a different convention
          console.log("Trying final alternative endpoint");
          const finalResponse = await axios.get(`/api/projects?user_id=${userId}`);
          
          const projectsData = Array.isArray(finalResponse.data) ? finalResponse.data : 
                              (finalResponse.data.projects || finalResponse.data.data || []);
          
          setProjects(projectsData);
          setError(null);
        } catch (finalError) {
          console.error('All attempts to fetch projects failed:', finalError);
          setError('Failed to load your projects. Please check your API routes configuration.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const formatFunding = (amount) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K`;
    }
    return amount;
  };

  const getDaysSinceCreation = (createdAt) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (!userId) {
    return (
      <div className={styles.notLoggedIn}>
        <h2>Please log in to view your projects</h2>
        <button 
          onClick={() => window.location.href = '/login'} 
          className={styles.loginButton}
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <>
      <Navbars />

      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>My Projects</h1>
          <p className={styles.welcomeText}>
            Welcome back, <strong>{username}</strong>
          </p>
          <p className={styles.userIdText}>User ID: {userId}</p>
        </div>

        {error && (
          <div className={styles.error}>
            {error}
            <button
              onClick={fetchUserProjects}
              className={styles.retryButton}
            >
              Retry
            </button>
          </div>
        )}

        <div className={styles.projectsContainer}>
          <div className={styles.projectsHeader}>
            <h2 className={styles.sectionTitle}>
              You have <span className={styles.highlight}>{projects.length} projects</span>
            </h2>

            {loading && (
              <div className={styles.spinner} />
            )}
          </div>

          {projects.length > 0 ? (
            <div className={styles.projectGrid}>
              {projects.map((project) => (
                <Card key={project.project_id || project.id}>
                  <img
                    src={project.project_img_url || project.image_url || "/api/placeholder/400/200"}
                    alt={project.title}
                    className={styles.projectImage}
                    onError={(e) => {
                      e.target.src = "/api/placeholder/400/200";
                    }}
                  />
                  <CardContent>
                    <div className={styles.projectTitleRow}>
                      <div className={styles.avatar} />
                      <span className={styles.projectTitle}>{project.title}</span>
                    </div>
                    <div className={styles.projectType}>
                      Type: {project.project_type || project.type || "N/A"}
                    </div>
                    <div className={styles.projectInfo}>
                      Project ID: {project.project_id || project.id} | Owner ID: {project.user_id || project.userId || project.creator_id || "Unknown"}
                    </div>
                    <div className={styles.projectStats}>
                      <Clock size={16} />
                      <span>{getDaysSinceCreation(project.created_at)} days ago</span>
                      <span className={styles.dot}>•</span>
                      <span>{formatFunding(project.funding_goal || project.funding || 0)}$ Needed Fund</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : !loading ? (
            <div className={styles.noProjects}>
              <p>You haven't created any projects yet.</p>
              <button
                onClick={() => window.location.href = '/create-project'}
                className={styles.createButton}
              >
                Create Your First Project
              </button>
            </div>
          ) : null}

          {loading && projects.length === 0 && (
            <div className={styles.loadingContainer}>
              <div className={styles.largeSpinner} />
              <p>Loading your projects...</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyProjects;