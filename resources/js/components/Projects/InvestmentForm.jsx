import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';

const InvestmentForm = ({
  projectId,
  fundingGoal,
  currentTotalInvested,
  kycData,
  onInvestmentSuccess
}) => {
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState(null);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [baseEquity, setBaseEquity] = useState(0);
  const [additionalEquity, setAdditionalEquity] = useState(0);

  const [formData, setFormData] = useState({
    project_id: projectId || '',
    user_id: '',
    amount: '',
    equity_percentage: '',
    payment_method: '',
    investment_notes: '',
    investment_term: '1-5'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  // Fetch user from localStorage and get profile data
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setUsername(user.username);
      setUserId(user.user_id);
      setFormData(prev => ({
        ...prev,
        user_id: user.user_id,
        project_id: projectId
      }));
    }
  }, [projectId]);

  // Fetch project details when component mounts
  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!projectId) return;

      setLoading(true);
      try {
        const response = await axios.get(`/api/projects/${projectId}`);
        setProject(response.data);

        // If we have funding goal from props, use it, otherwise use from API
        const goal = fundingGoal || response.data.funding_goal;

        // Pre-calculate equity if project has equity_offered
        if (response.data.equity_offered) {
          setBaseEquity(parseFloat(response.data.equity_offered));
        }
      } catch (error) {
        console.error('Error fetching project details:', error);
        setSubmitMessage('Error loading project details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId, fundingGoal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // If amount changed and we have a project, recalculate equity
    if (name === 'amount' && project) {
      calculateEquityPercentage(project, value);
    }
  };

  // Function to calculate equity percentage
  const calculateEquityPercentage = (project, amount) => {
    try {
      // Parse the amount as float for calculations
      const investmentAmount = parseFloat(amount);
      if (isNaN(investmentAmount)) return;

      // Get base equity from project.equity_offered
      let baseEquityValue = 0;

      if (project.equity_offered) {
        baseEquityValue = parseFloat(project.equity_offered);
      } else if (project.equity_tiers) {
        try {
          const equityTiers = JSON.parse(project.equity_tiers);
          if (Array.isArray(equityTiers)) {
            // Find the highest qualifying tier
            let highestQualifyingTier = null;
            for (const tier of equityTiers) {
              if (investmentAmount >= parseFloat(tier.amount)) {
                if (!highestQualifyingTier || parseFloat(tier.amount) > parseFloat(highestQualifyingTier.amount)) {
                  highestQualifyingTier = tier;
                }
              }
            }

            if (highestQualifyingTier) {
              baseEquityValue = parseFloat(highestQualifyingTier.equity_percentage);
            }
          }
        } catch (e) {
          console.error('Error parsing equity tiers', e);
        }
      }

      setBaseEquity(baseEquityValue);

      // Calculate additional equity for amounts over funding goal
      let additionalEquityValue = 0;
      const projectFundingGoal = parseFloat(fundingGoal || project.funding_goal);

      if (investmentAmount > projectFundingGoal) {
        const amountOverFundingGoal = investmentAmount - projectFundingGoal;

        // Get equity per dollar
        const equityPerDollar = baseEquityValue / projectFundingGoal;

        // Calculate additional equity
        additionalEquityValue = equityPerDollar * amountOverFundingGoal;
      }

      setAdditionalEquity(additionalEquityValue);

      // Calculate total equity
      const totalEquity = baseEquityValue + additionalEquityValue;

      // Update form data
      setFormData(prev => ({ ...prev, equity_percentage: totalEquity.toFixed(2) }));
    } catch (e) {
      console.error('Error calculating equity percentage', e);
    }
  };

  // Function to check if project is accepting investments
  const isProjectAcceptingInvestments = (project) => {
    if (!project) return false;

    const now = moment();
    const auctionStart = project.auction_start_date ? moment(project.auction_start_date) : null;
    const auctionEnd = project.auction_end_date ? moment(project.auction_end_date) : null;

    // Check if within auction dates
    if (auctionStart && auctionEnd) {
      return now.isSameOrAfter(auctionStart) && now.isSameOrBefore(auctionEnd);
    }

    // Fall back to status check
    return project.status === 'active' || project.status === 'funding';
  };

  // Get auction status message
  const getAuctionStatusMessage = (project) => {
    if (!project) return '';

    const now = moment();
    const auctionStart = project.auction_start_date ? moment(project.auction_start_date) : null;
    const auctionEnd = project.auction_end_date ? moment(project.auction_end_date) : null;

    if (auctionStart && auctionEnd) {
      if (now.isBefore(auctionStart)) {
        return `This project will be open for investment on ${auctionStart.format('MMM D, YYYY')}`;
      }
      if (now.isAfter(auctionEnd)) {
        return `This project is no longer accepting investments. Auction ended on ${auctionEnd.format('MMM D, YYYY')}`;
      }
      return `Auction ends on ${auctionEnd.format('MMM D, YYYY')}`;
    }

    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    setSubmitMessage('');
    console.log("Form data being submitted:", formData);

    // Validation: Check if project is accepting investments
    if (project && !isProjectAcceptingInvestments(project)) {
      setSubmitMessage(`Failed to submit investment: ${getAuctionStatusMessage(project)}`);
      setIsSubmitting(false);
      return;
    }

    // Validation: Check if KYC is completed if required
    if (project && project.require_kyc && (!kycData || kycData.status !== 'approved')) {
      setSubmitMessage('KYC verification is required before investing in this project.');
      setIsSubmitting(false);
      return;
    }

    // Validation: Check minimum investment amount
    const minInvestment = getMinimumInvestment();
    if (parseFloat(formData.amount) < minInvestment) {
      setErrors({
        ...errors,
        amount: `Investment amount must be at least $${minInvestment.toLocaleString()}`
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Make the API request to create an investment
      const response = await axios.post('/api/investments', formData);

      // Call the success callback with the investment data
      if (onInvestmentSuccess) {
        onInvestmentSuccess({
          investment_id: response.data.investment_id,
          amount: parseFloat(formData.amount),
          equity_percentage: formData.equity_percentage,
          payment_method: formData.payment_method
        });
      }
    } catch (error) {
      console.error("Investment submission error:", error.response);
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else if (error.response && error.response.data.message) {
        setSubmitMessage(`Failed to submit investment: ${error.response.data.message}`);
      } else {
        setSubmitMessage('Failed to submit investment. Please check the form and try again.');
      }
      setIsSubmitting(false);
    }
  };

  // Calculate minimum investment amount
  const getMinimumInvestment = () => {
    if (project) {
      return parseFloat(project.minimum_investment || fundingGoal || project.funding_goal || 0);
    }
    return parseFloat(fundingGoal || 0);
  };

  // Handle investment term selection
  const handleTermSelect = (term) => {
    setFormData({ ...formData, investment_term: term });
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-center py-8">
          <div className="spinner"></div>
          <p className="mt-2">Loading investment details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Invest in {project?.title || 'Project'}</h2>

      {submitMessage && (
        <div className={`p-4 mb-6 rounded-md ${submitMessage.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {submitMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Investment Details */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-medium mb-4">Investment Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Investor</label>
              <input
                type="text"
                value={username}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                disabled
              />
              <input type="hidden" name="user_id" value={formData.user_id} />
              <input type="hidden" name="project_id" value={formData.project_id} />
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Investment Amount ($) *</label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min={getMinimumInvestment()}
                step="0.01"
                required
              />
              {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount}</p>}
              {project && (
                <p className="mt-1 text-xs text-gray-500">
                  Minimum investment: ${getMinimumInvestment().toLocaleString()}
                </p>
              )}
            </div>
          </div>

          {project && (
            <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-100">
              <h4 className="font-medium text-blue-800 mb-2">Project: {project.title}</h4>
              <p className="text-sm text-blue-700">Funding Goal: ${parseFloat(project.funding_goal).toLocaleString()}</p>
              <p className="text-sm text-blue-700">Current Funding: ${currentTotalInvested ? parseFloat(currentTotalInvested).toLocaleString() : '0'}</p>
              {project.equity_offered && (
                <p className="text-sm text-blue-700">Equity Offered: {project.equity_offered}%</p>
              )}

              {/* Auction status message */}
              {getAuctionStatusMessage(project) && (
                <p className={`text-sm mt-2 font-medium ${isProjectAcceptingInvestments(project) ? 'text-green-600' : 'text-red-600'}`}>
                  {getAuctionStatusMessage(project)}
                </p>
              )}
            </div>
          )}

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="equity_percentage" className="block text-sm font-medium text-gray-700 mb-1">Equity Percentage (%)</label>
              <input
                type="number"
                id="equity_percentage"
                name="equity_percentage"
                value={formData.equity_percentage}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                readOnly
              />
              <p className="mt-1 text-xs text-gray-500">
                Auto-calculated based on investment amount
              </p>
            </div>

            <div>
              <label htmlFor="payment_method" className="block text-sm font-medium text-gray-700 mb-1">Payment Method *</label>
              <select
                id="payment_method"
                name="payment_method"
                value={formData.payment_method}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select payment method</option>
                <option value="aba_bank">ABA Bank</option>

              </select>
              {errors.payment_method && <p className="mt-1 text-sm text-red-600">{errors.payment_method}</p>}
            </div>
          </div>
          <input 
  type="hidden" 
  name="investment_term" 
  value={formData.investment_term} 
/>

          {/* Investment Term Buttons */}
          <div className="mt-4">
  <label className="block text-sm font-medium text-gray-700 mb-2">Investment Term *</label>
  <div className="flex px-5">
    <button
      type="button"
      className={`py-2 px-4 rounded-md transition-colors duration-200 ${
        formData.investment_term === '1-5'
          ? 'bg-custom-orange text-white' 
          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
      }`}
      onClick={() => handleTermSelect('1-5')}
    >
      1-5 Years
    </button>
    <button
      type="button"
      className={`py-2 px-4 rounded-md ml-4 transition-colors duration-200 ${
        formData.investment_term === '5-10'
          ? 'bg-custom-orange text-white' 
          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
      }`}
      onClick={() => handleTermSelect('5-10')}
    >
      5-10 Years
    </button>
    <button
      type="button"
      className={`py-2 px-4 rounded-md ml-4 transition-colors duration-200 ${
        formData.investment_term === '10+'
          ? 'bg-custom-orange text-white' 
          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
      }`}
      onClick={() => handleTermSelect('10+')}
    >
      10+ Years
    </button>
  </div>
</div>

          <div className="mt-4">
            <label htmlFor="investment_notes" className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
            <textarea
              id="investment_notes"
              name="investment_notes"
              value={formData.investment_notes}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength="1000"
              placeholder="Any additional information about your investment..."
            ></textarea>
          </div>
        </div>

        {/* Investment Summary */}
        {formData.amount && (
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-medium mb-4">Investment Summary</h3>

            <div className="border-t border-b py-4 space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Project:</span>
                <span>{project ? project.title : 'Selected Project'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Investment Amount:</span>
                <span>${parseFloat(formData.amount).toLocaleString()}</span>
              </div>
              {formData.equity_percentage && project && (
                <div className="mt-2 text-sm text-gray-600 border-t pt-2">
                  <p className="font-medium">Equity Calculation:</p>
                  {parseFloat(formData.amount) > parseFloat(project.funding_goal) ? (
                    <>
                      <p>Base equity: {baseEquity.toFixed(2)}%</p>
                      <p>Additional equity: {additionalEquity.toFixed(2)}%</p>
                      <p className="font-medium">Total equity: {formData.equity_percentage}%</p>
                    </>
                  ) : (
                    <p>Base equity: {formData.equity_percentage}%</p>
                  )}
                </div>
              )}
              <div className="flex justify-between">
                <span className="font-medium">Investment Term:</span>
                <span>{formData.investment_term === '1-5' ? '1-5 Years' :
                  formData.investment_term === '5-10' ? '5-10 Years' : '10+ Years'}</span>
              </div>
              {project && project.return_1_5_years && formData.investment_term === '1-5' && (
                <div className="flex justify-between">
                  <span className="font-medium">Projected Return (1-5 years):</span>
                  <span>{project.return_1_5_years}%</span>
                </div>
              )}
              {project && project.return_5_10_years && formData.investment_term === '5-10' && (
                <div className="flex justify-between">
                  <span className="font-medium">Projected Return (5-10 years):</span>
                  <span>{project.return_5_10_years}%</span>
                </div>
              )}
              {project && project.return_10_plus_years && formData.investment_term === '10+' && (
                <div className="flex justify-between">
                  <span className="font-medium">Projected Return (10+ years):</span>
                  <span>{project.return_10_plus_years}%</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t">
                <span className="font-medium">Payment Method:</span>
                <span>{formData.payment_method ? formData.payment_method.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Not selected'}</span>
              </div>
            </div>

            <p className="mt-4 text-sm text-gray-500">
              By submitting this investment, you agree to all terms and conditions associated with this project.
              You will be taken to a payment page to complete your transaction.
            </p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || (project && !isProjectAcceptingInvestments(project))}
            className={`px-6 py-2 bg-custom-orange text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${(isSubmitting || (project && !isProjectAcceptingInvestments(project))) ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Processing...' : 'Continue to Payment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvestmentForm;