import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar10 from '../Navbar/Navbarforview';
import { FaRegClock, FaTrash } from 'react-icons/fa';
import { PiShareFat } from 'react-icons/pi';
import './favorites.css';

const FavoritesPage = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);
    const [username, setUsername] = useState('');
    

    // Function to calculate days since creation
    const getDaysSinceCreation = (createdAt) => {
        const created = new Date(createdAt);
        const now = new Date();
        const diffTime = Math.abs(now - created);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    useEffect(() => {
        // Get user data from local storage using the new approach
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                console.log("User data from localStorage:", user);
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

    if (loading) return <div className="text-center py-8">Loading your favorite projects...</div>;
    if (error) return <div className="text-center py-8 text-red-600">{error}</div>;

    return (
        <>
            <Navbar10 />
            <div className="favorites-container max-w-6xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">
                    {username ? `${username}'s Favorite Projects` : 'My Favorite Projects'}
                </h1>

                {favorites.length === 0 ? (
                    <div className="empty-favorites">
                        <p>You haven't saved any projects yet.</p>
                        <Link to="/" className="browse-projects-btn">Browse Projects</Link>
                    </div>
                ) : (
                    <div className="favorites-grid">
                        {favorites.map((project) => (
                            <div key={project.project_id} className="favorite-card">
                                <div className="favorite-image">
                                    <Link to={`/projects/${project.project_id}`}>
                                        <img
                                            src={project.project_img_url || project.image_url || project.project_img || "/api/placeholder/400/320"}
                                            alt={project.title}
                                            className="w-full h-48 object-cover rounded-t-lg"
                                        />
                                    </Link>
                                </div>
                                <div className="favorite-content p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <Link to={`/projects/${project.project_id}`} className="favorite-title">
                                            <h3 className="font-medium text-lg">{project.title}</h3>
                                        </Link>
                                        <div className="favorite-actions">
                                            <button
                                                className="action-btn text-red-500"
                                                onClick={() => handleRemoveFavorite(project.project_id)}
                                                title="Remove from favorites"
                                            >
                                                <FaTrash />
                                            </button>
                                            <button className="action-btn">
                                                <PiShareFat className="share-icon" title="Share project" />
                                            </button>
                                        </div>
                                    </div>

                                    <p className="favorite-description text-sm text-gray-600 mb-4">
                                        {project.project_des?.substring(0, 120)}
                                        {project.project_des?.length > 120 ? '...' : ''}
                                    </p>

                                    <div className="flex items-center text-sm text-gray-500 mb-2">
                                        <div className="flex items-center mr-4">
                                            <FaRegClock className="w-4 h-4 mr-1 text-black/70" />
                                            <span className="text-black/70 font-semibold">
                                                {getDaysSinceCreation(project.created_at)} days ago
                                            </span>
                                        </div>
                                    </div>

                                    <div className="favorite-footer mt-4">
                                        <div className="funding-progress">
                                            <div className="progress-bar">
                                                <div
                                                    className="progress-fill"
                                                    style={{
                                                        width: `${Math.min((project.total_invested / project.funding_goal) * 100, 100)}%`,
                                                        backgroundColor: project.total_invested / project.funding_goal < 0.5 ? '#FFA500' : '#FF7F00'
                                                    }}
                                                ></div>
                                            </div>
                                            <div className="funding-info mt-2">
                                                <span className="funding-amount">US$ {project.total_invested?.toLocaleString()}</span>
                                                <span className="funding-percentage">
                                                    {((project.total_invested / project.funding_goal) * 100).toFixed(2)}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default FavoritesPage;