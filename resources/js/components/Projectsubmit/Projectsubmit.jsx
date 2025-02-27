import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar2 from '../Navbar/Navbarforsubmit';
import '../Navbar/Navbar.css';

const ProjectSubmitForm = () => {
    // Predefined options arrays
    const projectLocations = [
        'North America', 'South America', 'Europe', 'Asia', 'Africa', 
        'Australia', 'Antarctica', 'Global', 'Online'
    ];
    
    const projectStatuses = ['pending', 'in_progress', 'completed'];
    
    const projectCategories = [
        'Technology', 'Art', 'Design', 'Film', 'Music', 'Publishing', 
        'Games', 'Food', 'Fashion', 'Crafts', 'Photography', 'Comics', 
        'Illustration', 'Theater', 'Education', 'Health', 'Environment'
    ];
    
    const projectTypes = ['Start-up Project', 'Existing Project', 'Expansion Project', 'Research Project', 'Community Project'];

    const [formData, setFormData] = useState({
        user_id: '',
        title: '',
        funding_goal: '',
        status: 'pending',
        project_type: '',
        project_des: '',
        project_location: '',
        reserve_price: '',
        categories: '',
        auction_start_date: '',
        auction_end_date: ''
    });

    const [projectImg, setProjectImg] = useState(null);
    const [projectVideo, setProjectVideo] = useState(null);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [currentUser, setCurrentUser] = useState(null);
    const [previewImg, setPreviewImg] = useState(null);
    const [previewVideo, setPreviewVideo] = useState(null);

    // Get logged in user on component mount
    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem('user'));
        if (loggedInUser) {
            setCurrentUser(loggedInUser);
            setFormData(prevData => ({
                ...prevData,
                user_id: loggedInUser.user_id
            }));
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        
        if (name === 'project_img') {
            setProjectImg(files[0]);
            // Create preview URL for image
            if (files[0]) {
                setPreviewImg(URL.createObjectURL(files[0]));
            } else {
                setPreviewImg(null);
            }
        } else if (name === 'project_video') {
            setProjectVideo(files[0]);
            // Create preview URL for video
            if (files[0]) {
                setPreviewVideo(URL.createObjectURL(files[0]));
            } else {
                setPreviewVideo(null);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });

        try {
            // Create FormData object for handling file uploads
            const submitFormData = new FormData();
            
            // Add all form fields to FormData
            Object.keys(formData).forEach(key => {
                submitFormData.append(key, formData[key]);
            });
            
            // Add files if they exist
            if (projectImg) {
                submitFormData.append('project_img', projectImg);
            }
            
            if (projectVideo) {
                submitFormData.append('project_video', projectVideo);
            }

            const response = await axios.post('/api/projects', submitFormData, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                }
            });

            setMessage({
                text: 'Project submitted successfully!',
                type: 'success'
            });

            setFormData({
                user_id: currentUser?.user_id || '',
                title: '',
                funding_goal: '',
                status: 'pending',
                project_type: '',
                project_des: '',
                project_location: '',
                reserve_price: '',
                categories: '',
                auction_start_date: '',
                auction_end_date: ''
            });
            
            // Clear file states and previews
            setProjectImg(null);
            setProjectVideo(null);
            setPreviewImg(null);
            setPreviewVideo(null);

            console.log('Project submitted:', response.data);
        } catch (error) {
            setMessage({
                text: error.response?.data?.message || 'Error submitting project!',
                type: 'error'
            });
            console.error('Submission error:', error.response?.data);
        }
    };

    // Clean up object URLs when component unmounts
    useEffect(() => {
        return () => {
            if (previewImg) URL.revokeObjectURL(previewImg);
            if (previewVideo) URL.revokeObjectURL(previewVideo);
        };
    }, [previewImg, previewVideo]);

    // Redirect to login if no user is logged in
    if (!currentUser) {
        return (
            <div className="w-full max-w-2xl mx-auto p-6 text-center">
                <h2 className="text-xl mb-4">You must be logged in to submit a project</h2>
                <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded">
                    Go to Login
                </Link>
            </div>
        );
    }

    return (
        <>
            <Navbar2 />
            <div className="w-full max-w-2xl mx-auto p-6">
                <h2 className="text-2xl font-bold mb-6 text-center">Submit Your Project</h2>

                {message.text && (
                    <div className={`p-4 mb-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">
                            User ID:
                            <input
                                type="text"
                                name="user_id"
                                value={formData.user_id}
                                className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 p-2 cursor-not-allowed"
                                disabled />
                            <span className="text-xs text-gray-500">Automatically set to your user ID</span>
                        </label>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium">
                            Title:
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                                required />
                        </label>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium">
                            Funding Goal:
                            <input
                                type="number"
                                name="funding_goal"
                                value={formData.funding_goal}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                                required />
                        </label>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium">
                            Project Type:
                            <select
                                name="project_type"
                                value={formData.project_type}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                                required
                            >
                                <option value="">Select project type</option>
                                {projectTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium">
                            Status:
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                                required
                            >
                                {projectStatuses.map((status) => (
                                    <option key={status} value={status}>
                                        {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium">
                            Location:
                            <select
                                name="project_location"
                                value={formData.project_location}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                                required
                            >
                                <option value="">Select a location</option>
                                {projectLocations.map((location) => (
                                    <option key={location} value={location}>
                                        {location}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium">
                            Category:
                            <select
                                name="categories"
                                value={formData.categories}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                                required
                            >
                                <option value="">Select a category</option>
                                {projectCategories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium">
                            Description:
                            <textarea
                                name="project_des"
                                value={formData.project_des}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                                rows="4"
                                required />
                        </label>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium">
                            Project Image:
                            <input
                                type="file"
                                name="project_img"
                                onChange={handleFileChange}
                                accept="image/*"
                                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                                required />
                        </label>
                        {previewImg && (
                            <div className="mt-2">
                                <p className="text-sm text-gray-500 mb-1">Preview:</p>
                                <img src={previewImg} alt="Preview" className="max-h-32 rounded" />
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium">
                            Project Video (optional):
                            <input
                                type="file"
                                name="project_video"
                                onChange={handleFileChange}
                                accept="video/*"
                                className="mt-1 block w-full rounded-md border border-gray-300 p-2" />
                        </label>
                        {previewVideo && (
                            <div className="mt-2">
                                <p className="text-sm text-gray-500 mb-1">Preview:</p>
                                <video 
                                    src={previewVideo} 
                                    controls 
                                    className="max-h-32 rounded"
                                    style={{ maxWidth: '100%' }}
                                />
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium">
                            Reserve Price:
                            <input
                                type="number"
                                name="reserve_price"
                                value={formData.reserve_price}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                                required />
                        </label>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium">
                            Auction Start Date:
                            <input
                                type="date"
                                name="auction_start_date"
                                value={formData.auction_start_date}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                                required />
                        </label>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium">
                            Auction End Date:
                            <input
                                type="date"
                                name="auction_end_date"
                                value={formData.auction_end_date}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                                min={formData.auction_start_date} // Prevents selecting end date before start date
                                required />
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors"
                    >
                        Submit Project
                    </button>
                </form>
            </div>
        </>
    );
};

export default ProjectSubmitForm;