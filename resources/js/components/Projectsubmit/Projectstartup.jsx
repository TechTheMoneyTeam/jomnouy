import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar3 from '../Navbar/Navbarcreate';
import styles from './Projectupload.module.css';
import { toast, Toaster } from 'sonner';  
import { useNavigate } from 'react-router-dom';

const ProjectStartup = () => {

    const projectLocations = [
        'Phnom Penh, Cambodia',
        'Siem Reap, Cambodia',
        'Battambang, Cambodia',
        'Sihanoukville, Cambodia',
        'Kampot, Cambodia',
        'Kep, Cambodia',
        'Kampong Cham, Cambodia',
        'Kampong Thom, Cambodia',
        'Kratie, Cambodia',
        'Stung Treng, Cambodia',
        'Banlung, Cambodia',
        'Kampong Chhnang, Cambodia',
        'Pursat, Cambodia',
        'Pailin, Cambodia',
        'Poipet, Cambodia',
        'Svay Rieng, Cambodia',
        'Prey Veng, Cambodia',
        'Takeo, Cambodia',
        'Kampong Speu, Cambodia',
        'Preah Vihear, Cambodia',
        'Mondulkiri, Cambodia',
        'Koh Kong, Cambodia',
        'Oddar Meanchey, Cambodia',
        'Tbong Khmum, Cambodia',
        'Kandal, Cambodia',
        'Outside Cambodia'
    ];

    const projectCategories = [
        'Technology', 'Art', 'Design', 'Film', 'Music', 'Publishing',
        'Games', 'Food', 'Fashion', 'Crafts', 'Photography', 'Comics',
        'Illustration', 'Theater', 'Education', 'Health', 'Environment'
    ];

    const [formData, setFormData] = useState({
        user_id: '',
        title: '',
        funding_goal: '',
        project_type: 'Start-up Project',
        project_des: '',
        project_story: '',
        project_location: '',
        reserve_price: '',
        categories: '',
        auction_start_date: '',
        auction_end_date: '',
        member_name: '',
        member_position: '',
        equity_offered: '',
        equity_tiers: JSON.stringify([{ amount: '', equity_percentage: '' }]),
        return_1_5_years: '',
        return_5_10_years: '',
        return_10_plus_years: ''
    });

    const [equityTiers, setEquityTiers] = useState([{ amount: '', equity_percentage: '' }]);
    const [projectImg, setProjectImg] = useState(null);
    const [projectVideo, setProjectVideo] = useState(null);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [currentUser, setCurrentUser] = useState(null);
    const [previewImg, setPreviewImg] = useState(null);
    const [previewVideo, setPreviewVideo] = useState(null);
    const [currentStep, setCurrentStep] = useState('basic');
    const navigate = useNavigate();

    // Get logged in user on component mount
    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem('user'));
        if (loggedInUser) {
            setCurrentUser(loggedInUser);
            setFormData(prevData => ({
                ...prevData,
                user_id: loggedInUser.user_id
            }));
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleEquityTierChange = (index, field, value) => {
        const updatedTiers = [...equityTiers];
        updatedTiers[index][field] = value;
        setEquityTiers(updatedTiers);

        // Update the JSON string in formData
        setFormData(prevData => ({
            ...prevData,
            equity_tiers: JSON.stringify(updatedTiers)
        }));
    };

    const addEquityTier = () => {
        const updatedTiers = [...equityTiers, { amount: '', equity_percentage: '' }];
        setEquityTiers(updatedTiers);

        // Update the JSON string in formData
        setFormData(prevData => ({
            ...prevData,
            equity_tiers: JSON.stringify(updatedTiers)
        }));
    };

    const removeEquityTier = (index) => {
        if (equityTiers.length > 1) {
            const updatedTiers = equityTiers.filter((_, i) => i !== index);
            setEquityTiers(updatedTiers);

            // Update the JSON string in formData
            setFormData(prevData => ({
                ...prevData,
                equity_tiers: JSON.stringify(updatedTiers)
            }));
        }
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;

        if (name === 'project_img') {
            setProjectImg(files[0]);
            // Create preview URL for image
            if (files[0]) {
                setPreviewImg(URL.createObjectURL(files[0]));
            } else {
                setPreviewImg(null);
            }
        } else if (name === 'project_video') {
            setProjectVideo(files[0]);
            // Create preview URL for video
            if (files[0]) {
                setPreviewVideo(URL.createObjectURL(files[0]));
            } else {
                setPreviewVideo(null);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });

        try {
            // Create FormData object for handling file uploads
            const submitFormData = new FormData();

            // Add all form fields to FormData
            Object.keys(formData).forEach(key => {
                submitFormData.append(key, formData[key]);
            });

            // Add files if they exist
            if (projectImg) {
                submitFormData.append('project_img', projectImg);
            }

            if (projectVideo) {
                submitFormData.append('project_video', projectVideo);
            }

            const response = await axios.post('/api/projects', submitFormData, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                }
            });
            toast.success(response.data.message || "Project uploaded successfully!");
            setTimeout(() => {
                navigate('/projectlist1'); // Replace with your actual navigation function
            }, 2000);


            // setMessage({
            //     text: 'Project submitted successfully!',
            //     type: 'success'
            // });

            setFormData({
                user_id: currentUser?.user_id || '',
                title: '',
                funding_goal: '',
                project_type: '',
                project_des: '',
                project_story: '',
                project_location: '',
                reserve_price: '',
                categories: '',
                member_name: '',
                member_position: '',
                auction_start_date: '',
                auction_end_date: '',
                equity_offered: '',
                equity_tiers: JSON.stringify([{ amount: '', equity_percentage: '' }]),
                return_1_5_years: '',
                return_5_10_years: '',
                return_10_plus_years: ''
            });

            // Reset equity tiers
            setEquityTiers([{ amount: '', equity_percentage: '' }]);

            // Clear file states and previews
            setProjectImg(null);
            setProjectVideo(null);
            setPreviewImg(null);
            setPreviewVideo(null);

            console.log('Project submitted:', response.data);
        } catch (error) {
            // setMessage({
            //     text: error.response?.data?.message || 'Error submitting project!',
            //     type: 'error'
            // });
            toast.error("Error uploading project. Please try again.");

            console.error('Submission error:', error.response?.data);
        }
    };

    // Clean up object URLs when component unmounts
    useEffect(() => {
        return () => {
            if (previewImg) URL.revokeObjectURL(previewImg);
            if (previewVideo) URL.revokeObjectURL(previewVideo);
        };
    }, [previewImg, previewVideo]);

    // Navigation between steps
    const handleStepChange = (step) => {
        setCurrentStep(step);
    };

    const handleNext = () => {
        if (currentStep === 'basic') setCurrentStep('funding');
        else if (currentStep === 'funding') setCurrentStep('equity');
        else if (currentStep === 'equity') setCurrentStep('story');
        else if (currentStep === 'story') setCurrentStep('add_member');
    };

    // Redirect to login if no user is logged in
    if (!currentUser) {
        return (
            <div className={styles.formContainer}>
                <h2 className={styles.loginMessage}>You must be logged in to submit a project</h2>
                <Link to="/login" className={styles.loginButton}>
                    Go to Login
                </Link>
            </div>
        );
    }

    return (
        <>
            <Navbar3 />
            <Toaster richColors position="top-center" duration={3000} />
            <div className={styles.formWrapper}>
                {/* Progress tabs */}
                <div className={styles.progressTabs}>
                    <button
                        className={`${styles.tabButton} ${currentStep === 'basic' ? styles.activeTab : ''}`}
                        onClick={() => handleStepChange('basic')}
                    >
                        Basic
                    </button>
                    <button
                        className={`${styles.tabButton} ${currentStep === 'funding' ? styles.activeTab : ''}`}
                        onClick={() => handleStepChange('funding')}
                    >
                        Funding
                    </button>
                    <button
                        className={`${styles.tabButton} ${currentStep === 'equity' ? styles.activeTab : ''}`}
                        onClick={() => handleStepChange('equity')}
                    >
                        Equity
                    </button>
                    <button
                        className={`${styles.tabButton} ${currentStep === 'story' ? styles.activeTab : ''}`}
                        onClick={() => handleStepChange('story')}
                    >
                        Story
                    </button>
                    <button
                        className={`${styles.tabButton} ${currentStep === 'add_member' ? styles.activeTab : ''}`}
                        onClick={() => handleStepChange('add_member')}
                    >
                        Add Member
                    </button>
                </div>

                {message.text && (
                    <div className={`${styles.message} ${message.type === 'success' ? styles.successMessage : styles.errorMessage}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Basic Information Section */}
                    {currentStep === 'basic' && (
                        <div className={styles.formSection}>
                            <h2 className={styles.sectionTitle}>Start with Basic</h2>
                            <p className={styles.sectionDescription}>
                                Ensure your project is easily accessible to potential supporters.
                            </p>

                            <div className={styles.fieldGroup}>
                                <div className={styles.fieldLabel}>
                                    <h3>Project title</h3>
                                    <p className={styles.fieldDescription}>
                                        Write a clear, brief title to help people quickly understand your project.
                                        It will appear on your project page and in search results.
                                    </p>
                                </div>
                                <div className={styles.fieldInput}>
                                    <label className={styles.inputLabel}>Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className={styles.textInput}
                                        placeholder="Enter your project title"
                                        required
                                    />

                                    <label className={styles.inputLabel}>Description</label>
                                    <textarea
                                        name="project_des"
                                        value={formData.project_des}
                                        onChange={handleChange}
                                        className={styles.textareaInput}
                                        placeholder="Describe your project..."
                                        rows="4"
                                        required
                                    />
                                </div>
                            </div>

                            <div className={styles.fieldGroup}>
                                <div className={styles.fieldLabel}>
                                    <h3>Project Category</h3>
                                    <p className={styles.fieldDescription}>
                                        Choose a category to help backers find your project.
                                    </p>
                                </div>
                                <div className={styles.fieldInput}>
                                    <label className={styles.inputLabel}>Category</label>
                                    <div className={styles.selectWrapper}>
                                        <select
                                            name="categories"
                                            value={formData.categories}
                                            onChange={handleChange}
                                            className={styles.selectInput}
                                            required
                                        >
                                            <option value="">Select a category</option>
                                            {projectCategories.map((category) => (
                                                <option key={category} value={category}>
                                                    {category}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.fieldGroup}>
                                <div className={styles.fieldLabel}>
                                    <h3>Project location</h3>
                                    <p className={styles.fieldDescription}>
                                        Enter the location that best describes where your project is based.
                                    </p>
                                </div>
                                <div className={styles.fieldInput}>
                                    <label className={styles.inputLabel}>Location</label>
                                    <div className={styles.selectWrapper}>
                                        <select
                                            name="project_location"
                                            value={formData.project_location}
                                            onChange={handleChange}
                                            className={styles.selectInput}
                                            required
                                        >
                                            <option value="">Select a location</option>
                                            {projectLocations.map((location) => (
                                                <option key={location} value={location}>
                                                    {location}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.fieldGroup}>
                                <div className={styles.fieldLabel}>
                                    <h3>Project image</h3>
                                    <p className={styles.fieldDescription}>
                                        Choose a clear and eye-catching image for your project.
                                        Make sure it looks good in different sizes since it will be
                                        displayed in various places.
                                    </p>
                                    <p className={styles.imageSizeDescription}>
                                        Your image should be at least 1024x576 pixels and will be
                                        cropped to a 16:9 ratio.
                                    </p>
                                </div>
                                <div className={styles.fieldInput}>
                                    <div className={styles.uploadBox}>
                                        {previewImg ? (
                                            <img src={previewImg} alt="Preview" className={styles.imagePreview} />
                                        ) : (
                                            <div className={styles.uploadPlaceholder}>
                                                <div className={styles.uploadIcon}>
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M12 16L12 8" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M9 11L12 8 15 11" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M8 16H16" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                                <span>Upload an image</span>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            name="project_img"
                                            onChange={handleFileChange}
                                            accept="image/*"
                                            className={styles.fileInput}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className={styles.fieldGroup}>
                                <div className={styles.fieldLabel}>
                                    <h3>Project video (Optional)</h3>
                                    <p className={styles.fieldDescription}>
                                        Add a video that showcases your project.
                                        A short video can help explain what your project is,
                                        how you plan to make it happen, why you are,
                                        and why you care about this project.
                                    </p>
                                </div>
                                <div className={styles.fieldInput}>
                                    <div className={styles.uploadBox}>
                                        {previewVideo ? (
                                            <video
                                                src={previewVideo}
                                                controls
                                                className={styles.videoPreview}
                                            />
                                        ) : (
                                            <div className={styles.uploadPlaceholder}>
                                                <div className={styles.uploadIcon}>
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M12 16L12 8" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M9 11L12 8 15 11" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M8 16H16" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                                <span>Upload a video</span>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            name="project_video"
                                            onChange={handleFileChange}
                                            accept="video/*"
                                            className={styles.fileInput}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className={styles.fieldGroup}>
                                <div className={styles.fieldLabel}>
                                    <h3>Auction duration</h3>
                                    <p className={styles.fieldDescription}>
                                        Set a time limit for your project.
                                    </p>
                                </div>
                                <div className={styles.fieldInput}>
                                    <div className={styles.datePickerContainer}>
                                        <div className={styles.datePicker}>
                                            <label className={styles.inputLabel}>Start date</label>
                                            <div className={styles.dateInputWrapper}>
                                                <input
                                                    type="date"
                                                    name="auction_start_date"
                                                    value={formData.auction_start_date}
                                                    onChange={handleChange}
                                                    className={styles.dateInput}
                                                    required
                                                />
                                                <span className={styles.calendarIcon}>📅</span>
                                            </div>
                                        </div>
                                        <div className={styles.datePicker}>
                                            <label className={styles.inputLabel}>End date</label>
                                            <div className={styles.dateInputWrapper}>
                                                <input
                                                    type="date"
                                                    name="auction_end_date"
                                                    value={formData.auction_end_date}
                                                    onChange={handleChange}
                                                    className={styles.dateInput}
                                                    min={formData.auction_start_date}
                                                    required
                                                />
                                                <span className={styles.calendarIcon}>📅</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className={styles.buttonContainer}>
                                <button type="button" onClick={handleNext} className={styles.nextButton}>
                                    Next
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Funding Section */}
                    {currentStep === 'funding' && (
                        <div className={styles.formSection}>
                            <h2 className={styles.sectionTitle}>Funding Details</h2>

                            <div className={styles.fieldGroup}>
                                <div className={styles.fieldLabel}>
                                    <h3>Funding Goal</h3>
                                    <p className={styles.fieldDescription}>
                                        Set the amount you need to bring your project to life.
                                    </p>
                                </div>
                                <div className={styles.fieldInput}>
                                    <label className={styles.inputLabel}>Funding Goal</label>
                                    <div className={styles.inputWithCurrency}>
                                        <span className={styles.currencyPrefix}>$</span>
                                        <input
                                            type="text"
                                            name="funding_goal"
                                            value={formData.funding_goal ? formData.funding_goal.toLocaleString() : ''}
                                            onChange={(e) => {
                                                // Remove commas and convert to number
                                                const value = e.target.value.replace(/,/g, '');
                                                handleChange({
                                                    target: {
                                                        name: 'funding_goal',
                                                        value: value ? parseFloat(value) : ''
                                                    }
                                                });
                                            }}
                                            className={styles.textInput}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>



                            <div className={styles.buttonContainer}>
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className={styles.nextButton}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                    {/* Equity Section - Modified */}
                    {currentStep === 'equity' && (
                        <div className={styles.formSection}>
                            <h2 className={styles.sectionTitle}>Equity Details</h2>
                            <p className={styles.sectionDescription}>
                                Define the equity structure for your project and expected returns.
                            </p>

                            <div className={styles.fieldGroup}>
                                <div className={styles.fieldLabel}>
                                    <h3>Equity Offered</h3>
                                    <p className={styles.fieldDescription}>
                                        The total percentage of equity you're offering to investors.
                                    </p>
                                </div>
                                <div className={styles.fieldInput}>
                                    <label className={styles.inputLabel}>Total Equity Percentage</label>
                                    <div className={styles.inputWithSuffix}>
                                        <input
                                            type="number"
                                            name="equity_offered"
                                            value={formData.equity_offered}
                                            onChange={handleChange}
                                            className={styles.textInput}
                                            min="0"
                                            max="100"
                                            step="0.01"
                                            required
                                        />
                                        <span className={styles.percentSuffix}>%</span>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.fieldGroup}>
                                <div className={styles.fieldLabel}>
                                    <h3>Equity Tiers</h3>
                                    <p className={styles.fieldDescription}>
                                        Define different investment tiers and the equity percentage offered for each.
                                        <br />
                                        <span className={styles.highlightText}>
                                            Total funding goal: ${formData.funding_goal ? formData.funding_goal.toLocaleString() : '0'}
                                        </span>
                                    </p>
                                </div>
                                <div className={styles.fieldInput}>
                                    {equityTiers.map((tier, index) => (
                                        <div key={index} className={styles.equityTierItem}>
                                            <div className={styles.tierHeader}>
                                                <h4>Tier {index + 1}</h4>
                                                {index > 0 && (
                                                    <button
                                                        type="button"
                                                        className={styles.removeTierButton}
                                                        onClick={() => removeEquityTier(index)}
                                                    >
                                                        Remove
                                                    </button>
                                                )}
                                            </div>
                                            <div className={styles.tierInputGroup}>
                                                <div className={styles.tierInput}>
                                                    <label className={styles.inputLabel}>Investment Amount</label>
                                                    <div className={styles.inputWithCurrency}>
                                                        <span className={styles.currencyPrefix}>$</span>
                                                        <input
                                                            type="text"
                                                            value={tier.amount ? tier.amount.toLocaleString() : ''}
                                                            onChange={(e) => {
                                                                const value = e.target.value.replace(/,/g, '');
                                                                const newAmount = value ? parseFloat(value) : 0;

                                                                // Update the tier amount
                                                                const updatedTier = { ...tier, amount: newAmount };

                                                                // Calculate equity percentage based on funding goal
                                                                if (formData.funding_goal && formData.funding_goal > 0) {
                                                                    updatedTier.equity_percentage = (
                                                                        (newAmount / formData.funding_goal) * formData.equity_offered
                                                                    ).toFixed(2);
                                                                }

                                                                // Update the tier with new values
                                                                const newTiers = [...equityTiers];
                                                                newTiers[index] = updatedTier;
                                                                setEquityTiers(newTiers);

                                                                // Update formData with JSON string of tiers
                                                                setFormData({
                                                                    ...formData,
                                                                    equity_tiers: JSON.stringify(newTiers)
                                                                });
                                                            }}
                                                            className={styles.textInput}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className={styles.tierInput}>
                                                    <label className={styles.inputLabel}>Equity Percentage</label>
                                                    <div className={styles.inputWithSuffix}>
                                                        <input
                                                            type="number"
                                                            value={tier.equity_percentage}
                                                            onChange={(e) => {
                                                                const newPercentage = parseFloat(e.target.value);

                                                                // Update the tier equity percentage
                                                                const updatedTier = { ...tier, equity_percentage: newPercentage };

                                                                // Calculate amount based on equity percentage and funding goal
                                                                if (formData.funding_goal && formData.funding_goal > 0 && formData.equity_offered > 0) {
                                                                    updatedTier.amount = (
                                                                        (newPercentage / formData.equity_offered) * formData.funding_goal
                                                                    ).toFixed(2);
                                                                }

                                                                // Update the tier with new values
                                                                const newTiers = [...equityTiers];
                                                                newTiers[index] = updatedTier;
                                                                setEquityTiers(newTiers);

                                                                // Update formData with JSON string of tiers
                                                                setFormData({
                                                                    ...formData,
                                                                    equity_tiers: JSON.stringify(newTiers)
                                                                });
                                                            }}
                                                            className={styles.textInput}
                                                            min="0"
                                                            max={formData.equity_offered || 100}
                                                            step="0.01"
                                                            required
                                                        />
                                                        <span className={styles.percentSuffix}>%</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Calculation info display */}
                                            <div className={styles.tierInfoText}>
                                                {formData.funding_goal && tier.amount ? (
                                                    <div className={styles.calculationInfo}>
                                                        <p>
                                                            ${parseFloat(tier.amount).toLocaleString()} investment = {tier.equity_percentage}% equity
                                                        </p>
                                                        {formData.equity_offered > 0 && (
                                                            <p>
                                                                This represents {((tier.equity_percentage / formData.equity_offered) * 100).toFixed(1)}%
                                                                of your total offered equity ({formData.equity_offered}%)
                                                            </p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <p className={styles.infoMessage}>
                                                        Set funding goal and investment amount to see equity calculation
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    <button
                                        type="button"
                                        className={styles.addTierButton}
                                        onClick={() => {
                                            // Add a new tier with default values
                                            const newTier = {
                                                amount: 0,
                                                equity_percentage: 0
                                            };

                                            const newTiers = [...equityTiers, newTier];
                                            setEquityTiers(newTiers);

                                            // Update formData with JSON string of tiers
                                            setFormData({
                                                ...formData,
                                                equity_tiers: JSON.stringify(newTiers)
                                            });
                                        }}
                                    >
                                        + Add Another Tier
                                    </button>

                                    {/* Equity allocation summary */}
                                    <div className={styles.equitySummary}>
                                        <div className={styles.summaryBox}>
                                            <p>
                                                <strong>Total allocated:</strong>
                                                {equityTiers.reduce((sum, tier) => sum + parseFloat(tier.equity_percentage || 0), 0).toFixed(2)}%
                                                of {formData.equity_offered || 0}% offered equity
                                            </p>

                                            {/* Show warning if allocation exceeds total offered */}
                                            {equityTiers.reduce((sum, tier) => sum + parseFloat(tier.equity_percentage || 0), 0) >
                                                parseFloat(formData.equity_offered || 0) && (
                                                    <p className={styles.warningText}>
                                                        Warning: Your tier allocation exceeds your total offered equity
                                                    </p>
                                                )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.fieldGroup}>
                                <div className={styles.fieldLabel}>
                                    <h3>Expected Returns</h3>
                                    <p className={styles.fieldDescription}>
                                        Provide estimated returns on investment for different time periods.
                                    </p>
                                </div>
                                <div className={styles.fieldInput}>
                                    <div className={styles.returnItem}>
                                        <label className={styles.inputLabel}>1-5 Years Return</label>
                                        <div className={styles.inputWithSuffix}>
                                            <input
                                                type="number"
                                                name="return_1_5_years"
                                                value={formData.return_1_5_years}
                                                onChange={handleChange}
                                                className={styles.textInput}
                                                min="0"
                                                max="100"
                                                step="0.01"
                                                required
                                            />
                                            <span className={styles.percentSuffix}>%</span>
                                        </div>
                                    </div>
                                    <div className={styles.returnItem}>
                                        <label className={styles.inputLabel}>5-10 Years Return</label>
                                        <div className={styles.inputWithSuffix}>
                                            <input
                                                type="number"
                                                name="return_5_10_years"
                                                value={formData.return_5_10_years}
                                                onChange={handleChange}
                                                className={styles.textInput}
                                                min="0"
                                                max="100"
                                                step="0.01"
                                                required
                                            />
                                            <span className={styles.percentSuffix}>%</span>
                                        </div>
                                    </div>
                                    <div className={styles.returnItem}>
                                        <label className={styles.inputLabel}>10+ Years Return</label>
                                        <div className={styles.inputWithSuffix}>
                                            <input
                                                type="number"
                                                name="return_10_plus_years"
                                                value={formData.return_10_plus_years}
                                                onChange={handleChange}
                                                className={styles.textInput}
                                                min="0"
                                                max="100"
                                                step="0.01"
                                                required
                                            />
                                            <span className={styles.percentSuffix}>%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.buttonContainer}>
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className={styles.nextButton}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Story Section */}
                    {currentStep === 'story' && (
                        <div className={styles.formSection}>
                            <h2 className={styles.sectionTitle}>Tell Your Story</h2>
                            <div className={styles.fieldGroup}>
                                <div className={styles.fieldLabel}>
                                    <h3>Project Status</h3>
                                    <p className={styles.fieldDescription}>
                                        Let backers know where you are in your project journey.
                                    </p>
                                </div>
                                <div className={styles.fieldInput}>
                                    <label className={styles.inputLabel}>Story</label>
                                    <textarea
                                        name="project_story"
                                        value={formData.project_story}
                                        onChange={handleChange}
                                        className={styles.textareaInput}
                                        placeholder="Describe your Story..."
                                        rows="4"
                                        required
                                    />
                                </div>
                            </div>



                            <div className={styles.buttonContainer}>
                                <button type="button" onClick={handleNext} className={styles.nextButton}>
                                    Next
                                </button>
                            </div>
                        </div>
                    )}


                    {currentStep === 'add_member' && (
                        <div className={styles.formSection}>
                            <h2 className={styles.sectionTitle}>Add member</h2>
                            <p className={styles.sectionDescription}>
                                List the names of team members who contributed to building this project.
                            </p>

                            <div className={styles.fieldGroup}>
                                <div className={styles.fieldInput}>
                                    <label className={styles.inputLabel}>Name</label>
                                    <input
                                        type="text"
                                        name="member_name"
                                        value={formData.member_name || ''}
                                        onChange={handleChange}
                                        className={styles.textInput}
                                        placeholder="Heng Nithsy"
                                    />
                                </div>
                            </div>

                            <div className={styles.fieldGroup}>
                                <div className={styles.fieldInput}>
                                    <label className={styles.inputLabel}>Position</label>
                                    <input
                                        type="text"
                                        name="member_position"
                                        value={formData.member_position || ''}
                                        onChange={handleChange}
                                        className={styles.textInput}
                                        placeholder="Marketing manager"
                                    />
                                </div>
                            </div>



                            <div className={styles.hiddenFieldsContainer}>
                                <input
                                    type="hidden"
                                    name="user_id"
                                    value={formData.user_id}
                                />
                            </div>

                            <div className={styles.reviewSummary}>
                                <h3>Review Your Project</h3>
                                <p>Please review all your project details before submitting:</p>

                                <div className={styles.summaryItem}>
                                    <span className={styles.summaryLabel}>Title:</span>
                                    <span>{formData.title}</span>
                                </div>

                                <div className={styles.summaryItem}>
                                    <span className={styles.summaryLabel}>Category:</span>
                                    <span>{formData.categories}</span>
                                </div>

                                <div className={styles.summaryItem}>
                                    <span className={styles.summaryLabel}>Location:</span>
                                    <span>{formData.project_location}</span>
                                </div>

                                <div className={styles.summaryItem}>
                                    <span className={styles.summaryLabel}>Funding Goal:</span>
                                    <span>${formData.funding_goal}</span>
                                </div>

                                <div className={styles.summaryItem}>
                                    <span className={styles.summaryLabel}>Duration:</span>
                                    <span>{formData.auction_start_date} to {formData.auction_end_date}</span>
                                </div>
                            </div>

                            <div className={styles.buttonContainer}>
                                <button type="submit" className={styles.submitButton}>
                                    Submit Project
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </>
    );
};

export default ProjectStartup;