import React, { useState } from 'react';
import axios from 'axios';
import './Projectsubmit.css';

const ProjectSubmitForm = () => {
    const [formData, setFormData] = useState({
        project_id: '',
        user_id: '',  // Set this manually or leave it empty
        title: '',
        funding_goal: '',
        status: '',
        project_type: '',
        project_des: '',
        project_img: '',
        reserve_price: '',
        project_categoryId: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/projects', formData, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            console.log('Project submitted:', response.data);
        } catch (error) {
            console.error('There was an error submitting the project!', error.response);
        }
    };

    return (
        <div className="project-submit-form">
            <h2>Submit Your Project</h2>
            <form onSubmit={handleSubmit}>
            <label>
                    User ID:
                    <input
                        type="text"
                        name="user_id"
                        value={formData.user__id}
                        onChange={handleChange}
                        placeholder="User ID"
                  
                    />
                </label>
                <label>
                    Project ID:
                    <input
                        type="text"
                        name="project_id"
                        value={formData.project_id}
                        onChange={handleChange}
                        placeholder="Project ID"
                        required
                    />
                </label>
                <label>
                    Title:
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Funding Goal:
                    <input
                        type="number"
                        name="funding_goal"
                        value={formData.funding_goal}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Status:
                    <input
                        type="text"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Project Type:
                    <input
                        type="text"
                        name="project_type"
                        value={formData.project_type}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Description:
                    <textarea
                        name="project_des"
                        value={formData.project_des}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Project Image URL:
                    <input
                        type="text"
                        name="project_img"
                        value={formData.project_img}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Reserve Price:
                    <input
                        type="number"
                        name="reserve_price"
                        value={formData.reserve_price}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Category ID:
                    <input
                        type="number"
                        name="project_categoryId"
                        value={formData.project_categoryId}
                        onChange={handleChange}
                    />
                </label>
                <button type="submit">Submit Project</button>
            </form>
        </div>
    );
};

export default ProjectSubmitForm;
