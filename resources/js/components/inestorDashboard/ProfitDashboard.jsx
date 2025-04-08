import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, Download, Filter, ChevronDown } from 'lucide-react';
import axios from 'axios';

const ProfitDashboard = () => {
  const [profitData, setProfitData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('all');
  const [totalProfit, setTotalProfit] = useState(0);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('all');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Fetch project list and profit data from API
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

        // First fetch the list of projects the investor is involved with
        const projectsResponse = await axios.get(`/api/investments/user/${investorId}/projects`);
        const projectsList = projectsResponse.data || [];
        setProjects(projectsList);

        // Now fetch profit data based on selected project
        let url = `/api/updates/${investorId}`;
        if (selectedProject !== 'all') {
          url += `?project_id=${selectedProject}`;
        }

        const response = await axios.get(url);
        console.log("API Response:", response.data);

        // Process the data for the chart
        if (response.data && response.data.length > 0) {
          // Filter out entries with null profit_amount
          const filteredData = response.data.filter(item => item.profit_amount !== null);

          // Filter by selected project if not "all"
          const projectFilteredData = selectedProject === 'all'
            ? filteredData
            : filteredData.filter(item => item.project_id === selectedProject);

          // Sort by update_date
          projectFilteredData.sort((a, b) => new Date(a.update_date) - new Date(b.update_date));

          // Format data for chart display
          const formattedData = projectFilteredData.map(item => ({
            name: formatDate(item.update_date),
            profit: parseFloat(item.profit_amount),
            title: item.title,
            project: item.project_title || 'Unknown Project'
          }));

          // Calculate total profit based on the filtered data
          const total = projectFilteredData.reduce((sum, item) => sum + parseFloat(item.profit_amount || 0), 0);

          setProfitData(formattedData);
          setTotalProfit(total);
        } else {
          setProfitData([]);
          setTotalProfit(0);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
        setProfitData([]);
        setTotalProfit(0);
      }
    };

    fetchData();
  }, [timeRange, selectedProject]);

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

    return profitData.filter(item => new Date(item.name) >= cutoffDate);
  };

  const getDisplayTitle = () => {
    if (selectedProject === 'all') {
      return 'Overall Profit';
    } else {
      const projectName = projects.find(p => p.project_id === selectedProject)?.title || 'Selected Project';
      return `${projectName} Profit`;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold">{getDisplayTitle()}</h2>
          <div className="relative ml-4">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center px-3 py-2 bg-gray-100 rounded text-sm hover:bg-gray-200"
            >
              {selectedProject === 'all'
                ? 'Overall (All Projects)'
                : projects.find(p => p.project_id === selectedProject)?.title || 'Unknown Project'}
              <ChevronDown className="ml-2 h-4 w-4" />
            </button>

            {dropdownOpen && (
              <div className="absolute z-10 mt-1 w-56 bg-white rounded-md shadow-lg">
                <div className="py-1">
                  <button
                    onClick={() => {
                      setSelectedProject('all');
                      setDropdownOpen(false);
                    }}
                    className={`block px-4 py-2 text-sm w-full text-left ${selectedProject === 'all' ? 'bg-orange-100 text-orange-500 ' : 'text-black font-medium'
                      }`}
                  >
                    Overall (All Projects)
                  </button>

                  {projects.map(project => (
                    <button
                      key={project.project_id}
                      onClick={() => {
                        setSelectedProject(project.project_id);
                        setDropdownOpen(false);
                      }}
                      className={`block px-4 py-2 text-sm w-full  text-left ${selectedProject === project.project_id ? 'bg-orange-100 text-orange-500 ' : 'text-black font-medium'
                        }`}
                    >
                      {project.title}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

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
          <p className="text-sm text-gray-500">Updates Made</p>
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
            <p className="text-sm text-gray-400">
              {selectedProject === 'all'
                ? 'Add profit information in your updates'
                : 'No profit information for this project'}
            </p>
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