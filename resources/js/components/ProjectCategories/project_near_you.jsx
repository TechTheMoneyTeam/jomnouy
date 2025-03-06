import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import { IoMdArrowDropdown } from "react-icons/io";
const Card = ({ className, children }) => (
               <div className={`bg-white rounded-lg overflow-hidden ${className || ''}`}>
                              {children}
               </div>
);

const CardContent = ({ className, children }) => (
               <div className={`p-4 ${className || ''}`}>{children}</div>
);
const FilterDropdown = () => {
               const [projects, setProjects] = useState([]);
               const [loading, setLoading] = useState(true);
               const [error, setError] = useState(null);
               const [categoryOpen, setCategoryOpen] = useState(false);
               const [projectOpen, setProjectOpen] = useState(false);

               const [selectedCategory, setSelectedCategory] = useState('All categories');
               const [selectedProject, setSelectedProject] = useState('Ending soon');

               const categories = ['All categories', 'Design', 'Development', 'Marketing', 'Product'];

               const toggleCategoryDropdown = () => setCategoryOpen(!categoryOpen);
               const toggleProjectDropdown = () => setProjectOpen(!projectOpen);

               const selectCategory = (category) => {
                              setSelectedCategory(category);
                              setCategoryOpen(false);
               };

               const selectProject = (project) => {
                              setSelectedProject(project);
                              setProjectOpen(false);
               };
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

               return (
                              <>
                              <Navbar />
                                             <div className="max-w-7xl mx-auto" style={{ margin: '20px 200px 0px 200px' }}>
                                                            <div className="flex justify-end items-center  py-2 bg-white">
                                                                           <div className="flex items-center gap-2">
                                                                                          <span className="text-gray-700 text-sm font-medium">Show me</span>
                                                                                          {/* Categories dropdown */}
                                                                                          <div className="relative">
                                                                                                         <button
                                                                                                                        className="flex items-center justify-between w-44 px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 text-sm"
                                                                                                                        onClick={toggleCategoryDropdown}
                                                                                                         >
                                                                                                                        <span>{selectedCategory}</span>
                                                                                                                        <IoMdArrowDropdown  className="h-4 w-4 text-gray-500" />
                                                                                                         </button>

                                                                                                         {categoryOpen && (
                                                                                                                        <div className="absolute top-full left-0 right-0 mt-1 border border-gray-200 rounded-md bg-white shadow-lg z-10">
                                                                                                                                       {categories.map((category) => (
                                                                                                                                                      <div
                                                                                                                                                                     key={category}
                                                                                                                                                                     className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                                                                                                                                     onClick={() => selectCategory(category)}
                                                                                                                                                      >
                                                                                                                                                                     {category}
                                                                                                                                                      </div>
                                                                                                                                       ))}
                                                                                                                        </div>
                                                                                                         )}
                                                                                          </div>
                                                                                          {/* Project type label */}
                                                                                          <span className="text-gray-700 text-sm font-medium ml-4">Project</span>
                                                                                          {/* Project type dropdown */}
                                                                                          <div className="relative">
                                                                                                         <button
                                                                                                                        className="flex items-center justify-between w-44 px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 text-sm"
                                                                                                                        onClick={toggleProjectDropdown}
                                                                                                         >
                                                                                                                        <span>{selectedProject}</span>
                                                                                                                        <IoMdArrowDropdown className="h-4 w-4 text-gray-500" />

                                                                                                         </button>
                                                                                                         {projectOpen && (
                                                                                                                        <div className="absolute top-full left-0 right-0 mt-1 border border-gray-200 rounded-md bg-white shadow-lg z-10">
                                                                                                                                       {/* {project.map((projectss) => (
                                                                                                                                                      <div
                                                                                                                                                                     key={projectss}
                                                                                                                                                                     className="px-4 py-2 hover:bg-gray-100  cursor-pointer"
                                                                                                                                                                     onClick={() => selectProject(projectss)}
                                                                                                                                                      >
                                                                                                                                                                     {projectss}
                                                                                                                                                      </div>
                                                                                                                                       ))} */}
                                                                                                                        </div>
                                                                                                         )}
                                                                                          </div>
                                                                           </div>
                                                            </div>
                                                            <div className="py-6">
                                                                           <div className="flex justify-between items-center mb-6">
                                                                                          <div className="flex items-center gap-2">
                                                                                                         <h2 className="text-xl font-semibold">
                                                                                                                        Explore <span className="text-orange-500"> {projects.length} Projects</span>
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

export default FilterDropdown;