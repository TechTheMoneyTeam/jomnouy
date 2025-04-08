import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Check, X, Award, Filter, RefreshCw, Clock, DollarSign, Users, AlertCircle } from 'lucide-react';
import {
  PieChart, Pie, Cell,
  LineChart, Line,
  XAxis, YAxis,
  CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from 'recharts';
import styles from './InvestmentApprovalDashboard.module.css';
import Navbar4 from '../Navbar/Navbarselect';
import { useNavigate } from "react-router-dom";
import UpdateForm from "./updateReport";
const InvestmentApprovalDashboard = () => {
  const navigate = useNavigate();
  const [showUpdateForm, setShowUpdateForm] = useState(false);
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
    uniqueInvestors: 0,
    term_1_5: 0,
    term_5_10: 0,
    term_10_plus: 0
  });
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState(null);

  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const handleUpdateClick = (projectId) => {
    navigate(`/update/${projectId}`); 
  };

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setUsername(user.username);
      setUserId(user.user_id);
      fetchProjects(user.user_id);
    }
  }, []);

  useEffect(() => {
    if (projectId) {
      fetchInvestments(projectId);
    }
  }, [projectId, statusFilter, sortField, sortDirection]);

  const fetchProjects = async (userId) => {
    try {
      const response = await axios.get(`/api/projects?user_id=${userId}`);

      // Filter projects to only include those owned by the current user
      const userProjects = response.data.filter(project =>
        (project.user_id === userId || project.creator_id === userId)
      );

      setProjects(userProjects);

      if (userProjects.length > 0) {
        setProjectId(userProjects[0].project_id || userProjects[0].id);
      } else {
        setError('No projects found for your account.');
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      setError('Failed to load projects. Please try again.');
    }
  };

  const fetchInvestments = async (pid) => {
    setLoading(true);
    try {
      // Verify this project belongs to the current user before fetching investments
      const projectBelongsToUser = projects.some(p => {
        console.log("Comparing:",
          String(p.project_id || p.id), "==", String(pid),
          "AND",
          String(p.user_id || p.creator_id), "==", String(userId)
        );
        return (String(p.project_id || p.id) === String(pid)) &&
          (String(p.user_id) === String(userId) || String(p.creator_id) === String(userId));
      });

      if (!projectBelongsToUser) {
        setError('You do not have permission to view investments for this project.');
        setInvestments([]);
        setLoading(false);
        return;
      }

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
      const term_1_5_count = investmentsData.filter(inv => inv.investment_term === '1-5').length;
      const term_5_10_count = investmentsData.filter(inv => inv.investment_term === '5-10').length;
      const term_10_plus_count = investmentsData.filter(inv => inv.investment_term === '10+').length;

      setStats({
        total: investmentsData.length,
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount,
        completed: completedCount,
        totalAmount: totalAmount,
        uniqueInvestors: uniqueInvestors,
        term_1_5: term_1_5_count,
        term_5_10: term_5_10_count,
        term_10_plus: term_10_plus_count
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

  // Prepare data for pie chart
  const pieChartData = [
    { name: 'Pending', value: stats.pending, color: '#FFBB28' },
    { name: 'Approved', value: stats.approved, color: '#00C49F' },
    { name: 'Rejected', value: stats.rejected, color: '#FF8042' },
    { name: 'Completed', value: stats.completed, color: '#0088FE' }
  ].filter(item => item.value > 0);

  // Prepare data for line chart - group investments by date
  const prepareLineChartData = () => {
    const dataMap = new Map();

    investments.forEach(inv => {
      const date = formatDate(inv.created_at);
      const amount = parseFloat(inv.amount || 0);

      if (dataMap.has(date)) {
        dataMap.set(date, {
          date,
          totalAmount: dataMap.get(date).totalAmount + amount,
          count: dataMap.get(date).count + 1
        });
      } else {
        dataMap.set(date, {
          date,
          totalAmount: amount,
          count: 1
        });
      }
    });

    // Convert map to array and sort by date
    return Array.from(dataMap.values())
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  return (
    <>
      <Navbar4 />
      <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Investment Approval Dashboard</h1>
        <p className={styles.subtitle}>
          Review and manage investments for your projects
        </p>
      </div>

        <div className="bg-[#f8f9f9]/80 p-5 rounded-lg">
          <div className={styles.controls}>
            <div className={styles.selectWrapper}>
              <label htmlFor="project-select" className={styles.selectLabel}>
                Select Your Project
              </label>
              <select
                id="project-select"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className={styles.select}
                disabled={projects.length === 0}
              >
                {projects.length > 0 ? (
                  projects.map(project => (
                    <option key={project.project_id || project.id} value={project.project_id || project.id}>
                      {project.title}
                    </option>
                  ))
                ) : (
                  <option value="">No projects available</option>
                )}
              </select>
            </div>

            <div className={styles.filterControls}>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={styles.statusFilter}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="completed">Completed</option>
              </select>

              {/* <button
                onClick={() => fetchInvestments(projectId)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
                disabled={!projectId}
              >
                <RefreshCw size={16} />
                Refresh
              </button> */}

              {/* <button
                onClick={() => fetchInvestments(projectId)}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:opacity-50 flex items-center whitespace-nowrap gap-2"
                disabled={!projectId}
              >
                <RefreshCw size={16} />
                <span className="truncate">Update & Report</span>
              </button> */}
              <button
                className="bg-[#F07900] text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:opacity-50 flex items-center whitespace-nowrap gap-2"

                onClick={() => handleUpdateClick(projectId)}// Fixed the event
              >
                Update & Report
              </button>

            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-5">

            <div className="bg-blue-100 p-4 rounded-md ">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[#2e86c1] font-medium">Total Investments Offered</p>
                  <p className="pt-1 text-lg font-normal">{stats.total}</p>
                </div>
                <div className="text-blue-500">
                  <DollarSign size={20} color='#2e86c1' />
                </div>
              </div>
            </div>

            <div className="bg-yellow-100 p-4 rounded-md ">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[#f1c40f] font-medium">Pending</p>
                  <p className="pt-1 text-lg font-normal">{stats.pending}</p>
                </div>
                <div className="text-yellow-500">
                  <Clock size={20} />
                </div>
              </div>
            </div>

            <div className="bg-purple-100 p-4 rounded-md ">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[#8e44ad] font-medium">Investors Amount</p>
                  <p className="pt-1 text-lg font-normal">{stats.uniqueInvestors}</p>
                </div>
                <div className="text-green-500">
                  <Users size={20} color='#8e44ad' />
                </div>
              </div>
            </div>

            <div className="bg-green-100 p-4 rounded-md ">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[#27ae60] font-medium">Approved</p>
                  <p className="pt-1 text-lg font-normal">{stats.approved}</p>
                </div>
                <div className="text-green-500">
                  <Check size={20} />
                </div>
              </div>
            </div>

            <div className="bg-orange-100 p-4 rounded-md ">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-custom-orange font-medium">Total Amount Offered</p>
                  <p className="pt-1 text-lg font-normal">{formatCurrency(stats.totalAmount)}</p>
                </div>
                <div className="text-orange-500">
                  <DollarSign size={20} />
                </div>
              </div>
            </div>
          </div>
        </div>


      {investments.length > 0 && (
        <div className={styles.chartsContainer}>
          {/* Pie Chart */}
          <div className={styles.chartContainer}>
            <h3 className={styles.chartTitle}>Investment Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}`, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Line Chart */}
          <div className={styles.chartContainer}>
            <h3 className={styles.chartTitle}>Investment Trends Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={prepareLineChartData()}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="totalAmount"
                  name="Investment Amount"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="count"
                  name="Number of Investments"
                  stroke="#82ca9d"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {error && (
        <div className={styles.errorAlert}>
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th
                  className={styles.tableHeader}
                  onClick={() => handleSort('investment_id')}
                >
                  ID
                  {sortField === 'investment_id' && (
                    <span className={styles.sortIndicator}>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th
                  className={styles.tableHeader}
                  onClick={() => handleSort('user_id')}
                >
                  Investor
                  {sortField === 'user_id' && (
                    <span className={styles.sortIndicator}>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th
                  className={styles.tableHeader}
                  onClick={() => handleSort('amount')}
                >
                  Amount
                  {sortField === 'amount' && (
                    <span className={styles.sortIndicator}>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th
                  className={styles.tableHeader}
                  onClick={() => handleSort('equity_percentage')}
                >
                  Equity %
                  {sortField === 'equity_percentage' && (
                    <span className={styles.sortIndicator}>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th
                  className={styles.tableHeader}
                  onClick={() => handleSort('payment_method')}
                >
                  Payment Method
                  {sortField === 'payment_method' && (
                    <span className={styles.sortIndicator}>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th
                  className={styles.tableHeader}
                  onClick={() => handleSort('investment_term')}
                >
                  Term
                  {sortField === 'investment_term' && (
                    <span className={styles.sortIndicator}>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th
                  className={styles.tableHeader}
                  onClick={() => handleSort('created_at')}
                >
                  Date
                  {sortField === 'created_at' && (
                    <span className={styles.sortIndicator}>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th
                  className={styles.tableHeader}
                  onClick={() => handleSort('status')}
                >
                  Status
                  {sortField === 'status' && (
                    <span className={styles.sortIndicator}>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th className={styles.tableHeader}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {investments.length > 0 ? (
                investments.map((investment) => (
                  <tr key={investment.investment_id || investment.id} className={styles.tableRow}>
                    <td className={styles.tableCell}>
                      {investment.investment_id || investment.id}
                    </td>
                    <td className={styles.tableCell}>
                      {investment.user ?
                        `${investment.user.username || investment.user.name || 'User'} (${investment.user_id})` :
                        investment.user_id}
                    </td>
                    <td className={`${styles.tableCell} ${styles.amountCell}`}>
                      {formatCurrency(investment.amount)}
                    </td>
                    <td className={styles.tableCell}>
                      {parseFloat(investment.equity_percentage).toFixed(2)}%
                    </td>
                    <td className={styles.tableCell}>
                      {investment.payment_method}
                    </td>
                    <td className={styles.tableCell}>
                      {investment.investment_term === '1-5' ? '1-5 Years' :
                        investment.investment_term === '5-10' ? '5-10 Years' :
                          investment.investment_term === '10+' ? '10+ Years' :
                            investment.investment_term}
                    </td>
                    <td className={styles.tableCell}>
                      {formatDate(investment.created_at)}
                    </td>
                    <td className={styles.tableCell}>
                      <span className={`
                        ${styles.statusBadge}
                        ${investment.status === 'pending' ? styles.statusPending : ''}
                        ${investment.status === 'approved' ? styles.statusApproved : ''}
                        ${investment.status === 'rejected' ? styles.statusRejected : ''}
                        ${investment.status === 'completed' ? styles.statusCompleted : ''}
                      `}>
                        {investment.status}
                      </span>
                    </td>
                    <td className={styles.tableCell}>
                      <div className={styles.actionButtons}>
                        {investment.status === 'completed' ? (
                          <span className={styles.completeText}>Complete</span>
                        ) : (
                          <>
                            <button
                              onClick={() => updateInvestmentStatus(investment.investment_id || investment.id, 'approved')}
                              disabled={investment.status === 'approved'}
                              className={`
                                ${styles.actionButton}
                                ${styles.approveButton}
                                ${investment.status === 'approved' ? styles.buttonDisabled : ''}
                              `}
                              title="Approve"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={() => updateInvestmentStatus(investment.investment_id || investment.id, 'rejected')}
                              disabled={investment.status === 'rejected'}
                              className={`
                                ${styles.actionButton}
                                ${styles.rejectButton}
                                ${investment.status === 'rejected' ? styles.buttonDisabled : ''}
                              `}
                              title="Reject"
                            >
                              <X size={16} />
                            </button>
                            <button
                              onClick={() => updateInvestmentStatus(investment.investment_id || investment.id, 'completed')}
                              disabled={investment.status === 'completed' || investment.status === 'rejected'}
                              className={`
                                ${styles.actionButton}
                                ${styles.completeButton}
                                ${investment.status === 'completed' ? styles.buttonBright : ''}
                                ${investment.status === 'completed' || investment.status === 'rejected' ? styles.buttonDisabled : ''}
                              `}
                              title="Complete"
                            >
                              <Award size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className={`${styles.tableCell} ${styles.emptyState}`}>
                    No investments found for this project.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div></>
  );
};

export default InvestmentApprovalDashboard;