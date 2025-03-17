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
const ProjectNearYou = () => {
               const [geoInfor, setGeoInfor] = useState({});
               const [ipAddress, setIpAddress] = useState('');
               const [categoriesOpen, setCategoriesOpen] = useState(false);
               const [selectedCategory, setSelectedCategory] = useState('All categories');

               const [endingOpen, setEndingOpen] = useState(false);
               const [selectedEnding, setSelectedEnding] = useState('Ending soon');

               const categories = ['All categories', 'Technology', 'Art', 'Music', 'Games', 'Design'];
               const endingOptions = ['Ending soon', 'Newest', 'Most funded', 'Trending'];
               const [typeProjectOpen, setTypeProjectOpen] = useState(false);
               const [selectedTypeProject, setSelectedTypeProject] = useState("All projects type");
               const typeProject = ["All projects type","Existing Project", "Start-up Project","General"
               ];

               // Toggle functions
               const toggleCategories = () => setCategoriesOpen(!categoriesOpen);
               const toggleTypeProject = () => setTypeProjectOpen(!typeProjectOpen);

               // Selection functions
              

               const selectTypeProject = (type) => {
                              setSelectedTypeProject(type);
                              setTypeProjectOpen(false);
               };
               const toggleEnding = () => setEndingOpen(!endingOpen);

               const selectCategory = (category) => {
                              setSelectedCategory(category);
                              setCategoriesOpen(false);
               };

               const selectEnding = (option) => {
                              setSelectedEnding(option);
                              setEndingOpen(false);
               };

               useEffect(() => {
                              getUserIP();
               }, []);

               const getUserIP = async () => {
                              try {

                                             const response = await fetch('https://api.ipify.org?format=json');
                                             const data = await response.json();
                                             setIpAddress(data.ip);
                                             // Call fetchIpInfo after the IP address is set
                                             fetchIpInfo(data.ip);
                              } catch (error) {
                                             console.error("Failed to fetch IP address", error);
                              }
               };

               const fetchIpInfo = async (ip) => {
                              try {
                                             const response = await fetch(`https://ipapi.co/${ip}/json/`);
                                             const data = await response.json();
                                             setGeoInfor(data);
                              } catch (error) {
                                             console.error("Failed to fetch geolocation data", error);
                              }
               };

               if (!ipAddress || !geoInfor.city) {
                              return <div>Loading...</div>;
               }
               
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
                                                                                                                        className="flex items-center justify-between w-full md:w-40 bg-white border border-gray-300 rounded px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
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
                                                                                          <span className="text-gray-800 font-medium text-sm md:text-base">Project from</span>

                                                                                          <div className="relative flex flex-wrap">
                                                                                                         {geoInfor && (
                                                                                                                        <>
                                                                                                                                       <button
                                                                                                                                                      onClick={toggleEnding}
                                                                                                                                                      className="flex items-center justify-between w-full md:w-40 bg-white border border-gray-300 rounded px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                                                                                                                       >
                                                                                                                                                      <span>{geoInfor.city}, {geoInfor.country_name}</span>
                                                                                                                                                      <ChevronDown size={16} className="ml-2" />
                                                                                                                                       </button>
                                                                                                                                       {/* <p>Country: {geoInfor.country_name}</p>
      <p>City: {geoInfor.city}</p> */}
                                                                                                                        </>
                                                                                                         )}
                                                                                          </div>

                                                                           </div>
                                                            </div>
                                                            <div>
                                                                           <h1>User Location</h1>
                                                                           <p>IP: {ipAddress}</p>
                                                                           {/* Display the geographical info if available */}
                                                                           {geoInfor && (
                                                                                          <>
                                                                                                         <p>Country: {geoInfor.country_name}</p>
                                                                                                         <p>City: {geoInfor.city}</p>
                                                                                          </>
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
                                             <Footer />
                              </>
               );
};

export default ProjectNearYou;
