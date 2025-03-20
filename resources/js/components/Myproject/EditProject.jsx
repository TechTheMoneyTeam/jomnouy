import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar2 from '../Navbar/Navbarforsubmit';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './EditProject.module.css'; // You'll need to create this CSS module

const EditProject = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [project, setProject] = useState({
        title: '',
        description: '',
        funding_goal: '',
        project_type: '',
        status: 'draft',
        project_img_url: ''
    });

    useEffect(() => {
        fetchProject();
    }, [id]);

    const fetchProject = async () => {
        try {
            const response = await axios.get(`/api/projects/${id}`);
            console.log("Project fetched successfully:", response.data);
            const projectData = response.data;

            setProject({
                title: projectData.title || '',
                description: projectData.description || '',
                funding_goal: projectData.funding_goal || '',
                project_type: projectData.project_type || projectData.type || '',
                status: projectData.status || 'draft',
                project_img_url: projectData.project_img_url || projectData.image_url || ''
            });

            setError(null);
        } catch (error) {
            console.error('Failed to fetch project:', error);
            setError('Failed to load project details. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProject(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        // Handle image upload if needed
        // This is a placeholder for file upload handling
        console.log("Image selected:", e.target.files[0]);

        // If you want to display a preview
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setProject(prev => ({
                    ...prev,
                    project_img_url: event.target.result
                }));
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const response = await axios.put(`/api/projects/${id}`, project);
            console.log("Project updated successfully:", response.data);

            // Redirect to the project details page
            navigate(`/projects/${id}`);
        } catch (error) {
            console.error('Failed to update project:', error);
            setError('Failed to update the project. Please check your input and try again.');
            setLoading(false);
        }
    };

    if (loading && !project.title) {
        return (
            <>
                <Navbar2 />
                <div className={styles.container}>
                    <div className={styles.loadingContainer}>
                        <div className={styles.spinner} />
                        <p>Loading project details...</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar2 />
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Edit Project</h1>
                </div>

                {error && (
                    <div className={styles.error}>
                        {error}
                        <button
                            onClick={fetchProject}
                            className={styles.retryButton}
                        >
                            Retry
                        </button>
                    </div>
                )}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="title" className={styles.label}>Project Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={project.title}
                            onChange={handleChange}
                            className={styles.input}

                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="description" className={styles.label}>Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={project.description}
                            onChange={handleChange}
                            className={styles.textarea}
                            rows="6"

                        />
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label htmlFor="funding_goal" className={styles.label}>Funding Goal ($)</label>
                            <input
                                type="number"
                                id="funding_goal"
                                name="funding_goal"
                                value={project.funding_goal}
                                onChange={handleChange}
                                className={styles.input}

                                min="1"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="project_type" className={styles.label}>Project Type</label>
                            <select
                                id="project_type"
                                name="project_type"
                                value={project.project_type}
                                onChange={handleChange}
                                className={styles.select}

                            >
                                <option value="">Select a type</option>
                                <option value="Startup">Startup</option>
                                <option value="Real Estate">Real Estate</option>
                                <option value="Technology">Technology</option>
                                <option value="Food & Beverage">Food & Beverage</option>
                                <option value="Healthcare">Healthcare</option>
                                <option value="Education">Education</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>


                    <div className={styles.formGroup}>
                        <label htmlFor="project_image" className={styles.label}>Project Image</label>
                        <div className={styles.imageUpload}>
                            {project.project_img_url && (
                                <div className={styles.imagePreview}>
                                    <img
                                        src={project.project_img_url}
                                        alt="Project Preview"
                                        className={styles.previewImage}
                                        style={{
                                            width: '100%',
                                            height: 'auto',
                                            objectFit: 'contain',
                                            maxHeight: '300px'
                                        }}
                                    />
                                </div>
                            )}
                            <input
                                type="file"
                                id="project_image"
                                name="project_image"
                                onChange={handleImageChange}
                                className={styles.fileInput}
                                accept="image/*"
                            />
                            <button type="button" className={styles.uploadButton}>
                                Choose Image
                            </button>
                        </div>
                    </div>

                    <div className={styles.formActions}>
                        <button
                            type="button"
                            onClick={() => navigate(`/projects/${id}`)}
                            className={styles.cancelButton}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={loading}
                        >
                            {loading ? 'Updating...' : 'Update Project'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default EditProject;