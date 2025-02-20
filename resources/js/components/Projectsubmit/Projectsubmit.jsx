import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const ProjectSubmitForm = () => {
    const [formData, setFormData] = useState({
        user_id: '',
        title: '',
        funding_goal: '',
        status: 'pending',
        project_type: '',
        project_des: '',
        project_img: '',
        reserve_price: '',
        project_categoryId: ''
    });

    const [message, setMessage] = useState({ text: '', type: '' });
    const [currentUser, setCurrentUser] = useState(null);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });

        try {
            const response = await axios.post('/api/projects', formData, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });

            setMessage({
                text: 'Project submitted successfully!',
                type: 'success'
            });

            // Clear form except user_id
            setFormData({
                user_id: currentUser?.user_id || '',
                title: '',
                funding_goal: '',
                status: 'pending',
                project_type: '',
                project_des: '',
                project_img: '',
                reserve_price: '',
                project_categoryId: ''
            });

            console.log('Project submitted:', response.data);
        } catch (error) {
            setMessage({
                text: error.response?.data?.message || 'Error submitting project!',
                type: 'error'
            });
            console.error('Submission error:', error.response?.data);
        }
    };

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
        <div className="w-full max-w-2xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6 text-center">Submit Your Project</h2>
            
            {message.text && (
                <div className={`p-4 mb-4 rounded ${
                    message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
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
                            disabled
                        />
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
                            required
                        />
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
                            required
                        />
                    </label>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium">
                        Project Type:
                        <input
                            type="text"
                            name="project_type"
                            value={formData.project_type}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                            required
                        />
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
                            required
                        />
                    </label>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium">
                        Project Image URL:
                        <input
                            type="text"
                            name="project_img"
                            value={formData.project_img}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                        />
                    </label>
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
                            required
                        />
                    </label>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium">
                        Category ID:
                        <input
                            type="number"
                            name="project_categoryId"
                            value={formData.project_categoryId}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                            required
                        />
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
    );
};

export default ProjectSubmitForm;