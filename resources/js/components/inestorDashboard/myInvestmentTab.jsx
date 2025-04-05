import React, { useEffect, useState } from 'react';
import axios from 'axios';

const InvestorProjects = () => {
               const [projects, setProjects] = useState([]);
               const [user_id, setUserId] = useState(null);  // Initialize as null
               // const [investment, setInvestments] = useState([]);
               const capitalizeFirstLetter = (string) => {
                              return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
               };

               const getStatusColor = (status) => {
                              switch (status) {
                                             case 'approve': return 'bg-[#2ecc71]';
                                             case 'pending': return 'bg-[#f7dc6f]';
                                             case 'reject': return 'bg-red-500';
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
               const [investments, setInvestments] = useState([]);

            

               useEffect(() => {
                              if (user_id) {
                                             const fetchInvestments = async () => {
                                                            try {
                                                                           const response = await axios.get(`/api/investor/${user_id}/projects`);
                                                                           setInvestments(response.data);
                                                            } catch (error) {
                                                                           console.error("Error fetching investments:", error.response ? error.response.data : error.message);
                                                            }
                                             };

                                             fetchInvestments();
                              } else {
                                             console.log("No user_id found in localStorage");
                              }
               }, [user_id]); // Only run when user_id changes

               return (
                              <div className="overflow-x-auto">
                                             {investments.length > 0 ? (
                                                            <table className="w-full border-collapse mt-4">
                                                                           <thead className="bg-gray-100">
                                                                                          <tr>
                                                                                                         <th className="p-3 text-left">Project Title</th>
                                                                                                         <th className="p-3 text-left">Investment Amount</th>
                                                                                                         <th className="p-3 text-left">Equity Percentage</th>
                                                                                                         <th className="p-3 text-left">Status</th>
                                                                                                         <th className="p-3 text-left">Investment Term</th>
                                                                                                         <th className="p-3 text-left">Investment Date</th>
                                                                                                         <th className="p-3 text-left">Action</th>
                                                                                          </tr>
                                                                           </thead>
                                                                           <tbody>
                                                                                          {investments.map((investment) => (
                                                                                                         <tr key={investment.id} className="border-b hover:bg-gray-50 transition-colors mt-4">
                                                                                                                        <td className="p-4 text-sm text-gray-500">
                                                                                                                                       {investment.project ? investment.project.title : "N/A"}
                                                                                                                        </td>
                                                                                                                        <td className="p-4 text-sm text-gray-500">$ {parseInt(investment.amount)}</td>
                                                                                                                        {/* <td className="p-3">{investment.status}</td> */}
                                                                                                                        <td className="p-4 text-sm text-gray-500">{investment.equity_percentage} %</td>
                                                                                                                        <td className="p-4 text-sm text-gray-500">
                                                                                                                                       <span className={`px-4 py-2 rounded-full text-white text-xs ${getStatusColor(investment.status)}`}>
                                                                                                                                                      {capitalizeFirstLetter(investment.status)}
                                                                                                                                       </span>
                                                                                                                        </td>
                                                                                                                        <td className="p-4 text-sm text-gray-500">{investment.investment_term} year (s)</td>


                                                                                                                        <td className="p-4 text-sm text-gray-500">
                                                                                                                                       {new Date(investment.created_at).toLocaleDateString('en-US', {
                                                                                                                                                      year: 'numeric',
                                                                                                                                                      month: 'long',
                                                                                                                                                      day: 'numeric',
                                                                                                                                                      // hour: '2-digit',
                                                                                                                                                      // minute: '2-digit',
                                                                                                                                                      // second: '2-digit',
                                                                                                                                                      hour12: true
                                                                                                                                       })}
                                                                                                                        </td>

                                                                                                         </tr>
                                                                                          ))}
                                                                           </tbody>
                                                            </table>
                                             ) : (
                                                            <p>No investments found</p>
                                             )}
                              </div>
               );
};
export default InvestorProjects;
