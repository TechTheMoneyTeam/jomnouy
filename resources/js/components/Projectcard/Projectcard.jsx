import React from 'react';
import './ProjectCard.css';

const ProjectCard = ({ project }) => {
  return (
    <div className="project-card">
      <img src={project.image} alt={project.title} className="project-image" />
      <div className="project-content">
        <h3 className="project-title">{project.title}</h3>
        <p className="project-author">{project.author}</p>
        <div className="project-metrics">
          <span className="project-days">{project.daysLeft} days left</span>
          <span className="project-funded">{project.funded}% Funded</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;