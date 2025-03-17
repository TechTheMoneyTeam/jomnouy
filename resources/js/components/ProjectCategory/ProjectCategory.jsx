import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { useState, useEffect } from "react";
import axios from "axios";
import { Clock } from 'lucide-react';
import { RxBookmark } from "react-icons/rx";
import { ChevronDown } from 'lucide-react';
import Footer from "../footer/footer";
const Card = ({ className, children }) => (
               <div className={`bg-white rounded-lg overflow-hidden ${className || ''}`}>
                              {children}
               </div>
);

const CardContent = ({ className, children }) => (
               <div className={`p-4 ${className || ''}`}>{children}</div>
);
const CategoryPage = () => {
               const [projects, setProjects] = useState([]);
               const [loading, setLoading] = useState(true);
               const { categoryName } = useParams(); // Get category from URL
               const navigate = useNavigate();
               const [visibleCount, setVisibleCount] = useState(6); // Show first 18 projects
               const loadMore = () => {
                              setVisibleCount((prevCount) => prevCount + 4); // Load 18 more projects on each click
               };
               useEffect(() => {
                              setProjects([]);
                              setLoading(true);

                              const fetchProjects = async () => {
                                             try {
                                                            if (!categoryName) {
                                                                           throw new Error("Category name is undefined");
                                                            }

                                                            const response = await axios.get(`http://127.0.0.1:8000/api/category/${categoryName}`);
                                                            setProjects(response.data);
                                             } catch (error) {
                                                            console.error("Error fetching projects:", error);
                                                            setProjects([]);
                                             } finally {
                                                            setLoading(false);
                                             }
                              };

                              if (categoryName) {
                                             // Update localStorage to keep Navbar in sync
                                             localStorage.setItem('activeCategory', categoryName.charAt(0).toUpperCase() + categoryName.slice(1));
                                             fetchProjects();
                              } else {
                                             navigate('/'); // Redirect to home if no category
                                             setLoading(false);
                              }
               }, [categoryName, navigate]);
               const getDaysLeft = (endDate) => {
                              const today = new Date();
                              const end = new Date(endDate);
                              const timeDiff = end - today;
                              return Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
               };
               const formatFunding = (amount) => {
                              if (amount >= 1000000) {
                                             return `${(amount / 1000000).toFixed(1)}M`;
                              } else if (amount >= 1000) {
                                             return `${(amount / 1000).toFixed(1)}K`;
                              }
                              return amount;
               };
               return (
                              <>
                                             <Navbar />
                                             <div className="max-w-7xl mx-auto px-4">
                                                            <div className="">
                                                                           <div className="flex justify-between items-center mb-6">
                                                                                          <div className="flex items-center gap-2">
                                                                                                         <h2 className="text-xl font-semibold">
                                                                                                                        Explore <span className="text-orange-500">
                                                                                                                                       {loading ? "..." : projects.length}
                                                                                                                        </span> projects
                                                                                                         </h2>
                                                                                          </div>
                                                                           </div>
                                                            </div>
                                                            <div className="pt-2">
                                                                           {loading ? (
                                                                                          <p>Loading projects...</p>
                                                                           ) : projects.length === 0 ? (
                                                                                          <p>No projects in {categoryName} category yet!</p>
                                                                           ) : (
                                                                                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                                                                         {projects.map((project, index) => (
                                                                                                                        <Link to={`/projects/${project.project_id}`} key={project.project_id}>
                                                                                                                                       <Card
                                                                                                                                                      className={`rounded-lg overflow-hidden group relative mb-4 transition-shadow duration-300 hover:shadow-lg`}
                                                                                                                                       >
                                                                                                                                                      <img
                                                                                                                                                                     src={project.project_img ? `/storage/${project.project_img}` : "/api/placeholder/400/200"}
                                                                                                                                                                     alt={project.title}
                                                                                                                                                                     className="pro-image"
                                                                                                                                                                     onError={(e) => {
                                                                                                                                                                                    e.target.src = "/api/placeholder/400/200";
                                                                                                                                                                     }}
                                                                                                                                                      />
                                                                                                                                                      <CardContent>
                                                                                                                                                                     <div className="flex items-center mb-3">
                                                                                                                                                                                    <div className="profile-avatar">
                                                                                                                                                                                                   <svg
                                                                                                                                                                                                                  xmlns="http://www.w3.org/2000/svg"
                                                                                                                                                                                                                  viewBox="0 0 24 24"
                                                                                                                                                                                                                  fill="currentColor"
                                                                                                                                                                                                                  className="w-5 h-5"
                                                                                                                                                                                                   >
                                                                                                                                                                                                                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z" />
                                                                                                                                                                                                   </svg>
                                                                                                                                                                                    </div>
                                                                                                                                                                                    <div className="ml-1 flex flex-col flex-grow">
                                                                                                                                                                                                   <h3 className="font-medium text-md">{project.title}</h3>

                                                                                                                                                                                                   <div className="text-gray-500 text-xs">
                                                                                                                                                                                                                  {project.user?.username || project.user?.name || project.user?.full_name || 'Unknown Creator'}
                                                                                                                                                                                                   </div>
                                                                                                                                                                                    </div>
                                                                                                                                                                                    <div className="flex justify-end">
                                                                                                                                                                                                   <RxBookmark />
                                                                                                                                                                                    </div>
                                                                                                                                                                     </div>
                                                                                                                                                                     <div className="flex items-center text-sm text-gray-500 mb-2 ml-2">
                                                                                                                                                                                    <div className="flex items-center mr-4">
                                                                                                                                                                                                   <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                                                                                                                                                                  <Clock size={16} />
                                                                                                                                                                                                                  <span>{getDaysLeft(project.auction_end_date)} days left</span>
                                                                                                                                                                                                                  <span>•</span>
                                                                                                                                                                                                                  <span>{formatFunding(project.funding_goal)} Funded</span>
                                                                                                                                                                                                   </div>
                                                                                                                                                                                    </div>
                                                                                                                                                                     </div>
                                                                                                                                                                     <div className="m-2 description text-sm text-black font-normal opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                                                                                                                                                    {project.project_des}
                                                                                                                                                                     </div>
                                                                                                                                                                     {/* <div className="flex items-center gap-2 mb-2">
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
                                                                                                                                                      </div> */}
                                                                                                                                                      </CardContent>
                                                                                                                                       </Card>
                                                                                                                        </Link>
                                                                                                         ))}
                                                                                          </div>
                                                                           )}
                                                            </div>
                                                            {visibleCount < projects.length && visibleCount !== projects.length &&  (
                                                                           <div className="flex justify-center mt-6">
                                                                                          <button
                                                                                                         onClick={loadMore}
                                                                                                         className="px-4 py-2 bg-orange-500 text-white rounded-md shadow-md hover:bg-orange-500/80 transition"
                                                                                          >
                                                                                                         Load More
                                                                                          </button>
                                                                           </div>
                                                            )}
                                             </div>
                                             <Footer />
                              </>
               );
};

export default CategoryPage;
