import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Check, X, Award, Filter, RefreshCw, Clock, DollarSign, Users, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from './InvestmentApprovalDashboard.module.css';
import Navbar4 from '../Navbar/Navbarselect';

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
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState(null);

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
    <><Navbar4 /><div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Investment Approval Dashboard</h1>
        <p className={styles.subtitle}>
          Review and manage investments for your projects
        </p>
      </div>

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
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
          </select>

          <button
            onClick={() => fetchInvestments(projectId)}
            className={styles.refreshButton}
            disabled={!projectId}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statContent}>
            <div>
              <p className={styles.statLabel}>Total Investments</p>
              <p className={styles.statValue}>{stats.total}</p>
            </div>
            <div className={`${styles.iconContainer} ${styles.iconBlue}`}>
              <DollarSign size={20} />
            </div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statContent}>
            <div>
              <p className={styles.statLabel}>Pending</p>
              <p className={styles.statValue}>{stats.pending}</p>
            </div>
            <div className={`${styles.iconContainer} ${styles.iconYellow}`}>
              <Clock size={20} />
            </div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statContent}>
            <div>
              <p className={styles.statLabel}>Unique Investors</p>
              <p className={styles.statValue}>{stats.uniqueInvestors}</p>
            </div>
            <div className={`${styles.iconContainer} ${styles.iconGreen}`}>
              <Users size={20} />
            </div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statContent}>
            <div>
              <p className={styles.statLabel}>Approved</p>
              <p className={styles.statValue}>{stats.approved}</p>
            </div>
            <div className={`${styles.iconContainer} ${styles.iconGreen}`}>
              <Check size={20} />
            </div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statContent}>
            <div>
              <p className={styles.statLabel}>Total Amount</p>
              <p className={styles.statValue}>{formatCurrency(stats.totalAmount)}</p>
            </div>
            <div className={`${styles.iconContainer} ${styles.iconOrange}`}>
              <DollarSign size={20} />
            </div>
          </div>
        </div>
      </div>

      {investments.length > 0 && (
        <div className={styles.chartContainer}>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={investments}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="user_id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#F07900" />
              <Bar dataKey="equity_percentage" fill="#FFB366" />
            </BarChart>
          </ResponsiveContainer>
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
                      {investment.investment_term}
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
                            ${investment.status === 'completed' || investment.status === 'rejected' ? styles.buttonDisabled : ''}
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