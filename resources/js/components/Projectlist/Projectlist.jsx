import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProjectList = () => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get('/api/projects');
                setProjects(response.data);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        fetchProjects();
    }, []);

    return (
        <div>
            <h1>Projects</h1>
            <ul>
                {projects.map(project => (
                    <li key={project.id}>
                        <h2>{project.title}</h2>
                        <p>Funding Goal: ${project.funding_goal}</p>
                        <p>Created by: {project.user.profile.first_name} {project.user.profile.last_name}</p>
                        <h3>Comments:</h3>
                        <ul>
                            {project.comments.map(comment => (
                                <li key={comment.id}>{comment.description}</li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProjectList;