import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, Download, Filter } from 'lucide-react';
import axios from 'axios';

const ProfitDashboard = () => {
  const [profitData, setProfitData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('all');
  const [totalProfit, setTotalProfit] = useState(0);

  // Fetch profit data from API
  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        // Retrieve investorId from localStorage
        const userData = localStorage.getItem('user');
        const investorId = userData ? JSON.parse(userData).user_id : null;

        if (!investorId) {
          console.error("Investor ID not found in localStorage.");
          setProfitData([]);
          setTotalProfit(0);
          setIsLoading(false);
          return;
        }

        // Fetch data from your updates table with profit_amount
        const response = await axios.get(`/api/updates/${investorId}`);
        console.log("API Response:", response.data); // Log the response for debugging
        
        // Process the data for the chart
        if (response.data && response.data.length > 0) {
          // Filter out entries with null profit_amount
          const filteredData = response.data.filter(item => item.profit_amount !== null);
          
          // Sort by update_date
          filteredData.sort((a, b) => new Date(a.update_date) - new Date(b.update_date));
          
          // Format data for chart display
          const formattedData = filteredData.map(item => ({
            name: formatDate(item.update_date),
            profit: parseFloat(item.profit_amount), // Ensure profit_amount is mapped correctly
            title: item.title
          }));
          
          // Calculate total profit
          const total = filteredData.reduce((sum, item) => sum + parseFloat(item.profit_amount || 0), 0);
          
          setProfitData(formattedData);
          setTotalProfit(total);
        } else {
          setProfitData([]);
          setTotalProfit(0);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching profit data:", error);
        setIsLoading(false);
        // If API fails, show empty chart
        setProfitData([]);
        setTotalProfit(0);
      }
    };

    fetchData();
  }, [timeRange]);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${date.getDate()} ${monthNames[date.getMonth()]}`;
  };

  // Filter data based on time range
  const getFilteredData = () => {
    if (timeRange === 'all' || profitData.length === 0) {
      return profitData;
    }
    
    const now = new Date();
    const cutoffDate = new Date();
    
    if (timeRange === 'week') {
      cutoffDate.setDate(now.getDate() - 7);
    } else if (timeRange === 'month') {
      cutoffDate.setMonth(now.getMonth() - 1);
    }
    
    // Corrected the property name from 'date' to 'update_date'
    return profitData.filter(item => new Date(item.update_date) >= cutoffDate);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Profit Overview</h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => setTimeRange('all')}
            className={`px-3 py-1 rounded text-sm ${timeRange === 'all' ? 'bg-orange-500 text-white' : 'bg-gray-100'}`}
          >
            All
          </button>
          <button 
            onClick={() => setTimeRange('week')}
            className={`px-3 py-1 rounded text-sm ${timeRange === 'week' ? 'bg-orange-500 text-white' : 'bg-gray-100'}`}
          >
            Week
          </button>
          <button 
            onClick={() => setTimeRange('month')}
            className={`px-3 py-1 rounded text-sm ${timeRange === 'month' ? 'bg-orange-500 text-white' : 'bg-gray-100'}`}
          >
            Month
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Total Profit</p>
          <p className="text-2xl font-bold">${totalProfit.toFixed(2)}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Updated Made</p>
          <p className="text-2xl font-bold">{profitData.length}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Average Profit</p>
          <p className="text-2xl font-bold">
            ${profitData.length > 0 ? (totalProfit / profitData.length).toFixed(2) : '0.00'}
          </p>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading profit data...</p>
        </div>
      ) : profitData.length === 0 ? (
        <div className="flex justify-center items-center h-64 border rounded">
          <div className="text-center">
            <p className="text-gray-500 mb-2">No profit data available</p>
            <p className="text-sm text-gray-400">Add profit information in your updates</p>
          </div>
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={getFilteredData()}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [`$${value}`, 'Profit']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="profit" 
                stroke="#f97316" 
                activeDot={{ r: 8 }} 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default ProfitDashboard;