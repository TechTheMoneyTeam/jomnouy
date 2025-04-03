import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Trans.css';

const TransactionDetails = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const userId = JSON.parse(localStorage.getItem('user'))?.user_id;
        if (!userId) {
          throw new Error('User ID not found');
        }
        const response = await axios.get(`/api/investments/user/${userId}`);
        setTransactions(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setError('Failed to load transactions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(dateString));
  };

  if (loading) {
    return (
      <div className="td-stupid-loading">
        <div className="td-stupid-loading-inner">
          <div className="td-stupid-spinner"></div>
          <p className="td-stupid-loading-text">Loading transactions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="td-stupid-error">
        <div className="td-stupid-error-flex">
          <div>
            <svg className="td-stupid-error-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="td-stupid-error-content">
            <h3 className="td-stupid-error-title">Error</h3>
            <div className="td-stupid-error-message">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="td-stupid-container">
        <div className="td-stupid-header">
          <h2 className="td-stupid-title">Transaction Details</h2>
        </div>
        <div className="td-stupid-empty">
          <svg className="td-stupid-empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="td-stupid-empty-title">No transactions found</h3>
          <p className="td-stupid-empty-message">
            You haven't made any investments yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="td-stupid-container">
      <div className="td-stupid-header">
        <h2 className="td-stupid-title">Transaction Details</h2>
        <p className="td-stupid-subtitle">{transactions.length} transactions found</p>
      </div>
      
      <div className="td-stupid-table-container">
        <table className="td-stupid-table">
          <thead className="td-stupid-thead">
            <tr>
              <th className="td-stupid-th">Project Title</th>
              <th className="td-stupid-th">Amount Paid</th>
              <th className="td-stupid-th">Payment Method</th>
              <th className="td-stupid-th">Payment Date</th>
            </tr>
          </thead>
          <tbody className="td-stupid-tbody">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="td-stupid-tr">
                <td className="td-stupid-td">
                  <div className="td-stupid-project-title">{transaction.project?.title || 'N/A'}</div>
                  {transaction.project?.description && (
                    <div className="td-stupid-project-desc">
                      {transaction.project.description}
                    </div>
                  )}
                </td>
                <td className="td-stupid-td">
                  <div className="td-stupid-amount">
                    {formatCurrency(transaction.amount)}
                  </div>
                </td>
                <td className="td-stupid-td">
                  <span className="td-stupid-payment-method">
                    {transaction.payment_method}
                  </span>
                </td>
                <td className="td-stupid-td">
                  <span className="td-stupid-date">
                    {formatDate(transaction.created_at)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionDetails;