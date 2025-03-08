import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment'; // Import moment for date formatting

const InvestmentForm = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  
  const [formData, setFormData] = useState({
    project_id: '',
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
      setFormData(prev => ({ ...prev, user_id: user.user_id }));
      fetchProfileData(user.username);
    }
  }, []);

  // Fetch profile data function 
  const fetchProfileData = async (username) => {
    try {
      const response = await axios.get(`/api/users/${username}`);
      // Handle profile data if needed
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  // Fetch available projects when component mounts
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('/api/projects');
        setProjects(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // If project_id changed, find and set the selected project
    if (name === 'project_id') {
      const project = projects.find(p => p.project_id === parseInt(value));
      setSelectedProject(project || null);
      
      // If project has equity tiers, auto-calculate equity percentage based on investment amount
      if (project && project.equity_tiers && formData.amount) {
        calculateEquityPercentage(project, formData.amount);
      }
    }
    
    // If amount changed and project has equity tiers, recalculate equity
    if (name === 'amount' && selectedProject && selectedProject.equity_tiers) {
      calculateEquityPercentage(selectedProject, value);
    }
  };

  // Function to calculate equity percentage based on investment amount and equity tiers
  const calculateEquityPercentage = (project, amount) => {
    try {
      const equityTiers = JSON.parse(project.equity_tiers);
      // Find tier where amount is exactly at or above tier threshold
      const tier = equityTiers.find(t => parseFloat(amount) >= t.amount);
      if (tier) {
        setFormData(prev => ({ ...prev, equity_percentage: tier.equity_percentage }));
      }
    } catch (e) {
      console.error('Error parsing equity tiers', e);
    }
  };

  // Function to check if project is currently accepting investments
  const isProjectAcceptingInvestments = (project) => {
    if (!project) return false;
    
    const now = moment();
    const auctionStart = project.auction_start_date ? moment(project.auction_start_date) : null;
    const auctionEnd = project.auction_end_date ? moment(project.auction_end_date) : null;

    // If auction dates are set, check if current date is within range
    if (auctionStart && auctionEnd) {
      return now.isSameOrAfter(auctionStart) && now.isSameOrBefore(auctionEnd);
    }
    
    // Otherwise fall back to status check
    return project.status === 'active' || project.status === 'funding';
  };

  // Function to get auction status message
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
    console.log("Submitting data:", formData);
    setIsSubmitting(true);
    setErrors({});
    setSubmitMessage('');

    // Validation: Check if project is accepting investments
    if (selectedProject && !isProjectAcceptingInvestments(selectedProject)) {
      setSubmitMessage(`Failed to submit investment: ${getAuctionStatusMessage(selectedProject)}`);
      setIsSubmitting(false);
      return;
    }

    // Validation: Check if amount is less than funding goal
    if (selectedProject && parseFloat(formData.amount) < parseFloat(selectedProject.funding_goal)) {
      setErrors({
        ...errors,
        amount: `Investment amount must be at least equal to the funding goal of $${parseFloat(selectedProject.funding_goal).toLocaleString()}`
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Make the API request to create an investment
      const response = await axios.post('/api/investments', formData);

      setSubmitMessage('Investment submitted successfully!');
      // Reset form
      setFormData({
        project_id: '',
        user_id: userId, // Keep the user ID
        amount: '',
        equity_percentage: '',
        payment_method: '',
        investment_notes: '',
        investment_term: '1-5'
      });
      setSelectedProject(null);
    } catch (error) {
      console.error("Full error response:", error.response);
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else if (error.response && error.response.data.message) {
        setSubmitMessage(`Failed to submit investment: ${error.response.data.message}`);
      } else {
        setSubmitMessage('Failed to submit investment. Please check the form and try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate minimum investment amount
  const getMinimumInvestment = () => {
    if (selectedProject) {
      // Return the funding goal as the minimum investment
      return parseFloat(selectedProject.funding_goal);
    }
    return 0;
  };

  // Handle investment term selection
  const handleTermSelect = (term) => {
    setFormData({ ...formData, investment_term: term });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Invest in a Project</h2>
      
      {loading ? (
        <div className="text-center py-8">
          <p>Loading available projects...</p>
        </div>
      ) : (
        <>
          {submitMessage && (
            <div className={`p-4 mb-6 rounded-md ${submitMessage.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {submitMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Investment Information */}
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
                  <input
                    type="hidden"
                    name="user_id"
                    value={formData.user_id}
                  />
                </div>

                <div>
                  <label htmlFor="project_id" className="block text-sm font-medium text-gray-700 mb-1">Select Project *</label>
                  <select
                    id="project_id"
                    name="project_id"
                    value={formData.project_id}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select a project</option>
                    {projects.map(project => (
                      <option 
                        key={project.project_id} 
                        value={project.project_id}
                        disabled={!isProjectAcceptingInvestments(project)}
                      >
                        {project.title} ({isProjectAcceptingInvestments(project) ? 'Open' : 'Closed'})
                      </option>
                    ))}
                  </select>
                  {errors.project_id && <p className="mt-1 text-sm text-red-600">{errors.project_id}</p>}
                </div>
              </div>

              {selectedProject && (
                <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-100">
                  <h4 className="font-medium text-blue-800 mb-2">Selected Project: {selectedProject.title}</h4>
                  <p className="text-sm text-blue-700">Funding Goal: ${parseFloat(selectedProject.funding_goal).toLocaleString()}</p>
                  <p className="text-sm text-blue-700 font-semibold">Minimum Investment: ${parseFloat(selectedProject.funding_goal).toLocaleString()}</p>
                  {selectedProject.equity_offered && (
                    <p className="text-sm text-blue-700">Equity Offered: {selectedProject.equity_offered}%</p>
                  )}
                  {selectedProject.project_type && (
                    <p className="text-sm text-blue-700">Project Type: {selectedProject.project_type}</p>
                  )}
                  
                  {/* Auction status message */}
                  {getAuctionStatusMessage(selectedProject) && (
                    <p className={`text-sm mt-2 font-medium ${isProjectAcceptingInvestments(selectedProject) ? 'text-green-600' : 'text-red-600'}`}>
                      {getAuctionStatusMessage(selectedProject)}
                    </p>
                  )}
                </div>
              )}

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  {selectedProject && (
                    <p className="mt-1 text-xs text-gray-500">
                      Minimum investment: ${getMinimumInvestment().toLocaleString()}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="equity_percentage" className="block text-sm font-medium text-gray-700 mb-1">Equity Percentage (%)</label>
                  <input
                    type="number"
                    id="equity_percentage"
                    name="equity_percentage"
                    value={formData.equity_percentage}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    max="100"
                    step="0.01"
                    readOnly={selectedProject && selectedProject.equity_tiers}
                  />
                  {errors.equity_percentage && <p className="mt-1 text-sm text-red-600">{errors.equity_percentage}</p>}
                  {selectedProject && selectedProject.equity_tiers && (
                    <p className="mt-1 text-xs text-gray-500">
                      Auto-calculated based on investment amount
                    </p>
                  )}
                </div>
              </div>

              {/* Investment Term Buttons */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Investment Term *</label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    className={`py-2 px-4 rounded-md ${formData.investment_term === '1-5' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                    onClick={() => handleTermSelect('1-5')}
                  >
                    1-5 Years
                  </button>
                  <button
                    type="button"
                    className={`py-2 px-4 rounded-md ${formData.investment_term === '5-10' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                    onClick={() => handleTermSelect('5-10')}
                  >
                    5-10 Years
                  </button>
                  <button
                    type="button"
                    className={`py-2 px-4 rounded-md ${formData.investment_term === '10+' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                    onClick={() => handleTermSelect('10+')}
                  >
                    10+ Years
                  </button>
                </div>
              </div>
            </div>

            {/* Rest of the form remains the same */}
            {/* Payment Information */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-lg font-medium mb-4">Payment Information</h3>
              
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
                  <option value="credit_card">Credit Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="paypal">PayPal</option>
                  <option value="crypto">Cryptocurrency</option>
                  <option value="other">Other</option>
                </select>
                {errors.payment_method && <p className="mt-1 text-sm text-red-600">{errors.payment_method}</p>}
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
                {errors.investment_notes && <p className="mt-1 text-sm text-red-600">{errors.investment_notes}</p>}
              </div>
            </div>

            {/* Investment Summary */}
            {formData.project_id && formData.amount && (
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-lg font-medium mb-4">Investment Summary</h3>
                
                <div className="border-t border-b py-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Project:</span>
                    <span>{selectedProject ? selectedProject.title : 'Selected Project'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Investment Amount:</span>
                    <span>${parseFloat(formData.amount).toLocaleString()}</span>
                  </div>
                  {formData.equity_percentage && (
                    <div className="flex justify-between">
                      <span className="font-medium">Equity Percentage:</span>
                      <span>{formData.equity_percentage}%</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="font-medium">Investment Term:</span>
                    <span>{formData.investment_term === '1-5' ? '1-5 Years' : 
                          formData.investment_term === '5-10' ? '5-10 Years' : '10+ Years'}</span>
                  </div>
                  {selectedProject && selectedProject.return_1_5_years && formData.investment_term === '1-5' && (
                    <div className="flex justify-between">
                      <span className="font-medium">Projected Return (1-5 years):</span>
                      <span>{selectedProject.return_1_5_years}%</span>
                    </div>
                  )}
                  {selectedProject && selectedProject.return_5_10_years && formData.investment_term === '5-10' && (
                    <div className="flex justify-between">
                      <span className="font-medium">Projected Return (5-10 years):</span>
                      <span>{selectedProject.return_5_10_years}%</span>
                    </div>
                  )}
                  {selectedProject && selectedProject.return_10_plus_years && formData.investment_term === '10+' && (
                    <div className="flex justify-between">
                      <span className="font-medium">Projected Return (10+ years):</span>
                      <span>{selectedProject.return_10_plus_years}%</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-medium">Payment Method:</span>
                    <span>{formData.payment_method || 'Not selected'}</span>
                  </div>
                </div>
                
                <p className="mt-4 text-sm text-gray-500">
                  By submitting this investment, you agree to all terms and conditions associated with this project. 
                  Your investment will be pending until approved by the project owner.
                </p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || (selectedProject && !isProjectAcceptingInvestments(selectedProject))}
                className={`px-6 py-2 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${(isSubmitting || (selectedProject && !isProjectAcceptingInvestments(selectedProject))) ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Investment'}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default InvestmentForm;