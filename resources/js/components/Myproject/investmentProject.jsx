import React, { useEffect, useState } from 'react';
import axios from 'axios';

const InvestorProjects = () => {
               const [projects, setProjects] = useState([]);
               const [user_id, setUserId] = useState(null);  // Initialize as null
               const getStatusColor = (status) => {
                              switch (status) {
                                             case 'Open': return 'bg-green-500';
                                             case 'Pending': return 'bg-yellow-500';
                                             default: return 'bg-gray-500';
                              }
               };

               const getPrivacyIcon = (privacy) => {
                              return privacy === 'Private'
                                             ? 'text-red-500 border-red-500'
                                             : 'text-green-500 border-green-500';
               };
               useEffect(() => {
                              const userData = localStorage.getItem('user');
                              if (userData) {
                                             try {
                                                            const user = JSON.parse(userData);
                                                            setUserId(user.user_id);  // Assuming 'user_id' is in the user object
                                             } catch (error) {
                                                            console.error("Error parsing user data:", error);
                                             }
                              }
               }, []);

               useEffect(() => {
                              if (user_id) {
                                             const fetchProjects = async () => {
                                                            try {
                                                                           const response = await axios.get(`/api/investor/${user_id}/projects`);
                                                                           setProjects(response.data);
                                                            } catch (error) {
                                                                           console.error("Error fetching projects: ", error.response ? error.response.data : error.message);
                                                            }
                                             };

                                             fetchProjects();
                              } else {
                                             console.log('No user_id found in localStorage');
                              }
               }, [user_id]);  // Only run when user_id changes
               
               return (
                            
                              < div className = "container mx-auto p-4 bg-white" >
                                             <div className="overflow-x-auto">
                                                            {
                                                                           projects.length > 0 ? (
                                                                                          projects.map(project => (
                                                                                                         <table className="w-full border-collapse">
                                                                                                                        <thead className="bg-gray-100">
                                                                                                                                       <tr>
                                                                                                                                                      <th className="p-3 text-left">Project Title</th>
                                                                                                                                                      <th className="p-3 text-left">Status</th>
                                                                                                                                                      <th className="p-3 text-left">Date</th>
                                                                                                                                                      <th className="p-3 text-left">Action</th>
                                                                                                                                       </tr>
                                                                                                                        </thead>
                                                                                                                        <tbody>
                                                                                                                                                      <tr
                                                                                                                                                                     // key={index}
                                                                                                                                                                     className="border-b hover:bg-gray-50 transition-colors"
                                                                                                                                                      >
                                                                                                                                                                     <td className="p-3">
                                                                                                                                                                                    <div className="flex items-center">
                                                                                                                                                                                    {/* <img
                                                                                                                                                                                                   src={project.project_img ? `/storage/${project.project_img}` : "/api/placeholder/400/200"}
                                                                                                                                                                                                   alt={project.title}
                                                                                                                                                                                                   className="w-12 h-12 object-cover rounded"
                                                                                                                                                                                    /> */}

                                                                                                                                                                                    
                                                                                                                                                                                                   <div>
                                                                                                                                                                                                                  <div className="text-sm text-gray-500">
                                                                                                                                                                                                                                Heng Visal
                                                                                                                                                                                                                  </div>
                                                                                                                                                                                                   <div className="font-medium">
                                                                                                                                                                                                                  {project.title}</div>
                                                                                                                                                                                                   </div>
                                                                                                                                                                                    </div>
                                                                                                                                                                     </td>
                                                                                                                                                                     {/* <td className="p-3">
                                                                                                                                                                                    <span
                                                                                                                                                                                                   className={`px-2 py-1 rounded-full text-white text-xs ${getStatusColor(task.status)}`}
                                                                                                                                                                                    >
                                                                                                                                                                                                   {task.status}
                                                                                                                                                                                    </span>
                                                                                                                                                                     </td>
                                                                                                                                                                     <td className="p-3">
                                                                                                                                                                                    <span
                                                                                                                                                                                                   className={`border rounded-full px-2 py-1 text-xs ${getPrivacyIcon(task.privacy)}`}
                                                                                                                                                                                    >
                                                                                                                                                                                                   {task.privacy}
                                                                                                                                                                                    </span>
                                                                                                                                                                     </td>
                                                                                                                                                                     <td className="p-3 text-gray-600">{task.createdAt}</td> */}
                                                                                                                                                      </tr>
                                                                                                                        </tbody>
                                                                                                         </table>
                                                                                          ))
                                                                           ) : (
                                                                                          <li>No projects found</li>
                                                                           )
                                                            }
                                                            
                                             </div>
               </div >
               );
};
export default InvestorProjects;
