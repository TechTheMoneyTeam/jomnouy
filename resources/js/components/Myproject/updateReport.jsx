import React, { useState, useRef } from 'react';
import { Calendar } from 'lucide-react';
import { useParams } from "react-router-dom";
import Navbar4 from '../Navbar/Navbarselect';
import axios from 'axios';
import { toast, Toaster } from 'sonner';

const UpdateForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [updateDate, setUpdateDate] = useState('');
    const [profitAmount, setProfitAmount] = useState('');
    const [file, setFile] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);
    const { projectId } = useParams(); // Get projectId from URL


    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("project_id", projectId);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("update_date", updateDate);
        formData.append("profit_amount", profitAmount);

        if (file) {
            formData.append("file", file);
        }

        try {
            const response = await axios.post("/api/updates-progress", formData);

            // Show success toast
            toast.success(response.data.message || "Update submitted successfully!");
        } catch (error) {
            console.error("Error submitting update:", error);

            // Show error toast
            toast.error("Error submitting update. Please try again.");
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
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
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
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                                required
                            />
                        </div>

                        {/* Update Date and Profit Amount */}
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
                                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                                        placeholder="YYYY-MM-DD"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Profit Amount
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={profitAmount}
                                        onChange={(e) => setProfitAmount(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter profit amount"
                                    />
                                </div>
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

                        <div className="flex justify-end space-x-6 mt-8">
                            <button type="submit" className="px-6 py-3 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600 transition">
                                Submit
                            </button>
                        </div>
                        <Toaster richColors position="top-center" duration={4000} />
                    </form>
                </div>
            </div>
        </>
    );
};

export default UpdateForm;