import React, { useState, useRef } from 'react';
import { Calendar } from 'lucide-react';
import { useParams } from "react-router-dom";
import Navbar4 from '../Navbar/Navbarselect';

const CampaignRequestForm = () => {
               const [campaignName, setCampaignName] = useState('');
               const [backgroundContext, setBackgroundContext] = useState('');
               const [updateDate, setUpdateDate] = useState('');
               const [file, setFile] = useState(null);
               const [selectedFile, setSelectedFile] = useState(null);
               const fileInputRef = useRef(null);
               const { projectId } = useParams(); // Get projectId from URL

               const handleSubmit = async (e) => {
                              e.preventDefault();

                              const formData = new FormData();
                              formData.append("project_id", projectId); // Pass projectId to API
                              formData.append("title", campaignName);
                              formData.append("description", backgroundContext);
                              formData.append("update_date", updateDate);

                              if (file) {
                                             formData.append("file", file);
                              }

                              try {
                                             const response = await fetch("http://127.0.0.1:8000/api/updates", {
                                                            method: "POST",
                                                            body: formData,
                                             });
                                             const result = await response.json();
                                             if (result.message) {
                                                            alert(result.message);
                                             }
                              } catch (error) {
                                             alert("Error submitting update.");
                              }
               };

               const handleFileChange = (e) => {
                              const selectedFile = e.target.files[0];
                              setFile(selectedFile);
                              setSelectedFile(selectedFile);
               };

               const handleUpload = () => {
                              fileInputRef.current.click();
               };

               return (
                              <>
                                             <Navbar4 />
                                             <div className="min-h-screen bg-gray-100 flex justify-center p-8">
                                                            <div className="bg-white shadow-md rounded-lg w-full max-w-3xl p-8 space-y-6">
                                                                           <h2 className="text-2xl font-semibold text-gray-800 mb-6">Update & Report project progress</h2>

                                                                           <div className="text-sm text-gray-600 mb-6">
                                                                                          This form allows project owners to submit progress updates and keep investors informed.
                                                                           </div>

                                                                           <form onSubmit={handleSubmit} className="space-y-6">
                                                                                          {/* Campaign Name */}
                                                                                          <div>
                                                                                                         <label className="block text-sm font-medium text-gray-700 mb-3">
                                                                                                                        Title <span className="text-red-500">*</span>
                                                                                                         </label>
                                                                                                         <input
                                                                                                                        type="text"
                                                                                                                        placeholder="Enter campaign name"
                                                                                                                        value={campaignName}
                                                                                                                        onChange={(e) => setCampaignName(e.target.value)}
                                                                                                                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                                                                        required
                                                                                                         />
                                                                                          </div>

                                                                                          {/* Description */}
                                                                                          <div>
                                                                                                         <label className="block text-sm font-medium text-gray-700 mb-3">
                                                                                                                        Description <span className="text-red-500">*</span>
                                                                                                         </label>
                                                                                                         <textarea
                                                                                                                        placeholder="Type context here..."
                                                                                                                        value={backgroundContext}
                                                                                                                        onChange={(e) => setBackgroundContext(e.target.value)}
                                                                                                                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                                                                                                                        required
                                                                                                         />
                                                                                          </div>

                                                                                          {/* Update Date */}
                                                                                          <div className="grid md:grid-cols-2 gap-6">
                                                                                                         <div>
                                                                                                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                                                                                                                       Update date
                                                                                                                        </label>
                                                                                                                        <div className="relative">
                                                                                                                                       <input
                                                                                                                                                      type="date"
                                                                                                                                                      value={updateDate}
                                                                                                                                                      onChange={(e) => setUpdateDate(e.target.value)}
                                                                                                                                                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                                                                                       />
                                                                                                                                       <Calendar className="absolute right-3 top-3 text-gray-400" size={20} />
                                                                                                                        </div>
                                                                                                         </div>

                                                                                                         {/* Attach File */}
                                                                                                         <div>
                                                                                                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                                                                                                                       Attach File (optional)
                                                                                                                        </label>
                                                                                                                        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                                                                                                                                       <input
                                                                                                                                                      type="file"
                                                                                                                                                      ref={fileInputRef}
                                                                                                                                                      id="file-upload"
                                                                                                                                                      className="hidden"
                                                                                                                                                      onChange={handleFileChange}
                                                                                                                                       />
                                                                                                                                       <div className="flex-grow px-3 py-2 text-gray-700 text-md font-base">
                                                                                                                                                      {selectedFile ? selectedFile.name : 'No file selected'}
                                                                                                                                       </div>
                                                                                                                                       <button
                                                                                                                                                      type="button"
                                                                                                                                                      className="bg-none text-orange-500/70 font-medium px-6 py-3 transition-colors hover:text-orange-500"
                                                                                                                                                      onClick={handleUpload}
                                                                                                                                       >
                                                                                                                                                      Upload
                                                                                                                                       </button>
                                                                                                                        </div>
                                                                                                         </div>
                                                                                          </div>

                                                                                          <div className="flex justify-end space-x-6 mt-8">
                                                                                                         <button type="submit" className="px-6 py-3 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600 transition">
                                                                                                                        Submit
                                                                                                         </button>
                                                                                          </div>
                                                                           </form>
                                                            </div>
                                             </div>
                              </>
               );
};

export default CampaignRequestForm;
