import React, { useEffect, useState } from 'react';
import axios from 'axios';

const InvestorUpdates = () => {
  const [updates, setUpdates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserAndUpdates = async () => {
      setIsLoading(true);
      try {
        const storedUserData = localStorage.getItem('user');
        
        if (!storedUserData) {
          setError('User data not found. Please log in again.');
          setIsLoading(false);
          return;
        }
        
        const user = JSON.parse(storedUserData);
        setUserData(user);
        
        if (!user.user_id) {
          setError('Invalid user data. Please log in again.');
          setIsLoading(false);
          return;
        }
        
        const response = await axios.get(`/api/investor/${user.user_id}/updates-report`);
        setUpdates(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setError(error.response?.data?.message || 'Failed to load updates. Please try again later.');
        setIsLoading(false);
      }
    };
    
    fetchUserAndUpdates();
  }, []);

  // Format date to a more readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your investment updates...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-yellow-600 px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-white">Investment Updates</h1>
                {userData && userData.name && (
                  <p className="text-yellow-100">Welcome back, {userData.name}</p>
                )}
              </div>
              
            </div>
          </div>

          {/* Summary Stats */}
          <div className="bg-gray-50 px-6 py-4 border-b">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500">Total Updates</p>
                <p className="text-2xl font-semibold">{updates.length}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500">Latest Update</p>
                <p className="text-2xl font-semibold">
                  {updates.length > 0 ? formatDate(updates[0].created_at || new Date()) : 'No updates'}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500">Downloadable Files</p>
                <p className="text-2xl font-semibold">
                  {updates.filter(update => update.file_path).length}
                </p>
              </div>
            </div>
          </div>

          {/* Updates List */}
          <div className="px-6 py-4">
            {updates.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No updates yet</h3>
                <p className="mt-1 text-sm text-gray-500">Check back later for investment updates.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {updates.map((update) => (
                  <div key={update.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    <div className="px-6 py-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-medium text-gray-900">{update.title}</h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          {update.category || 'General Update'}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        {update.created_at ? formatDate(update.created_at) : 'Date not available'}
                      </p>
                      <div className="mt-4 text-sm text-gray-700">
                        <p>{update.description}</p>
                      </div>
                      {update.file_path && (
                        <div className="mt-4">
                          <a 
                            href={`/storage/${update.file_path}`} 
                            download
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                          >
                            <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download Image
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-4 text-center text-sm text-gray-500">
          <p>For assistance, please contact Jomnouy Team.</p>
        </div>
      </div>
    </div>
  );
};

export default InvestorUpdates;