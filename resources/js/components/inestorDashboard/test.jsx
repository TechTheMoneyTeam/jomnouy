import React, { useState } from 'react';
import { Search, MoreVertical, ChevronDown } from 'lucide-react';

const CustomerBillingInterface = () => {
               const [customers, setCustomers] = useState([
                              { id: 1, name: 'Sisyphus Corporation', email: 'michael.mitc@example.com', phone: '(217) 555-0113' },
                              { id: 2, name: 'Luminous', email: 'nevaeh.simmons@example.com', phone: '(209) 555-0104' },
                              { id: 3, name: 'Interlock', email: 'sara.cruz@example.com', phone: '(229) 555-0109' },
                              { id: 4, name: 'Biosynthesis', email: 'tim.jennings@example.com', phone: '(308) 555-0121' },
                              { id: 5, name: 'Alt+Shift Agency', email: 'jackson.graham@example.com', phone: '(405) 555-0128' },
                              { id: 6, name: 'Alt+Shift Agency', email: 'jessica.hanson@example.com', phone: '(225) 555-0118' },
                              { id: 7, name: 'Interlock', email: 'dolores.chambers@example.com', phone: '(219) 555-0114' },
                              { id: 8, name: 'Luminous', email: 'debbie.baker@example.com', phone: '(684) 555-0102' },
                              { id: 9, name: 'BoltShift Creative', email: 'michelle.rivera@example.com', phone: '(808) 555-0111' },
                              { id: 10, name: 'Sisyphus Corporation', email: 'bill.sanders@example.com', phone: '(480) 555-0103' },
                              { id: 11, name: 'Prada Automobile', email: 'tanya.hill@example.com', phone: '(270) 555-0117' },
               ]);

               const [searchTerm, setSearchTerm] = useState('');

               const handleSearch = (e) => {
                              setSearchTerm(e.target.value);
               };

               const filteredCustomers = customers.filter(customer =>
                              customer.name.toLowerCase().includes(searchTerm.toLowerCase())
               );

               return (
                              <div className="bg-white rounded-lg shadow-sm p-6 max-w-4xl mx-auto">
                                             <div className="mb-6 flex justify-between items-center">
                                                            <div className="relative w-80">
                                                                           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                                          <Search className="h-5 w-5 text-gray-400" />
                                                                           </div>
                                                                           <input
                                                                                          type="text"
                                                                                          placeholder="Search by name"
                                                                                          className="pl-10 pr-4 py-2 w-full bg-gray-50 border-0 rounded-full text-sm text-gray-900 focus:ring-0 focus:outline-none"
                                                                                          value={searchTerm}
                                                                                          onChange={handleSearch}
                                                                           />
                                                            </div>
                                                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                                                           <span>Newest First</span>
                                                                           <ChevronDown className="h-4 w-4" />
                                                            </div>
                                             </div>

                                             <div className="overflow-x-auto">
                                                            <table className="w-full">
                                                                           <thead>
                                                                                          <tr className="cTable2">
                                                                                                         <th className="pb-2 font-normal">NAME</th>
                                                                                                         <th className="pb-2 font-normal">EMAIL</th>
                                                                                                         <th className="pb-2 font-normal">PHONE</th>
                                                                                                         <th className="pb-2 font-normal">ACTIONS</th> {/* Correctly added actions column */}
                                                                                          </tr>
                                                                           </thead>
                                                                           <tbody>
                                                                                          {filteredCustomers.map((customer) => (
                                                                                                         <tr key={customer.id} className="border-b border-gray-100">
                                                                                                                        <td className="py-4 text-gray-900">{customer.name}</td>
                                                                                                                        <td className="py-4 text-gray-900">{customer.email}</td>
                                                                                                                        <td className="py-4 text-gray-900">{customer.phone}</td>
                                                                                                                        <td className="py-4">
                                                                                                                                       <button className="px-4 py-2 text-blue-600 border border-blue-600 rounded-full text-sm font-medium hover:bg-blue-50 transition-colors">
                                                                                                                                                      Create a bill
                                                                                                                                       </button>
                                                                                                                        </td>
                                                                                                                        <td className="py-4 text-center">
                                                                                                                                       <button className="text-gray-400 hover:text-gray-600">
                                                                                                                                                      <MoreVertical className="h-5 w-5" />
                                                                                                                                       </button>
                                                                                                                        </td>
                                                                                                         </tr>
                                                                                          ))}
                                                                           </tbody>
                                                            </table>
                                             </div>
                              </div>
               );
};

export default CustomerBillingInterface;