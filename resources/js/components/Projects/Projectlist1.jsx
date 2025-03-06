import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import '../Navbar/Navbar.css';

const Card = ({ className, children }) => (
  <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className || ''}`}>
    {children}
  </div>
);

const CardContent = ({ className, children }) => (
  <div className={`p-4 ${className || ''}`}>{children}</div>
);

const ProjectListing = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProjectType, setSelectedProjectType] = useState('All');
  const [categories] = useState([
    'All', 'Music', 'Sport', 'Technologies', 'Art', 'Fashions',
    'Games', 'Theater', 'Publishing', 'Design',
    'Food & Beverage', 'Health & Fitness', 'Education', 'Photograph'
  ]);
  const projectTypes = ['All', 'Start-up Project', 'Existing Project', 'Archive'];

  const fetchProjects = async () => {
    try {
      const response = await axios.get('/api/projects');
      setProjects(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchProjects();
    }, 30000); 

    return () => clearInterval(interval);
  }, []);

  const formatFunding = (amount) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K`;
    }
    return amount;
  };

  // Add this function to calculate days remaining
  const getDaysRemaining = (endDate) => {
    if (!endDate) return 0;
    
    try {
      const end = new Date(endDate);
      const now = new Date();
      if (isNaN(end.getTime())) return 0;
      if (now > end) return 0;
      
      const diffTime = end - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    } catch (error) {
      console.error("Error calculating days remaining:", error);
      return 0;
    }
  };

  const isProjectEnded = (endDate) => {
    return getDaysRemaining(endDate) === 0;
  };

  const getProjectTypeImage = (projectType) => {
    if (projectType === 'Existing Project') {
      return 'img/e.png';
    } else if (projectType === 'Start-up Project') {
      return 'img/s.png';
    }
    return null;
  };

  const filteredProjects = projects.filter((project) => {
    const isEnded = isProjectEnded(project.auction_end_date);
    
    // For Archive filter - show only ended projects
    if (selectedProjectType === 'Archive') {
      return isEnded;
    }
    
    // For All filter - show only active projects
    if (selectedProjectType === 'All') {
      return !isEnded && (selectedCategory === 'All' || project.project_type === selectedCategory);
    }
    
    // For other filters
    const matchesCategory = selectedCategory === 'All' || project.project_type === selectedCategory;
    const matchesType = project.project_type === selectedProjectType;
    return !isEnded && matchesCategory && matchesType;
  });

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        {error}
        <button
          onClick={fetchProjects}
          className="ml-4 px-4 py-2 bg-orange-500 text-white rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4" style={{ margin: '20px 200px 0px 200px' }}>
        <div className="py-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">
                Explore <span style={{ color: '#F07900' }}> {filteredProjects.length} Projects</span>
              </h2>
              {loading && (
                <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
              )}
            </div>
          </div>
          <div className="flex gap-4 mb-6">
          {projectTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedProjectType(type)}
              className={`px-4 py-2 rounded transition-colors duration-200 border-gray-200 font-medium`}
              style={{
                color: selectedProjectType === type ? '#F07900' : '#4B5563',
                backgroundColor: 'transparent',
                boxShadow: 'none',
                borderColor: selectedProjectType === type ? '#F07900' : '#D1D5DB'
              }}
            >
              {type}
            </button>
          ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {filteredProjects.map((project, index) => {
              const daysRemaining = getDaysRemaining(project.auction_end_date);
              const isEnded = daysRemaining === 0;
              const projectTypeImage = getProjectTypeImage(project.project_type);
              
              return (
                <Link 
                  to={`/projects/${project.project_id}`} 
                  key={project.project_id}
                  className="block"
                >
                  <Card 
                    className={`transform transition-transform hover:scale-105 h-full ${
                      index < 3 ? "mt-4" : ""
                    }`}
                  >
                    <img
                      src={project.project_img_url || project.project_img || "/api/placeholder/400/200"}
                      alt={project.title}
                      className="project-card1"
                      onError={(e) => {
                        e.target.src = "/api/placeholder/400/200";
                      }}
                    />
                    <CardContent>
                      <div className="flex items-center gap-2 mb-2">
                        {projectTypeImage && (
                          <img 
                            src={projectTypeImage} 
                            alt={project.project_type}
                            className="w-6 h-6" 
                          />
                        )}
                        <span className="font-medium">
                          {project.title}
                          {isEnded && <span className="ml-2 text-red-500 font-medium">(Ended)</span>}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                       By: {project.user?.username || 'Unknown User'}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock size={16} />
                        <span>{daysRemaining} days remaining</span>
                        <span>•</span>
                        <span>{formatFunding(project.funding_goal)}$ Needed Fund</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          {filteredProjects.length === 0 && !loading && (
            <div className="text-center py-12 text-gray-500">
              No projects found in the selected category
            </div>
          )}

          {loading && projects.length === 0 && (
            <div className="flex justify-center items-center py-12">
              <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProjectListing;