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
                                                                                                                                       <div className="flex items-center gap-2 mb-2">
                                                                                                                                                      <div className="w-6 h-6 bg-gray-200 rounded-full" />
                                                                                                                                                      <span className="font-medium">{project.title}</span>
                                                                                                                                       </div>
                                                                                                                                       <div className="text-sm text-gray-600 mb-2">
                                                                                                                                                      Type: {project.project_type}
                                                                                                                                       </div>
                                                                                                                                       <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                                                                                                      <Clock size={16} />
                                                                                                                                                      <span>{getDaysLeft(project.auction_end_date)} days ago</span>
                                                                                                                                                      <span>•</span>
                                                                                                                                                      <span>{formatFunding(project.funding_goal)} Funded</span>
                                                                                                                                       </div>
                                                                                                                                       <div className="opacity-0 max-h-0 overflow-hidden group-hover:opacity-100 group-hover:max-h-[100px] transition-all duration-300">
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