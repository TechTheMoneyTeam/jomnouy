import React from "react";
import { RxBookmark } from "react-icons/rx";
import { FaRegBookmark } from "react-icons/fa6";
import { FaRegClock } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';

import { PiShareFat } from "react-icons/pi";
const Card = ({ className, children }) => (
               <div className={`bg-white rounded-lg overflow-hidden ${className || ''}`}>
                              {children}
               </div>
);

const CardContent = ({ className, children }) => (
               <div className={`p-4 ${className || ''}`}>{children}</div>
);
const RelatedProjects = ({ projectRelated, loading }) => {

               const [favoriteProjects, setFavoriteProjects] = useState([]);

               const handleSaveToFavorites = async (projectId) => {
                              try {
                                             const userData = localStorage.getItem('user');
                                             if (!userData) return;
                                             const user = JSON.parse(userData);

                                             if (favoriteProjects.includes(projectId)) {
                                                            // Remove from favorites
                                                            await axios.delete(`/api/users/${user.user_id}/favorites/${projectId}`);
                                                            setFavoriteProjects((prev) => prev.filter((id) => id !== projectId));
                                             } else {
                                                            // Add to favorites
                                                            await axios.post(`/api/users/${user.user_id}/favorites`, { project_id: projectId });
                                                            setFavoriteProjects((prev) => [...prev, projectId]);
                                             }
                              } catch (error) {
                                             console.error('Error updating favorite projects:', error);
                              }
               };
               const fetchFavorites = async () => {
                              try {
                                             const userData = localStorage.getItem('user');
                                             if (!userData) return;
                                             const user = JSON.parse(userData);
                                             const response = await axios.get(`/api/users/${user.user_id}/favorites`);
                                             setFavoriteProjects(response.data.map((fav) => fav.project_id));
                              } catch (error) {
                                             console.error('Error fetching favorite projects:', error);
                              }
               };
               
               const formatFunding = (amount) => {
                              if (amount >= 1000000) {
                                             return `${(amount / 1000000).toFixed(1)}M`;
                              } else if (amount >= 1000) {
                                             return `${(amount / 1000).toFixed(1)}K`;
                              }
                              return amount;
               };

               const getDaysLeft = (endDate) => {
                              const today = new Date();
                              const end = new Date(endDate);
                              const timeDiff = end - today;
                              return Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
               };
               const handleCategoryClick = (category) => {
                              setActiveTab(category);

                              localStorage.setItem('activeCategory', category);

                              if (category === 'All') {
                                             navigate('/projectlist1');
                              } else {
                                             navigate(`/category/${category.toLowerCase()}`);
                              }
               };
               const category = projectRelated[0]?.categories || "all";
               return (
                              <div className="container mx-auto px-4 py-8 ">
                                             <div className="flex justify-between items-center">
                                                            <h2 className="text-xl font-semibold text-gray-800">Related Projects</h2>

                                                            <Link to={`/category/${encodeURIComponent(category)}`}>
                                                                           <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                                                                                          See more
                                                                           </button>
                                                            </Link>
                                             </div>
                                             <div className="cate-bar flex-1 overflow-x-auto scrollbar-hide mt-4">
                                                            <div className="flex gap-6 pl-2">
                                                                           {projectRelated.map((project, index) => (
                                                                                          <Link to={`/projects/${project.project_id}`} key={project.project_id}>
                                                                                                         <Card className="rounded-lg overflow-hidden group relative w-80 transform transition-transform hover:scale-105 mb-4 transition-shadow duration-300 h-full">
                                                                                                                        <img
                                                                                                                                       src={project.project_img ? `/storage/${project.project_img}` : "/api/placeholder/400/200"}
                                                                                                                                       alt={project.title}
                                                                                                                                       className="pro-image w-full h-48 object-cover"
                                                                                                                                       onError={(e) => {
                                                                                                                                                      e.target.src = "/api/placeholder/400/200";
                                                                                                                                       }}
                                                                                                                        />
                                                                                                                        <CardContent>
                                                                                                                                       <div className="flex items-center mb-3">
                                                                                                                                                      <div className="profile-avatar">
                                                                                                                                                                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                                                                                                                                                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z" />
                                                                                                                                                                     </svg>
                                                                                                                                                      </div>
                                                                                                                                                      <div className="ml-1 flex flex-col flex-grow">
                                                                                                                                                                     <h3 className="font-medium text-md">{project.title}</h3>
                                                                                                                                                                     <div className="text-gray-500 text-xs">
                                                                                                                                                                                    {project.user?.username || project.user?.name || project.user?.full_name || "Unknown Creator"}
                                                                                                                                                                     </div>
                                                                                                                                                      </div>
                                                                                                                                                      <div className="flex justify-end">
                                                                                                                                                                     <button
                                                                                                                                                                                    onClick={(e) => {
                                                                                                                                                                                                   e.preventDefault(); // Prevent navigation
                                                                                                                                                                                                   handleSaveToFavorites(project.project_id);
                                                                                                                                                                                    }}
                                                                                                                                                                                    className={`text-gray-500 hover:text-orange-500 ${favoriteProjects.includes(project.project_id) ? 'text-orange-500' : ''
                                                                                                                                                                                                   }`}
                                                                                                                                                                     >
                                                                                                                                                                                    <RxBookmark size={24} />
                                                                                                                                                                     </button>
                                                                                                                                                      </div>
                                                                                                                                       </div>
                                                                                                                                       <div className="flex items-center text-sm text-gray-500 mb-2 ml-2">
                                                                                                                                                      <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                                                                                                                     <Clock size={16} />
                                                                                                                                                                     <span>{getDaysLeft(project.auction_end_date)} days ago</span>
                                                                                                                                                                     <span>•</span>
                                                                                                                                                                     <span>{formatFunding(project.funding_goal)} Funded</span>
                                                                                                                                                      </div>
                                                                                                                                       </div>
                                                                                                                                       {/* Hidden description, shown on hover */}
                                                                                                                                       <div className="opacity-0 max-h-0 overflow-hidden group-hover:opacity-100 group-hover:max-h-[150px] transition-all duration-300">
                                                                                                                                                      <p className="text-xs text-black/80 font-normal">{project.project_des}</p>
                                                                                                                                                      <div className="flex flex-wrap gap-2 mt-2">
                                                                                                                                                                     <button className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 text-xs bg-white hover:bg-gray-100 transition-all duration-300">
                                                                                                                                                                                    {project.project_location}
                                                                                                                                                                     </button>
                                                                                                                                                                     <button className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 text-xs bg-white hover:bg-gray-100 transition-all duration-300">
                                                                                                                                                                                    {project.categories}
                                                                                                                                                                     </button>

                                                                                                                                                      </div>
                                                                                                                                       </div>
                                                                                                                        </CardContent>
                                                                                                         </Card>
                                                                                          </Link>
                                                                           ))}
                                                            </div>
                                             </div>
                              </div>
               );
}; export default RelatedProjects;
