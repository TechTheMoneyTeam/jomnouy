import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import '../Navbar/Navbar.css';

const Card = ({ className, children }) => (
  <div className={`bg-white rounded-lg overflow-hidden ${className || ''}`}>
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
  const [categories] = useState([
    'Music', 'Sport', 'Technologies', 'Art', 'Fashions',
    'Games', 'Theater', 'Publishing', 'Design',
    'Food & Beverage', 'Health & Fitness', 'Education', 'Photograph'
  ]);

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

  // Initial fetch
  useEffect(() => {
    fetchProjects();
  }, []);

  // Set up polling for live updates every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchProjects();
    }, 30000); // 30 seconds

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

  const getDaysSinceCreation = (createdAt) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

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
      <Navbar className="Navbar position:fixed" />

      <div className="max-w-7xl mx-auto px-4" style={{ margin: '20px 200px 0px 200px' }}>
        {/* Header */}
        <div className="py-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">
                Explore <span className="text-red"> {projects.length} Projects</span>
              </h2>
              {loading && (
                <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <Link to={`/projects/${project.project_id}`} key={project.project_id}>


                <Card
                  className={`transform transition-transform hover:scale-105 ${index < 3 ? "mt-6" : ""}`}
                >
                  <img
                    src={project.project_img || "/api/placeholder/400/200"}
                    alt={project.title} 
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = "/api/placeholder/400/200";
                    }}
                  />
                  <CardContent>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-gray-200 rounded-full" />
                      <span className="font-medium">{project.title}</span>
                      </div>
                    <div className="text-sm text-gray-600 mb-2">
                      Type: {project.project_type}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock size={16} />
                      <span>{getDaysSinceCreation(project.created_at)} days ago</span>
                      <span>•</span>
                      <span>{formatFunding(project.funding_goal)} Funded</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {projects.length === 0 && !loading && (
            <div className="text-center py-12 text-gray-500">No projects found</div>
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
