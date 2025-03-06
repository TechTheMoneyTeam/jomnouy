import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import styles from './InvestmentForm.module.css';

const InvestmentForm = ({ 
    projectId, 
    fundingGoal, 
    onInvestmentSuccess,
    currentTotalInvested = 0 
}) => {
    const [userId, setUserId] = useState(null);
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                setUserId(user.user_id);
            } catch (parseError) {
                console.error('Error parsing user data from localStorage', parseError);
                setError('Unable to retrieve user information');
            }
        }
    }, []);

    const validateInvestment = useCallback((investmentAmount) => {
        // Comprehensive investment validation
        if (!userId) {
            setError('Please log in to invest');
            return false;
        }

        if (isNaN(investmentAmount) || investmentAmount <= 0) {
            setError('Please enter a valid investment amount');
            return false;
        }

        const remainingFunding = fundingGoal - currentTotalInvested;
        if (investmentAmount > remainingFunding) {
            setError(`Maximum investment cannot exceed remaining funding of $${remainingFunding.toLocaleString()}`);
            return false;
        }

        return true;
    }, [userId, fundingGoal, currentTotalInvested]);

    const handleInvest = async (e) => {
        e.preventDefault();
        
        setError('');
        setLoading(true);

        const investmentAmount = parseFloat(amount);

        if (!validateInvestment(investmentAmount)) {
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(`/api/projects/${projectId}/invest`, { 
                amount: investmentAmount,
                user_id: userId
            });

            if (onInvestmentSuccess) {
                onInvestmentSuccess(response.data);
            }

            setAmount('');
       
        } catch (err) {
            setError(
                err.response?.data?.error || 
                err.response?.data?.message || 
                'Failed to process your investment. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    const remainingFunding = fundingGoal - currentTotalInvested;
    const isInvestDisabled = loading || !userId || remainingFunding <= 0;

    return (
        <div className={styles.investmentForm}>
            <h3 className={styles.investmentFormTitle}>Invest in this Project</h3>
            <div className={styles.investmentFormDetails}>
                <span>Funding Goal: ${fundingGoal.toLocaleString()}</span>
                <span>Remaining: ${remainingFunding.toLocaleString()}</span>
            </div>
            <form onSubmit={handleInvest}>
                <div className="mb-4">
                    <label htmlFor="amount" className={styles.investmentFormLabel}>
                        Investment Amount (USD)
                    </label>
                    <input 
                        type="number" 
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className={styles.investmentFormInput}
                        placeholder="Enter investment amount"
                        min="1"
                        max={remainingFunding}
                        step="0.01"
                        required
                        disabled={isInvestDisabled}
                    />
                </div>
                {error && (
                    <div className={styles.investmentFormError}>
                        {error}
                    </div>
                )}
                {!userId && (
                    <div className={styles.investmentFormWarning}>
                        Please log in to invest in this project
                    </div>
                )}
                {remainingFunding <= 0 && (
                    <div className={styles.investmentFormError}>
                        Funding goal has been reached
                    </div>
                )}
                <button 
                    type="submit" 
                    disabled={isInvestDisabled}
                    className={`${styles.investmentFormButton} ${isInvestDisabled ? styles.investmentFormButtonDisabled : styles.investmentFormButtonEnabled}`}
                >
                    {loading ? 'Processing...' : 'Invest Now'}
                </button>
            </form>
        </div>
    );
};

export default InvestmentForm;