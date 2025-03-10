import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Check, X, Award, Filter, RefreshCw, Clock, DollarSign, Users, AlertCircle } from 'lucide-react';

const InvestmentApprovalDashboard = () => {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projectId, setProjectId] = useState('');
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    completed: 0,
    totalAmount: 0,
    uniqueInvestors: 0
  });
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (projectId) {
      fetchInvestments(projectId);
    }
  }, [projectId, statusFilter, sortField, sortDirection]);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('/api/projects');
      setProjects(response.data);
      if (response.data.length > 0) {
        setProjectId(response.data[0].project_id || response.data[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      setError('Failed to load projects. Please try again.');
    }
  };

  const fetchInvestments = async (pid) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/project-investments/${pid}`);
      let investmentsData = response.data.investments || response.data;
      
      // Apply status filter
      if (statusFilter !== 'all') {
        investmentsData = investmentsData.filter(inv => inv.status === statusFilter);
      }
      
      // Apply sorting
      investmentsData.sort((a, b) => {
        let valueA = a[sortField];
        let valueB = b[sortField];
        
        if (sortField === 'amount' || sortField === 'equity_percentage') {
          valueA = parseFloat(valueA);
          valueB = parseFloat(valueB);
        }
        
        if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
        if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });

      setInvestments(investmentsData);
      
      // Calculate statistics
      const uniqueInvestors = new Set(investmentsData.map(inv => inv.user_id)).size;
      const pendingCount = investmentsData.filter(inv => inv.status === 'pending').length;
      const approvedCount = investmentsData.filter(inv => inv.status === 'approved').length;
      const rejectedCount = investmentsData.filter(inv => inv.status === 'rejected').length;
      const completedCount = investmentsData.filter(inv => inv.status === 'completed').length;
      const totalAmount = investmentsData.reduce((sum, inv) => sum + parseFloat(inv.amount || 0), 0);
      
      setStats({
        total: investmentsData.length,
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount,
        completed: completedCount,
        totalAmount: totalAmount,
        uniqueInvestors: uniqueInvestors
      });
      
      setError(null);
    } catch (error) {
      console.error('Failed to fetch investments:', error);
      setError('Failed to load investments. Please try again.');
      setInvestments([]);
    } finally {
      setLoading(false);
    }
  };

  const updateInvestmentStatus = async (investmentId, newStatus) => {
    try {
      await axios.put(`/api/investments/${investmentId}`, { status: newStatus });
      
      // Update the local state to reflect the change
      setInvestments(investments.map(inv => 
        (inv.investment_id || inv.id) === investmentId 
          ? { ...inv, status: newStatus } 
          : inv
      ));
      
      // Update the statistics
      const updatedInvestments = investments.map(inv => 
        (inv.investment_id || inv.id) === investmentId 
          ? { ...inv, status: newStatus } 
          : inv
      );
      
      const pendingCount = updatedInvestments.filter(inv => inv.status === 'pending').length;
      const approvedCount = updatedInvestments.filter(inv => inv.status === 'approved').length;
      const rejectedCount = updatedInvestments.filter(inv => inv.status === 'rejected').length;
      const completedCount = updatedInvestments.filter(inv => inv.status === 'completed').length;
      
      setStats(prev => ({
        ...prev,
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount,
        completed: completedCount
      }));
      
    } catch (error) {
      console.error('Failed to update investment status:', error);
      alert(`Failed to update status: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleSort = (field) => {
    setSortDirection(sortField === field && sortDirection === 'asc' ? 'desc' : 'asc');
    setSortField(field);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="p-6 max-w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Investment Approval Dashboard</h1>
        <p className="text-gray-600">
          Review and manage investments for your projects
        </p>
      </div>

      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="w-full md:w-64">
          <label htmlFor="project-select" className="block text-sm font-medium text-gray-700 mb-1">
            Select Project
          </label>
          <select
            id="project-select"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            {projects.map(project => (
              <option key={project.project_id || project.id} value={project.project_id || project.id}>
                {project.title}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
          </select>

          <button 
            onClick={() => fetchInvestments(projectId)}
            className="p-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 flex items-center gap-1"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Investments</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <DollarSign size={20} className="text-blue-700" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold">{stats.pending}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Clock size={20} className="text-yellow-700" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Unique Investors</p>
              <p className="text-2xl font-bold">{stats.uniqueInvestors}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Users size={20} className="text-green-700" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Approved</p>
              <p className="text-2xl font-bold">{stats.approved}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Check size={20} className="text-green-700" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="text-2xl font-bold">{formatCurrency(stats.totalAmount)}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <DollarSign size={20} className="text-purple-700" />
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('investment_id')}
                >
                  ID
                  {sortField === 'investment_id' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('user_id')}
                >
                  Investor
                  {sortField === 'user_id' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('amount')}
                >
                  Amount
                  {sortField === 'amount' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('equity_percentage')}
                >
                  Equity %
                  {sortField === 'equity_percentage' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('payment_method')}
                >
                  Payment Method
                  {sortField === 'payment_method' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('investment_term')}
                >
                  Term
                  {sortField === 'investment_term' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('created_at')}
                >
                  Date
                  {sortField === 'created_at' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('status')}
                >
                  Status
                  {sortField === 'status' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {investments.length > 0 ? (
                investments.map((investment) => (
                  <tr key={investment.investment_id || investment.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {investment.investment_id || investment.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {investment.user ? 
                        `${investment.user.username || investment.user.name || 'User'} (${investment.user_id})` :
                        investment.user_id
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {formatCurrency(investment.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {parseFloat(investment.equity_percentage).toFixed(2)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {investment.payment_method}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {investment.investment_term}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(investment.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium
                        ${investment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${investment.status === 'approved' ? 'bg-green-100 text-green-800' : ''}
                        ${investment.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                        ${investment.status === 'completed' ? 'bg-blue-100 text-blue-800' : ''}
                      `}>
                        {investment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => updateInvestmentStatus(investment.investment_id || investment.id, 'approved')}
                          disabled={investment.status === 'approved'}
                          className={`p-1 rounded-md text-white
                            ${investment.status === 'approved' ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}
                          `}
                          title="Approve"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => updateInvestmentStatus(investment.investment_id || investment.id, 'rejected')}
                          disabled={investment.status === 'rejected'}
                          className={`p-1 rounded-md text-white
                            ${investment.status === 'rejected' ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'}
                          `}
                          title="Reject"
                        >
                          <X size={16} />
                        </button>
                        <button
                          onClick={() => updateInvestmentStatus(investment.investment_id || investment.id, 'completed')}
                          disabled={investment.status === 'completed' || investment.status === 'rejected'}
                          className={`p-1 rounded-md text-white
                            ${investment.status === 'completed' || investment.status === 'rejected' ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}
                          `}
                          title="Complete"
                        >
                          <Award size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-6 py-4 text-center text-sm text-gray-500">
                    No investments found for this project.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InvestmentApprovalDashboard;