import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar4 from '../Navbar/Navbarselect';
import { FaRegClock, FaTrash, FaHeart } from 'react-icons/fa';
import { PiShareFat } from 'react-icons/pi';
import styles from './Favorites.module.css';

const FavoritesPage = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);
    const [username, setUsername] = useState('');
    const [filterActive, setFilterActive] = useState('all');

    // Function to calculate days since creation
    const getDaysSinceCreation = (createdAt) => {
        const created = new Date(createdAt);
        const now = new Date();
        const diffTime = Math.abs(now - created);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    useEffect(() => {
        // Get user data from local storage
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                setUsername(user.username || '');
                setUserId(user.user_id);

                // Fetch user's favorite projects
                axios.get(`/api/users/${user.user_id}/favorites`)
                    .then(response => {
                        setFavorites(response.data);
                        setLoading(false);
                    })
                    .catch(error => {
                        console.error('Error fetching favorites:', error);
                        setError('Failed to load favorite projects');
                        setLoading(false);
                    });
            } catch (error) {
                console.error("Error parsing user data:", error);
                setError("Invalid user data in local storage");
                setLoading(false);
            }
        } else {
            setError('You need to be logged in to view favorites');
            setLoading(false);
        }
    }, []);

    const handleRemoveFavorite = (projectId) => {
        if (!userId) return;

        // Show confirmation dialog
        if (window.confirm('Are you sure you want to remove this project from your favorites?')) {
            // Delete favorite from database
            axios.delete(`/api/users/${userId}/favorites/${projectId}`)
                .then(() => {
                    // Update local state after successful deletion
                    setFavorites(favorites.filter(fav => fav.project_id !== projectId));
                })
                .catch(error => {
                    console.error('Error removing favorite:', error);
                    alert('Failed to remove project from favorites');
                });
        }
    };

    const filteredFavorites = favorites.filter(project => {
        if (filterActive === 'all') return true;
        if (filterActive === 'funded' && (project.total_invested / project.funding_goal) >= 1) return true;
        if (filterActive === 'in-progress' && (project.total_invested / project.funding_goal) < 1) return true;
        return false;
    });

    if (loading) return <div className={styles.loadingContainer}><div className={styles.loader}></div></div>;
    if (error) return <div className={styles.errorContainer}>{error}</div>;

    return (
        <div className={styles.pageWrapper}>
            <Navbar4 />
            <div className={styles.heroSection}>
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>My Favorite Projects</h1>
                    <p className={styles.heroSubtitle}>
                        {username ? `${username}'s favorited list of inspiring projects` : 'Your curated list of inspiring projects'}
                    </p>
                </div>
            </div>

            <div className={styles.container}>
                <div className={styles.filterSection}>
                    <div className={styles.filterButtons}>
                        <button 
                            className={`${styles.filterButton} ${filterActive === 'all' ? styles.active : ''}`}
                            onClick={() => setFilterActive('all')}
                        >
                            All Projects
                        </button>
                    
                    </div>
                    <div className={styles.stats}>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>{favorites.length}</span>
                            <span className={styles.statLabel}>Favorites</span>
                        </div>
                    </div>
                </div>

                {filteredFavorites.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyStateIcon}>
                            <FaHeart size={50} />
                        </div>
                        <h2 className={styles.emptyStateTitle}>No favorites yet</h2>
                        <p className={styles.emptyStateText}>
                            You haven't added any projects to your favorites collection yet.
                        </p>
                        <Link to="/projectlist1" className={styles.browseButton}>
                            Discover Projects
                        </Link>
                    </div>
                ) : (
                    <div className={styles.favoritesGrid}>
                        {filteredFavorites.map((project) => {
                            const fundingPercentage = (project.total_invested / project.funding_goal) * 100;
                            const isFunded = fundingPercentage >= 100;
                            
                            return (
                                <div key={project.project_id} className={styles.favoriteCard}>
                                    <div className={styles.cardImageContainer}>
                                        <Link to={`/projects/${project.project_id}`}>
                                            <img
                                                src={project.project_img_url || project.image_url || project.project_img || "/api/placeholder/400/320"}
                                                alt={project.title}
                                                className={styles.cardImage}
                                            />
                                            
                                        </Link>
                                        <button
                                            className={styles.removeButton}
                                            onClick={() => handleRemoveFavorite(project.project_id)}
                                            title="Remove from favorites"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                    <div className={styles.cardContent}>
                                        <Link to={`/projects/${project.project_id}`} className={styles.projectTitle}>
                                            <h3>{project.title}</h3>
                                        </Link>
                                        <p className={styles.projectDescription}>
                                            {project.project_des?.substring(0, 120)}
                                            {project.project_des?.length > 120 ? '...' : ''}
                                        </p>
                                        <div className={styles.fundingContainer}>
                                            <div className={styles.progressBarContainer}>
                                                <div 
                                                    className={styles.progressBar}
                                                    style={{
                                                        width: `${Math.min(fundingPercentage, 100)}%`,
                                                    }}
                                                    data-funded={isFunded}
                                                ></div>
                                            </div>
                                            <div className={styles.fundingDetails}>
                                                <div className={styles.fundingAmount}>
                                                    <span className={styles.currencySymbol}>US$</span>
                                                    <span className={styles.amount}>{project.total_invested?.toLocaleString()}</span>
                                                </div>
                                                <div className={styles.fundingPercentage}>
                                                    {fundingPercentage.toFixed(1)}%
                                                </div>
                                            </div>
                                            <div className={styles.fundingGoal}>
                                                of US$ {project.funding_goal?.toLocaleString()} goal
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FavoritesPage;