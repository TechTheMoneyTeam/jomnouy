import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

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
        <div className="investment-form mt-4 p-4 border rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Invest in this Project</h3>
            <div className="mb-4 flex justify-between text-sm">
                <span>Funding Goal: ${fundingGoal.toLocaleString()}</span>
                <span>Remaining: ${remainingFunding.toLocaleString()}</span>
            </div>
            <form onSubmit={handleInvest}>
                <div className="mb-4">
                    <label htmlFor="amount" className="block mb-2">
                        Investment Amount (USD)
                    </label>
                    <input 
                        type="number" 
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder="Enter investment amount"
                        min="1"
                        max={remainingFunding}
                        step="0.01"
                        required
                        disabled={isInvestDisabled}
                    />
                </div>
                {error && (
                    <div className="text-red-500 mb-4 text-sm">
                        {error}
                    </div>
                )}
                {!userId && (
                    <div className="text-yellow-600 mb-4 text-sm">
                        Please log in to invest in this project
                    </div>
                )}
                {remainingFunding <= 0 && (
                    <div className="text-red-500 mb-4 text-sm">
                        Funding goal has been reached
                    </div>
                )}
                <button 
                    type="submit" 
                    disabled={isInvestDisabled}
                    className={`w-full py-2 rounded-md transition ${
                        isInvestDisabled 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-orange-500 text-white hover:bg-orange-600'
                    }`}
                >
                    {loading ? 'Processing...' : 'Invest Now'}
                </button>
            </form>
        </div>
    );
};

export default InvestmentForm;