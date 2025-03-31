import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { useState, useEffect } from "react";
import axios from "axios";
import { Clock } from 'lucide-react';
import { RxBookmark } from "react-icons/rx";
import { ChevronDown } from 'lucide-react';
import Footer1 from "../footer/footer1";
const Card = ({ className, children }) => (
               <div className={`bg-white rounded-lg overflow-hidden ${className || ''}`}>
                              {children}
               </div>
);

const CardContent = ({ className, children }) => (
               <div className={`p-4 ${className || ''}`}>{children}</div>
); 
const ProjectEndingSoon = () => {
               const [projects, setProjects] = useState([]);
               const [loading, setLoading] = useState(true);
               const [visibleCount, setVisibleCount] = useState(6); // Show first 18 projects
               const [error, setError] = useState(null);
               // Categories state
               const [categoriesOpen, setCategoriesOpen] = useState(false);
               const categories = ['All categories', 'Technology', 'Art', 'Design', 'Film', 'Music', 'Publishing',
               'Games', 'Food', 'Fashion', 'Crafts', 'Photography', 'Comics',
               'Illustration', 'Theater', 'Education', 'Health', 'Environment'];
               // Project type state
               const [typeProjectOpen, setTypeProjectOpen] = useState(false);
               const [selectedCategory, setSelectedCategory] = useState('All categories');
               const [selectedTypeProject, setSelectedTypeProject] = useState("All projects type");
               const typeProject = ["All projects type","Existing Project", "Start-up Project","General"
               ];
               // Toggle functions
               const toggleCategories = () => setCategoriesOpen(!categoriesOpen);
               const toggleTypeProject = () => setTypeProjectOpen(!typeProjectOpen);

               // Selection functions
               const selectCategory = (category) => {
                              setSelectedCategory(category);
                              setCategoriesOpen(false);
               };

               const selectTypeProject = (type) => {
                              setSelectedTypeProject(type);
                              setTypeProjectOpen(false);
               };
               const loadMore = () => {
                              setVisibleCount((prevCount) => prevCount + 8); // Load 18 more projects on each click
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

               // Fetch projects with filters from the Laravel backend
               useEffect(() => {
                              const fetchFilteredProjects = async () => {
                                             setLoading(true);
                                             try {
                                                            // Create query parameters
                                                            const params = new URLSearchParams();

                                                            // Apply category filter
                                                            if (selectedCategory !== "All categories") {
                                                                           params.append('category', selectedCategory);
                                                            }

                                                            // Apply project type filter only if it's not "All projects type"
                                                            if (selectedTypeProject !== "All projects type") {
                                                                           params.append('type', selectedTypeProject);
                                                            }

                                                            console.log('Fetching with filters:', Object.fromEntries(params.entries()));

                                                            // Make API call to Laravel backend
                                                            const response = await axios.get('/api/filtered-projects', { params });

                                                            console.log('Received data:', response.data);
                                                            setProjects(response.data);
                                                            setError(null);
                                             } catch (error) {
                                                            console.error("Error fetching projects:", error);
                                                            setError("Failed to load projects. Please try again.");
                                             } finally {
                                                            setLoading(false);
                                             }
                              };


                              fetchFilteredProjects();
               }, [selectedCategory, selectedTypeProject]);

               return (
                              <>
                                             <Navbar />
                                             <div className="max-w-7xl mx-auto px-4">
                                                            <div className="flex items-center justify-center mt-8">
                                                                           <div className="flex items-center gap-4">
                                                                                          <span className="text-gray-800 font-medium text-sm md:text-base">Show me</span>
                                                                                          <div className="relative">
                                                                                                         <button
                                                                                                                        onClick={toggleCategories}
                                                                                                                        className="flex items-center justify-between w-full md:w-40 bg-white border border-gray-300 rounded px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                                                                                         >
                                                                                                                        <span>{selectedCategory}</span>
                                                                                                                        <ChevronDown size={16} className="ml-2" />
                                                                                                         </button>

                                                                                                         {categoriesOpen && (
                                                                                                                        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200">
                                                                                                                                       <ul className="py-1 max-h-60 overflow-auto">
                                                                                                                                                      {categories.map((category) => (
                                                                                                                                                                     <li
                                                                                                                                                                                    key={category}
                                                                                                                                                                                    onClick={() => selectCategory(category)}
                                                                                                                                                                                    className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${selectedCategory === category ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                                                                                                                                                                     >
                                                                                                                                                                                    {category}
                                                                                                                                                                     </li>
                                                                                                                                                      ))}
                                                                                                                                       </ul>
                                                                                                                        </div>
                                                                                                         )}
                                                                                          </div>
                                                                           </div>


                                                                           <div className="flex flex-wrap items-center gap-4 ml-4">
                                                                                          <span className="text-gray-800 font-medium text-sm md:text-base">Sort by</span>
                                                                                          <div className="relative">
                                                                                                         <button
                                                                                                                        onClick={toggleTypeProject}
                                                                                                                        className="flex items-center justify-between w-full md:w-40 bg-white border border-gray-300 rounded px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 whitespace-nowrap overflow-hidden text-ellipsis"
                                                                                                         >
                                                                                                                        <span>{selectedTypeProject}</span>
                                                                                                                        <ChevronDown size={16} className="ml-2" />
                                                                                                         </button>

                                                                                                         {typeProjectOpen && (
                                                                                                                        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200">
                                                                                                                                       <ul className="py-1 max-h-60 overflow-auto">
                                                                                                                                                      {typeProject.map((option) => (
                                                                                                                                                                     <li
                                                                                                                                                                                    key={option}
                                                                                                                                                                                    onClick={() => selectTypeProject(option)}
                                                                                                                                                                                    className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${selectedTypeProject === option ? "bg-blue-50 text-blue-700" : "text-gray-700"}`}
                                                                                                                                                                     >
                                                                                                                                                                                    {option}
                                                                                                                                                                     </li>
                                                                                                                                                      ))}
                                                                                                                                       </ul>
                                                                                                                        </div>
                                                                                                         )}
                                                                                          </div>
                                                                           </div>
                                                                           <div className="flex items-center gap-4 ml-4">
                                                                                          <span className="text-gray-800 font-medium text-sm md:text-base">Project</span>

                                                                                          <div className="relative">
                                                                                                         <button
                                                                                                                        className="flex items-center justify-center w-full md:w-40 bg-white border border-gray-300 rounded px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                                                                                         >
                                                                                                                        <span>Ending soon</span>
                                                                                                         </button>


                                                                                          </div>
                                                                           </div>

                                                            </div>
                                                            <div className="py-8">
                                                                           <div className="flex justify-between items-center mb-6">
                                                                                          <div className="flex items-center gap-2">
                                                                                                         <h2 className="text-xl font-semibold">
                                                                                                                        Explore <span className="text-orange-500"> {projects.length} Projects</span>
                                                                                                         </h2>

                                                                                          </div>
                                                                           </div>
                                                                           {loading ? (
                                                                                          <div className="flex justify-center items-center py-12">
                                                                                                         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                                                                                          </div>
                                                                           ) : projects.length === 0 ? (
                                                                                          <div className="text-center py-12 text-gray-500">No projects found</div>
                                                                           ) : (
                                                                                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
                                                                                                         {/* Your existing project mapping code */}
                                                                                                         {projects.slice(0, visibleCount).map((project) => (
                                                                                                                        <div key={project.project_id} className="relative group">
                                                                                                                                       <Link to={`/projects/${project.project_id}`}>
                                                                                                                                                      <Card className="rounded-lg overflow-hidden relative h-auto mb-2 transition-all duration-300 hover:shadow-lg hover:scale-105 w-full">
                                                                                                                                                                     <div className="relative">
                                                                                                                                                                                    <img
                                                                                                                                                                                                   src={project.project_img ? `/storage/${project.project_img}` : "/api/placeholder/400/200"}
                                                                                                                                                                                                   alt={project.title}
                                                                                                                                                                                                   className="pro-image w-full h-48 object-cover transition-transform duration-300 group-hover:h-56"
                                                                                                                                                                                                   onError={(e) => {
                                                                                                                                                                                                                  e.target.src = "/api/placeholder/400/200";
                                                                                                                                                                                                   }}
                                                                                                                                                                                    />
                                                                                                                                                                     </div>
                                                                                                                                                                     <CardContent className="p-4 transition-all duration-300">
                                                                                                                                                                                    <div className="flex items-center mb-3">
                                                                                                                                                                                                   <div className="profile-avatar">
                                                                                                                                                                                                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                                                                                                                                                                                                                 <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z" />
                                                                                                                                                                                                                  </svg>
                                                                                                                                                                                                   </div>
                                                                                                                                                                                                   <div className="ml-2 flex flex-col flex-grow">
                                                                                                                                                                                                                  <h3 className="font-medium text-md">{project.title}</h3>
                                                                                                                                                                                                                  <div className="text-gray-500 text-xs">
                                                                                                                                                                                                                                 {project.user?.username || project.user?.name || project.user?.full_name || "Unknown Creator"}
                                                                                                                                                                                                                  </div>
                                                                                                                                                                                                   </div>
                                                                                                                                                                                                   <div className="flex justify-end">
                                                                                                                                                                                                                  <RxBookmark />
                                                                                                                                                                                                   </div>
                                                                                                                                                                                    </div>
                                                                                                                                                                                    <div className="flex items-center text-sm text-gray-500 mb-2">
                                                                                                                                                                                                   <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                                                                                                                                                                                                                  <Clock size={16} />
                                                                                                                                                                                                                  <span>{getDaysLeft(project.auction_end_date)} days ago</span>
                                                                                                                                                                                                                  <span>•</span>
                                                                                                                                                                                                                  <span>{formatFunding(project.funding_goal)} Funded</span>
                                                                                                                                                                                                   </div>
                                                                                                                                                                                    </div>

                                                                                                                                                                                    {/* Hidden description, shown on hover */}
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
                                                                                                                        </div>
                                                                                                         ))}
                                                                                          </div>
                                                                           )}

                                                                           {visibleCount < projects.length && visibleCount !== projects.length && (
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

                                                            {/* <div className="py-8">
                                                                           <div className="flex justify-between items-center mb-6">
                                                                                          <div className="flex items-center gap-2">
                                                                                                         <h2 className="text-xl font-semibold">
                                                                                                                        Explore <span className="text-orange-500">
                                                                                                                                       {loading ? "..." : projects.length}
                                                                                                                        </span> projects
                                                                                                         </h2>
                                                                                          </div>
                                                                           </div>
                                                            </div> */}
                                                            {/*  */}
                                             </div>
                                             <Footer1 />
                              </>
               );
};

export default ProjectEndingSoon;
