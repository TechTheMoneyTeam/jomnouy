import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

// Fake data generator
const generateFakeProjects = (count) => {
               return Array(count).fill().map((_, index) => ({
                              project_id: `project-${index + 1}`,
                              title: `Project ${index + 1}`,
                              project_img: null, // Will fallback to placeholder
                              user: {
                                             username: `user${index + 1}`,
                                             name: `User ${index + 1}`,
                                             full_name: `Full Name ${index + 1}`
                              },
                              created_at: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
                              funding_goal: Math.floor(Math.random() * 10000) + 1000
               }));
};
// Helper functions
const getDaysSinceCreation = (dateString) => {
               const createdDate = new Date(dateString);
               const currentDate = new Date();
               const diffTime = Math.abs(currentDate - createdDate);
               const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
               return diffDays;
};
const formatFunding = (amount) => {
               if (amount >= 1000) {
                              return `$${(amount / 1000).toFixed(1)}K`;
               }
               return `$${amount}`;
};

const ProjectGrid = () => {
               // Generate 12 fake projects (for 3 pages of 4 projects each)
               const allProjects = generateFakeProjects(12);

               // States for pagination and animation
               const [currentPage, setCurrentPage] = useState(1);
               const [isAnimating, setIsAnimating] = useState(false);
               const [animationDirection, setAnimationDirection] = useState('next');
               const [visibleProjects, setVisibleProjects] = useState([]);
               const [projects, setProjects] = useState([]);
               const [loading, setLoading] = useState(true);
               const [error, setError] = useState(null);
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
               const projectsPerPage = 4;
               // Calculate total pages
               const totalPages = Math.ceil(allProjects.length / projectsPerPage);
               // Update visible projects when current page changes
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
               useEffect(() => {
                              const indexOfLastProject = currentPage * projectsPerPage;
                              const indexOfFirstProject = indexOfLastProject - projectsPerPage;
                              setVisibleProjects(allProjects.slice(indexOfFirstProject, indexOfLastProject));
               }, [currentPage, allProjects]);

               // Navigation handlers
               const goToNextPage = () => {
                              if (currentPage < totalPages && !isAnimating) {
                                             setAnimationDirection('next');
                                             setIsAnimating(true);

                                             // Short delay to allow animation to start before changing page
                                             setTimeout(() => {
                                                            setCurrentPage(currentPage + 1);

                                                            // Allow time for the new page to render and start its entrance animation
                                                            setTimeout(() => {
                                                                           setIsAnimating(false);
                                                            }, 300);
                                             }, 200);
                              }
               };

               const goToPrevPage = () => {
                              if (currentPage > 1 && !isAnimating) {
                                             setAnimationDirection('prev');
                                             setIsAnimating(true);

                                             setTimeout(() => {
                                                            setCurrentPage(currentPage - 1);

                                                            setTimeout(() => {
                                                                           setIsAnimating(false);
                                                            }, 300);
                                             }, 200);
                              }
               };

               const goToPage = (pageNumber) => {
                              if (pageNumber !== currentPage && !isAnimating) {
                                             setAnimationDirection(pageNumber > currentPage ? 'next' : 'prev');
                                             setIsAnimating(true);

                                             setTimeout(() => {
                                                            setCurrentPage(pageNumber);

                                                            setTimeout(() => {
                                                                           setIsAnimating(false);
                                                            }, 300);
                                             }, 200);
                              }
               };

               return (
                              <div className="container mx-auto px-4 py-8">
                                             <h2 className="text-2xl font-bold mb-6">Featured Projects</h2>

                                             <div className="relative overflow-hidden">
                                                            {/* Projects container with grid layout and animation */}
                                                            <div
                                                                           className={`grid grid-cols-2 gap-6 py-2 transition-all duration-500 ease-in-out ${isAnimating ?
                                                                                          (animationDirection === 'next' ? 'opacity-0 -translate-x-8' : 'opacity-0 translate-x-8') :
                                                                                          'opacity-100 translate-x-0'
                                                                                          }`}
                                                            >
                                                                           {visibleProjects.map((project) => (
                                                                                          <a
                                                                                                         href={`/projects/${project.project_id}`}
                                                                                                         key={project.project_id}
                                                                                                         className="flex flex-col"
                                                                                          >
                                                                                                         <div className="rounded-sm overflow-hidden group relative mb-4 transition-shadow duration-300 hover:shadow-lg h-full border border-gray-200">
                                                                                                                        <img
                                                                                                                                       src="/api/placeholder/400/200"
                                                                                                                                       alt={project.title}
                                                                                                                                       className="w-full h-36 object-cover"
                                                                                                                        />
                                                                                                                        <div className="p-4">
                                                                                                                                       <div className="flex items-center mb-3">
                                                                                                                                                      <div className="profile-avatar">
                                                                                                                                                                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                                                                                                                                                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z" />
                                                                                                                                                                     </svg>
                                                                                                                                                      </div>
                                                                                                                                                      <div className="ml-1 flex flex-col flex-grow">
                                                                                                                                                                     <h3 className="font-medium text-md">{project.title}</h3>
                                                                                                                                                                     <div className="text-gray-500 text-xs">
                                                                                                                                                                                    {project.user?.username || project.user?.name || project.user?.full_name || "Unknown Creator"}
                                                                                                                                                                     </div>
                                                                                                                                                      </div>
                                                                                                                                                      <div className="flex justify-end">
                                                                                                                                                                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                                                                                                                                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
                                                                                                                                                                     </svg>
                                                                                                                                                      </div>
                                                                                                                                       </div>
                                                                                                                                       <div className="flex items-center text-sm text-gray-500 ml-2">
                                                                                                                                                      <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                                                                                                                     <Clock size={16} />
                                                                                                                                                                     <span>{getDaysSinceCreation(project.created_at)} days ago</span>
                                                                                                                                                                     <span>•</span>
                                                                                                                                                                     <span>{formatFunding(project.funding_goal)} Funded</span>
                                                                                                                                                      </div>
                                                                                                                                       </div>
                                                                                                                        </div>
                                                                                                         </div>
                                                                                          </a>
                                                                           ))}
                                                            </div>
                                             </div>
                                             {/* Pagination controls */}
                                             <div className="flex justify-center mt-8">
                                                            <div className="flex items-center space-x-2">
                                                                           <button
                                                                                          onClick={goToPrevPage}
                                                                                          className="bg-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 disabled:opacity-50 transition-all duration-300"
                                                                                          disabled={currentPage <= 1 || isAnimating}
                                                                           >
                                                                                          <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current text-gray-700">
                                                                                                         <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                                                                                          </svg>
                                                                           </button>

                                                                           {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                                                                                          <button
                                                                                                         key={pageNumber}
                                                                                                         onClick={() => goToPage(pageNumber)}
                                                                                                         className={`w-8 h-8 flex items-center justify-center rounded-full font-medium transition-all duration-300 ${currentPage === pageNumber
                                                                                                                        ? 'bg-orange-500 text-white scale-110'
                                                                                                                        : 'text-black hover:bg-gray-100'
                                                                                                                        }`}
                                                                                                         disabled={isAnimating}
                                                                                          >
                                                                                                         {pageNumber}
                                                                                          </button>
                                                                           ))}

                                                                           <button
                                                                                          onClick={goToNextPage}
                                                                                          className="bg-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 disabled:opacity-50 transition-all duration-300"
                                                                                          disabled={currentPage >= totalPages || isAnimating}
                                                                           >
                                                                                          <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current text-gray-700">
                                                                                                         <path d="M10.59 7.41L12 6l6 6-6 6-1.41-1.41L15.17 12z" />
                                                                                          </svg>
                                                                           </button>
                                                            </div>
                                             </div>
                              </div>
               );
};

export default ProjectGrid;