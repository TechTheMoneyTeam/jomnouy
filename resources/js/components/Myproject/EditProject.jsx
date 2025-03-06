import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './EditProject.module.css';
import Navbars from '../Navbar/Navbarformyproject';

const EditProject = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState({
        title: '',
        funding_goal: '',
        project_type: '',
        project_des: '',
        project_story: '',
        reserve_price: '',
        categories: '',
        member_name: '',
        member_position: '',
        project_location: '',
        status: '',
        auction_start_date: '',
        auction_end_date: ''
    });
    const [projectImage, setProjectImage] = useState(null);
    const [projectVideo, setProjectVideo] = useState(null);
    const [previewImage, setPreviewImage] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                console.log(`Fetching project with ID: ${projectId}`);
                const response = await axios.get(`/api/projects/${projectId}`);
                
                console.log("Project data received:", response.data);
                
                // Handle potential response format differences
                const projectData = response.data.project || response.data;
                
                setProject({
                    title: projectData.title || '',
                    funding_goal: projectData.funding_goal || 0,
                    project_type: projectData.project_type || '',
                    project_des: projectData.project_des || '',
                    project_story: projectData.project_story || '',
                    reserve_price: projectData.reserve_price || '',
                    categories: projectData.categories || '',
                    member_name: projectData.member_name || '',
                    member_position: projectData.member_position || '',
                    project_location: projectData.project_location || '',
                    status: projectData.status || 'pending',
                    auction_start_date: projectData.auction_start_date || '',
                    auction_end_date: projectData.auction_end_date || '',
                    user_id: projectData.user_id
                });
                
                // Set image preview if available
                if (projectData.project_img) {
                    setPreviewImage(`/storage/${projectData.project_img}`);
                }
                
                setLoading(false);
            } catch (error) {
                console.error("Error fetching project:", error);
                setError('Failed to fetch project details. Please try again.');
                setLoading(false);
            }
        };

        fetchProject();
    }, [projectId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProject({ ...project, [name]: value });
    };
    
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProjectImage(file);
            // Create preview URL
            const previewURL = URL.createObjectURL(file);
            setPreviewImage(previewURL);
        }
    };
    
    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProjectVideo(file);
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        
        try {
            if (!project.title) {
                setError('Project title is required');
                return;
            }
            
            console.log("Updating project with data:", project);
            
            // Create FormData for file uploads
            const formData = new FormData();
            
            // Add all fields to FormData
            Object.keys(project).forEach(key => {
                if (project[key] !== null && project[key] !== undefined) {
                    formData.append(key, project[key]);
                }
            });
            
            // Add files if present
            if (projectImage) {
                formData.append('project_img', projectImage);
            }
            
            if (projectVideo) {
                formData.append('project_video', projectVideo);
            }
            
            // Some Laravel configurations require this approach for PUT/PATCH with FormData
            const response = await axios.post(`/api/projects/${projectId}?_method=PUT`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-HTTP-Method-Override': 'PUT'
                }
            });
            
            console.log("Update response:", response.data);
            setSuccess(true);
            
            // Navigate after a short delay to show success message
            setTimeout(() => {
                navigate('/my-project');
            }, 1500);
            
        } catch (error) {
            console.error("Error updating project:", error);
            setError('Failed to update project: ' + (error.response?.data?.message || error.message));
            window.scrollTo(0, 0); // Scroll to top to show error
        }
    };

    const handleCancel = () => {
        navigate('/my-project');
    };

    if (loading) {
        return (
            <>
                <Navbars />
                <div className={styles.loadingContainer}>
                    <div className={styles.spinner} />
                    <p>Loading project...</p>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbars />
            <div className={styles.container}>
                <h1 className={styles.title}>Edit Project</h1>
                
                {error && <div className={styles.error}>{error}</div>}
                {success && <div className={styles.success}>Project updated successfully!</div>}
                
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="title">Title*</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={project.title}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label htmlFor="funding_goal">Funding Goal ($)</label>
                        <input
                            type="number"
                            id="funding_goal"
                            name="funding_goal"
                            value={project.funding_goal}
                            onChange={handleInputChange}
                            min="0"
                        />
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label htmlFor="project_type">Project Type</label>
                        <select
                            id="project_type"
                            name="project_type"
                            value={project.project_type}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Type</option>
                            <option value="technology">Technology</option>
                            <option value="art">Art</option>
                            <option value="design">Design</option>
                            <option value="film">Film</option>
                            <option value="games">Games</option>
                            <option value="music">Music</option>
                            <option value="food">Food</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label htmlFor="categories">Categories</label>
                        <input
                            type="text"
                            id="categories"
                            name="categories"
                            value={project.categories}
                            onChange={handleInputChange}
                            placeholder="Comma-separated categories"
                        />
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label htmlFor="project_des">Description</label>
                        <textarea
                            id="project_des"
                            name="project_des"
                            value={project.project_des}
                            onChange={handleInputChange}
                            rows="4"
                        />
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label htmlFor="project_story">Project Story</label>
                        <textarea
                            id="project_story"
                            name="project_story"
                            value={project.project_story}
                            onChange={handleInputChange}
                            rows="6"
                        />
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label htmlFor="project_img">Project Image</label>
                        <input
                            type="file"
                            id="project_img"
                            name="project_img"
                            onChange={handleImageChange}
                            accept="image/jpeg,image/png,image/jpg,image/gif"
                        />
                        {previewImage && (
                            <div className={styles.previewContainer}>
                                <img 
                                    src={previewImage} 
                                    alt="Project preview" 
                                    className={styles.imagePreview}
                                    onError={(e) => {
                                        e.target.src = "/api/placeholder/400/200";
                                    }} 
                                />
                            </div>
                        )}
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label htmlFor="project_video">Project Video</label>
                        <input
                            type="file"
                            id="project_video"
                            name="project_video"
                            onChange={handleVideoChange}
                            accept="video/mp4,video/mov,video/avi,video/wmv"
                        />
                    </div>
                    
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label htmlFor="member_name">Team Member Name</label>
                            <input
                                type="text"
                                id="member_name"
                                name="member_name"
                                value={project.member_name}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="member_position">Team Member Position</label>
                            <input
                                type="text"
                                id="member_position"
                                name="member_position"
                                value={project.member_position}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label htmlFor="project_location">Project Location</label>
                        <input
                            type="text"
                            id="project_location"
                            name="project_location"
                            value={project.project_location}
                            onChange={handleInputChange}
                        />
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label htmlFor="reserve_price">Reserve Price ($)</label>
                        <input
                            type="number"
                            id="reserve_price"
                            name="reserve_price"
                            value={project.reserve_price}
                            onChange={handleInputChange}
                            min="0"
                        />
                    </div>
                    
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label htmlFor="auction_start_date">Auction Start Date</label>
                            <input
                                type="date"
                                id="auction_start_date"
                                name="auction_start_date"
                                value={project.auction_start_date}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="auction_end_date">Auction End Date</label>
                            <input
                                type="date"
                                id="auction_end_date"
                                name="auction_end_date"
                                value={project.auction_end_date}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    
                    <div className={styles.buttonGroup}>
                        <button type="button" onClick={handleCancel} className={styles.cancelButton}>
                            Cancel
                        </button>
                        <button type="submit" className={styles.submitButton}>
                            Update Project
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default EditProject;