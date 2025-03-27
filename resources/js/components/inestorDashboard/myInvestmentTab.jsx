import React from 'react';
import { Users } from 'lucide-react';

const tasks = [
               {
                              createdBy: {
                                             name: 'Jhon Clavio',
                                             role: 'Product Designer',
                                             avatar: '/api/placeholder/40/40'
                              },
                              subject: 'Blog Writing',
                              ticket: '#210452',
                              assignedTo: 'Simply Web',
                              status: 'Open',
                              privacy: 'Private',
                              createdAt: 'April 14, 2022 5:20 PM'
               },
               {
                              createdBy: {
                                             name: 'Alex Smith',
                                             role: 'Product Designer',
                                             avatar: '/api/placeholder/40/40'
                              },
                              subject: 'Article',
                              ticket: '#210452',
                              assignedTo: 'Simply Web',
                              status: 'Open',
                              privacy: 'Private',
                              createdAt: 'April 10, 2022 4:22 PM'
               },
               {
                              createdBy: {
                                             name: 'Saleh Mohasoy',
                                             role: 'Product Designer',
                                             avatar: '/api/placeholder/40/40'
                              },
                              subject: 'Productivity',
                              ticket: '#210452',
                              assignedTo: 'Simply Web',
                              status: 'Open',
                              privacy: 'Public',
                              createdAt: 'April 05, 2022 5:20 PM'
               },
               {
                              createdBy: {
                                             name: 'Power Boy',
                                             role: 'Product Designer',
                                             avatar: '/api/placeholder/40/40'
                              },
                              subject: 'Verfication',
                              ticket: '#210452',
                              assignedTo: 'Simply Web',
                              status: 'Pending',
                              privacy: 'Private',
                              createdAt: 'April 04, 2022 6:30 PM'
               },
               {
                              createdBy: {
                                             name: 'Ruhan Ibn Tajul',
                                             role: 'Product Designer',
                                             avatar: '/api/placeholder/40/40'
                              },
                              subject: 'Refund Policy',
                              ticket: '#210452',
                              assignedTo: 'Simply Web',
                              status: 'Pending',
                              privacy: 'Public',
                              createdAt: 'April 02, 2022 10:20 AM'
               },
               {
                              createdBy: {
                                             name: 'Kilan James',
                                             role: 'Product Designer',
                                             avatar: '/api/placeholder/40/40'
                              },
                              subject: 'Lifetime Deals',
                              ticket: '#210452',
                              assignedTo: 'Simply Web',
                              status: 'Open',
                              privacy: 'Private',
                              createdAt: 'March 18, 2022 5:20 PM'
               },
               {
                              createdBy: {
                                             name: 'Thomas Flechture',
                                             role: 'Product Designer',
                                             avatar: '/api/placeholder/40/40'
                              },
                              subject: 'Blog Writing',
                              ticket: '#210452',
                              assignedTo: 'Simply Web',
                              status: 'Pending',
                              privacy: 'Private',
                              createdAt: 'March 14, 2022 4:20 PM'
               },
               {
                              createdBy: {
                                             name: 'Hamidi Ibrahim',
                                             role: 'Product Designer',
                                             avatar: '/api/placeholder/40/40'
                              },
                              subject: 'FAQ',
                              ticket: '#210452',
                              assignedTo: 'Simply Web',
                              status: 'Pending',
                              privacy: 'Private',
                              createdAt: 'March 10, 2022 1:20 PM'
               }
];

const TaskManagementTable = () => {
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

               return (
                              <div className="container mx-auto p-4 bg-white">
                                             <div className="overflow-x-auto">
                                                            <table className="w-full border-collapse">
                                                                           <thead className="bg-gray-100">
                                                                                          <tr>
                                                                                                         <th className="p-3 text-left">Project Title</th>
                                                                                                         {/* <th className="p-3 text-left">Subject</th> */}
                                                                                                         {/* <th className="p-3 text-left">Assigned</th> */}
                                                                                                         <th className="p-3 text-left">Status</th>
                                                                                                         <th className="p-3 text-left">Date</th>
                                                                                                         <th className="p-3 text-left">Action</th>
                                                                                          </tr>
                                                                           </thead>
                                                                           <tbody>
                                                                                          {tasks.map((task, index) => (
                                                                                                         <tr
                                                                                                                        key={index}
                                                                                                                        className="border-b hover:bg-gray-50 transition-colors"
                                                                                                         >
                                                                                                                        <td className="p-3">
                                                                                                                                       <div className="flex items-center">
                                                                                                                                                      <img
                                                                                                                                                                     src={task.createdBy.avatar}
                                                                                                                                                                     alt={task.createdBy.name}
                                                                                                                                                                     className="w-10 h-10 rounded-full mr-3"
                                                                                                                                                      />
                                                                                                                                                      <div>
                                                                                                                                                                     <div className="font-semibold">{task.createdBy.name}</div>
                                                                                                                                                                     <div className="text-sm text-gray-500">
                                                                                                                                                                                    {task.createdBy.role}
                                                                                                                                                                     </div>
                                                                                                                                                      </div>
                                                                                                                                       </div>
                                                                                                                        </td>
                                                                                                                        {/* <td className="p-3">
                                                                                                                                       <div className="font-medium">{task.subject}</div>
                                                                                                                                       <div className="text-sm text-gray-500">{task.ticket}</div>
                                                                                                                        </td> */}
                                                                                                                        {/* <td className="p-3 text-gray-600">{task.assignedTo}</td> */}
                                                                                                                        <td className="p-3">
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
                                                                                                                        <td className="p-3 text-gray-600">{task.createdAt}</td>
                                                                                                         </tr>
                                                                                          ))}
                                                                           </tbody>
                                                            </table>
                                             </div>
                              </div>
               );
};

export default TaskManagementTable;