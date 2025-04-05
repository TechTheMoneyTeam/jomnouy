import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./dashboard.css"
const InvestorProjects = () => {
               const [investments, setInvestments] = useState([]);
               const [user_id, setUserId] = useState(null);

               // Capitalize function
               const capitalizeFirstLetter = (string) => {
                              return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
               };
               const getBorderColor = (status) => {
                              switch (status) {
                                             case 'approved': return 'border-[#2ecc71]';
                                             case 'pending': return 'border-[#f7dc6f]';
                                             case 'rejected': return 'border-red-500';
                                             default: return 'border-red-500';
                              }
               };
               const getBgColor = (status) => {
                              switch (status) {
                                             case 'approved': return 'bg-green-50';
                                             case 'pending': return 'bg-yellow-50';
                                             case 'rejected': return 'bg-red-50';
                                             default: return 'border-gray-500';
                              }
               };

               const getTextColor = (status) => {
                              switch (status) {
                                             case 'approved': return 'text-green-600';
                                             case 'pending': return 'text-yellow-600';
                                             case 'rejected': return 'text-red-600';
                                             default: return 'text-gray-500';
                              }
               };

               // Status color function
               const getStatusColor = (status) => {
                              switch (status) {
                                             case 'approve': return 'bg-[#2ecc71]';
                                             case 'pending': return 'bg-[#f7dc6f]';
                                             case 'reject': return 'bg-red-500';
                                             default: return 'bg-gray-500';
                              }
               };

               // Fetch user_id from localStorage
               useEffect(() => {
                              const userData = localStorage.getItem('user');
                              if (userData) {
                                             try {
                                                            const user = JSON.parse(userData);
                                                            if (user.user_id) {
                                                                           setUserId(user.user_id);
                                                            } else {
                                                                           console.error("User ID not found in localStorage data.");
                                                            }
                                             } catch (error) {
                                                            console.error("Error parsing user data:", error);
                                             }
                              } else {
                                             console.log("No user data found in localStorage.");
                              }
               }, []);

               // Fetch investments once user_id is available
               useEffect(() => {
                              if (!user_id) return;

                              const fetchInvestments = async () => {
                                             try {
                                                            const response = await axios.get(`/api/investor/${user_id}/projects`);
                                                            setInvestments(response.data);
                                             } catch (error) {
                                                            console.error("Error fetching investments:", error.response ? error.response.data : error.message);
                                             }
                              };

                              fetchInvestments();
               }, [user_id]); // Runs when user_id updates

               return (
                              <div className="overflow-x-auto">
                                             {investments.length > 0 ? (
                                                            // <table className="w-full border-collapse table-auto mt-4">
                                                            <table className="cTable ">
                                                                           <thead className="bg-gray-100">
                                                                                          <tr>
                                                                                                         <th className=" thhh">Project Title</th>
                                                                                                         <th className=" thhh">Investment Amount</th>
                                                                                                         <th className=" thhh">Equity Percentage</th>
                                                                                                         <th className=" thhh">Status</th>
                                                                                                         <th className=" thhh">Investment Term</th>
                                                                                                         <th className=" thhh">Investment Date</th>
                                                                                          </tr>
                                                                           </thead>
                                                                           <tbody>
                                                                                          {investments.map((investment) => (
                                                                                                         <tr key={investment.id} className="border-b hover:bg-gray-50 transition-colors">
                                                                                                                        <td className="p-4 text-sm text-gray-500">
                                                                                                                                       {investment.project ? investment.project.title : "N/A"}
                                                                                                                        </td>
                                                                                                                        <td className="p-4 text-sm text-gray-500">${parseInt(investment.amount)}</td>
                                                                                                                        <td className="p-4 text-sm text-gray-500">{investment.equity_percentage} %</td>
                                                                                                                        <td className="p-4 text-xs ">
                                                                                                                                       {/* <span className={`px-4 py-2 rounded-full bg-white text-xs ${getBorderColor(investment.status)} ${getTextColor(investment.status)} ${getStatusColor(investment.status)}`}>
                                                                                                                                                      {capitalizeFirstLetter(investment.status)}
                                                                                                                                       </span> */}
                                                                                                                                       <span className={`px-4 py-2 rounded-full ${getBgColor(investment.status)} border ${getBorderColor(investment.status)} ${getTextColor(investment.status)}`}>

                                                                                                                                                      {capitalizeFirstLetter(investment.status)}
                                                                                                                                       </span>
                                                                                                                        </td>
                                                                                                                        <td className="p-4 text-sm text-gray-500">{investment.investment_term} year(s)</td>
                                                                                                                        <td className="p-4 text-sm text-gray-500">
                                                                                                                                       {new Date(investment.created_at).toLocaleDateString("en-US", {
                                                                                                                                                      year: "numeric",
                                                                                                                                                      month: "long",
                                                                                                                                                      day: "numeric",
                                                                                                                                                      hour12: true,
                                                                                                                                       })}
                                                                                                                        </td>
                                                                                                         </tr>
                                                                                          ))}
                                                                           </tbody>
                                                            </table>

                                             ) : (
                                                            <p className="text-gray-600 text-center">No investments found</p>
                                             )}
                              </div>
               );
};

export default InvestorProjects;
