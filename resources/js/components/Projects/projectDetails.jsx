import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar2 from '../Navbar/Navbarforsubmit';
import './projectDetails.css';
import CommentSection from '../tab_bar/comment';
import { Link } from 'react-router-dom';
import InvestmentForm from './InvestmentForm';
import KYCForm from './Kycform';
import PaymentPage from './PaymentPage';
import { FaRegBookmark } from "react-icons/fa6";
import { RxBookmark } from "react-icons/rx";
import { PiShareFat } from "react-icons/pi";
import { FaRegClock } from "react-icons/fa";
import { Users, BriefcaseBusiness, CalendarRange } from "lucide-react";
import FAQAccordion from "../tab_bar/faq";
import TermsAndConditions from "./TermsAndConditions";


const getDaysSinceCreation = (createdAt) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

const getDaysRemaining = (endDate, startDate) => {
    if (!endDate || !startDate) return 0;

    try {
        const end = new Date(endDate);
        const start = new Date(startDate);
        const now = new Date();

        if (isNaN(end.getTime()) || isNaN(start.getTime())) return 0;


        if (now < start) {
            const diffTime = end - start;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays > 0 ? diffDays : 0;
        }


        if (now > end) return 0;


        const diffTime = end - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    } catch (error) {
        console.error("Error calculating days remaining:", error);
        return 0;
    }
};

const hasAuctionStarted = (startDate) => {
    if (!startDate) return true; // Default to true if no start date

    try {
        const start = new Date(startDate);
        const now = new Date();
        return now >= start;
    } catch (error) {
        console.error("Error checking auction start:", error);
        return true; // Default to true in case of error
    }
};

const ProgressBar = ({ progress }) => {
    const getColor = () => {
        return progress < 50 ? '#FFA500' : '#FF7F00';
    };

    return (
        <div className="progress-container">
            <div className="progress-bar" style={{ width: `${progress}%`, backgroundColor: getColor() }} />
        </div>
    );
};

const ProjectDetails = () => {
    const [showInvestmentPerksModal, setShowInvestmentPerksModal] = useState(false);
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [projects, setAllProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("story");
    const [comments, setComments] = useState([]);
    const [projectStory, setProjectStory] = useState("");
    const [faq, setFaq] = useState([]);
    const [daysRemaining, setDaysRemaining] = useState(0);
    const [commentCount, setCommentCount] = useState(0);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [showKYCForm, setShowKYCForm] = useState(false);
    const [showInvestmentForm, setShowInvestmentForm] = useState(false);
    const [showPaymentPage, setShowPaymentPage] = useState(false);
    const [investmentData, setInvestmentData] = useState(null);
    const [totalInvested, setTotalInvested] = useState(0);
    const [investmentProgress, setInvestmentProgress] = useState(0);
    const [kycData, setKycData] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [savingToFavorites, setSavingToFavorites] = useState(false);
    const [isProjectCreator, setIsProjectCreator] = useState(false);
    const [auctionStarted, setAuctionStarted] = useState(true);
    const [totalInvestments, setTotalInvestments] = useState(0);
    const [uniqueInvestors, setUniqueInvestors] = useState(0);
    const tabRef = useRef();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Get user data from localStorage
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                console.log("User data from localStorage:", user);
                setUserId(user.user_id);

                // Check if this project is already in favorites
                if (user.user_id) {
                    axios.get(`/api/users/${user.user_id}/favorites`)
                        .then(response => {
                            const favorites = response.data;
                            const isProjectInFavorites = favorites.some(
                                fav => fav.project_id === parseInt(id)
                            );
                            setIsFavorite(isProjectInFavorites);
                        })
                        .catch(error => {
                            console.error('Error checking favorites:', error);
                        });
                }
            } catch (error) {
                console.error("Error parsing user data:", error);
            }
        }
    }, [id]);

    useEffect(() => {
        axios.get(`/api/projects/${id}`)
            .then(response => {
                const projectData = response.data;
                setProject(projectData);
                setProjectStory(projectData.project_story || "No story available for this project.");
                setFaq(projectData.faq || []);
                const projectComments = projectData.comments || [];
                setComments(projectComments);
                setCommentCount(projectComments.length);

                // Check if auction has started
                const started = hasAuctionStarted(projectData.auction_start_date);
                setAuctionStarted(started);

                // Calculate days remaining between start and end dates
                setDaysRemaining(getDaysRemaining(projectData.auction_end_date, projectData.auction_start_date));

                // Check if current user is the project creator
                const userData = localStorage.getItem('user');
                if (userData) {
                    const user = JSON.parse(userData);
                    setIsProjectCreator(projectData.user_id === user.user_id);
                }

                setLoading(false);

                // First get the total investment amount using the correct endpoint
                axios.get(`/api/projects/${id}/investments/total`)
                    .then(response => {
                        const totalAmount = response.data.total_amount || 0;
                        setTotalInvested(totalAmount);
                        setInvestmentProgress(
                            projectData.funding_goal
                                ? Math.min((totalAmount / projectData.funding_goal) * 100, 100)
                                : 0
                        );
                    })
                    .catch(error => {
                        console.error('Error fetching total investment:', error);
                        setTotalInvested(0);
                        setInvestmentProgress(0);
                    });

                // Then get all investments to count them
                axios.get(`/api/projects/${id}/investments`)
                    .then(response => {
                        // Fix: Check what the actual response format is and handle it appropriately
                        const investments = response.data;
                        console.log('Investments response:', investments);

                        // Check what data shape we're getting and handle accordingly
                        if (Array.isArray(investments)) {

                            setTotalInvestments(investments.length);

                            // Count unique investors
                            const uniqueIds = new Set(investments.map(inv => inv.user_id));
                            setUniqueInvestors(uniqueIds.size);
                        } else if (investments && typeof investments === 'object') {
                            // If it's an object with a data property that contains the array
                            const investmentsArray = investments.data || investments.investments || [];

                            if (Array.isArray(investmentsArray)) {
                                setTotalInvestments(investmentsArray.length);

                                // Count unique investors
                                const uniqueIds = new Set(investmentsArray.map(inv => inv.user_id));
                                setUniqueInvestors(uniqueIds.size);
                            } else {
                                console.error('Cannot find investments array in response:', investments);
                                setTotalInvestments(0);
                                setUniqueInvestors(0);
                            }
                        } else {
                            console.error('Investments data has unexpected format:', investments);
                            setTotalInvestments(0);
                            setUniqueInvestors(0);
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching investments:', error);
                        setTotalInvestments(0);
                        setUniqueInvestors(0);
                    });
            })
            .catch(() => {
                setError('Project not found');
                setLoading(false);
            });

        axios.get('/api/projects')
            .then(response => {
                setAllProjects(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching projects:', error);
                setLoading(false);
            });
    }, [id]);
    const handleOpenInvestmentPerks = () => {
        setShowInvestmentPerksModal(true);
    };

    const handleCloseInvestmentPerks = () => {
        setShowInvestmentPerksModal(false);
    };


    const handleToggleFavorite = () => {
        if (!userId) {
            alert("Please log in to save projects to your favorites.");
            return;
        }

        setSavingToFavorites(true);

        if (isFavorite) {

            axios.delete(`/api/users/${userId}/favorites/${id}`)
                .then(() => {
                    setIsFavorite(false);
                })
                .catch(error => {
                    console.error('Error removing from favorites:', error);
                })
                .finally(() => {
                    setSavingToFavorites(false);
                });
        } else {

            axios.post(`/api/users/${userId}/favorites`, {
                project_id: id
            })
                .then(() => {
                    setIsFavorite(true);
                })
                .catch(error => {
                    console.error('Error adding to favorites:', error);
                })
                .finally(() => {
                    setSavingToFavorites(false);
                });
        }
    };

    const handleInvestmentSubmit = (data) => {
        setInvestmentData(data);
        setShowInvestmentForm(false);
        setShowPaymentPage(true);
    };

    const resetInvestmentFlow = () => {
        setShowTermsModal(false);
        setShowKYCForm(false);
        setShowInvestmentForm(false);
        setShowPaymentPage(false);
        setKycData(null);
        setInvestmentData(null);
    };

    const handleInvestClick = () => {

        if (!userId) {
            alert("Please log in to invest in this project.");
            return;
        }

        if (isProjectCreator) {
            alert("You cannot invest in your own project.");
            return;
        }

        setShowTermsModal(true);
    };

    const handleTermsAccept = () => {
        setShowTermsModal(false);
        setShowKYCForm(true);
    };

    const handleKYCComplete = (data) => {
        setKycData(data);
        setShowKYCForm(false);
        setShowInvestmentForm(true);
    };


    const handleCommentsUpdate = (updatedComments) => {
        setComments(updatedComments);
        setCommentCount(updatedComments.length);
    };

    useEffect(() => {
        if (tabRef.current) {
            tabRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [activeTab]);

    useEffect(() => {
        if (showPaymentPage) {
            window.scrollTo(0, 0);
        }
    }, [showPaymentPage]);

    const RelatedProjects = ({ projects, loading }) => {
        return (
            <div className="container mx-auto px-4 py-8 ">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">Related Projects</h2>
                    <Link to="/projectlist1" className="underline">
                        <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                            See more
                        </button></Link>

                </div>
                <div className="related-project m-4">
                    {loading ? (
                        <p>Loading projects...</p>
                    ) : projects.length > 0 ? (
                        projects.slice(0, 4).map((project) => (
                            <div key={project.project_id} className="rounded-lg overflow-hidden group relative mb-4 transition-shadow duration-300 hover:shadow-lg">
                                <div className="project-image relative flex items-center justify-center px-2 pt-2">
                                    <img
                                        src={project.project_img_url || "/api/placeholder/400/320"}
                                        alt={project.title}
                                        className="project-image w-full h-40 object-cover rounded-lg"
                                    />
                                </div>
                                <div className="px-2 py-4">
                                    <div className="flex items-center mb-3">
                                        <div className="profile-avatar">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                                className="w-5 h-5"
                                            >
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z" />
                                            </svg>
                                        </div>
                                        <div className="ml-1 flex flex-col flex-grow">
                                            <h3 className="font-medium text-md">{project.title}</h3>
                                            <div className="text-gray-500 text-xs">
                                                {project.user?.username || project.user?.name || project.user?.full_name || 'Unknown Creator'}
                                            </div>
                                        </div>
                                        <div className="flex justify-end">
                                            <RxBookmark />
                                        </div>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500 mb-2 ml-2">
                                        <div className="flex items-center mr-4">
                                            <FaRegClock className="w-4 h-4 mr-1 text-black/70" />
                                            <span className='text-black/70 font-semibold overflow-hidden whitespace-nowrap text-ellipsis'>{getDaysSinceCreation(project.created_at)}
                                                <span className='font-medium'>  days ago • </span>
                                                {project.categories || 0}
                                                <span className='font-medium'></span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No projects found.</p>
                    )}
                </div>
            </div>
        );
    };



    if (loading) return <div className="text-center py-8">Loading...</div>;
    if (error) return <div className="text-center py-8 text-red-600">{error}</div>;

    return (
        <>
            <Navbar2 />
            <div className="max-w-6xl mx-auto px-4 py-8" style={{ margin: "30px 200px" }}>
                <h2 className="text-title">{project.title}</h2>
                <p className="text-description mt-4">{project.project_des}</p>
                <div className="container flex space-x-6">
                    <div className="left-container">
                        <img
                            src={project.project_img_url || "/api/placeholder/600/300"}
                            alt={project.title}
                            className="w-full object-cover rounded-lg mt-4"
                        />
                    </div>

                    <div className="right-container p-4">
                        <ProgressBar progress={investmentProgress} />
                        <p className="text-funding mt-2 text-gray-600">Goal of US$ {project.funding_goal?.toLocaleString()}</p>
                        <p className="text-2xl mt-2 text-gray-600">For Base Equity of {project.equity_offered} %</p>
              
                        <p className="text-gray-600 text-xl font-medium mt-3">Total US$ {totalInvested.toLocaleString()} Offered</p>
                        

                        <div className="mt-2 flex items-center">
                            <Users className="mr-2" size={20} />
                            <p className="text-gray-600 text-3xl font-medium">{uniqueInvestors}</p>
                        </div>
                        <p className="mt-1 text-gray-600">Unique Investors</p>

                        <div className="mt-2 flex items-center">
                            <BriefcaseBusiness className="mr-2" size={20} />
                            <p className="text-gray-600 text-3xl font-medium">{totalInvestments}</p>
                        </div>
                        <p className="mt-1 text-gray-600">Total Investments Made</p>

                        <div className="mt-2 flex items-center">
                            <CalendarRange className="mr-2" size={20} />
                            <p className="text-gray-600 text-3xl font-medium">{daysRemaining}</p>
                        </div>
                        <p className="mt-1 text-gray-600">Days Remaining</p>  
                        <button className="mt-1 bg-transparent text-custom-orange rounded font-bold" onClick={handleOpenInvestmentPerks}>
                            View Investment Perks
                        </button>  
                        {showInvestmentPerksModal && (
                <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg max-w-md w-full relative">
                        <button 
                            className="absolute top-2 right-2 text-2xl text-gray-600 hover:text-gray-900"
                            onClick={handleCloseInvestmentPerks}
                        >
                            &times;
                        </button>
                        <h2 className="text-xl font-bold mb-4">Investment Perks</h2>
                        <div className="space-y-3">
                            <div className="bg-gray-100 p-3 rounded-md">
                                <h3 className="font-semibold">1-5 Years Investment</h3>
                                <p className="text-gray-600">
                                    + {project.return_1_5_years || 'N/A'}% Equity Return
                                </p>
                            </div>
                            <div className="bg-gray-100 p-3 rounded-md">
                                <h3 className="font-semibold">5-10 Years Investment</h3>
                                <p className="text-gray-600">
                                    + {project.return_5_10_years || 'N/A'}% Equity Return
                                </p>
                            </div>
                            <div className="bg-gray-100 p-3 rounded-md">
                                <h3 className="font-semibold">Over 10 Years Investment</h3>
                                <p className="text-gray-600">
                                    + {project.return_10_plus_years || 'N/A'}% Equity Return
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
  
                        {/* <p className="mt-1 text-gray-600">Investment 1-5 years + {project.return_1_5_years} of equity</p>
                        <p className="mt-1 text-gray-600">Investment 5-10 years + {project.return_1_5_years}</p>
                        <p className="mt-1 text-gray-600">Investment Over 10 years + {project.return_1_5_years}</p> */}


                      

                        {isProjectCreator ? (
                            <div className="disabled-button-container">
                                <button
                                    className="invest-button disabled-button"
                                    disabled={true}
                                >
                                    You cannot invest in your own project
                                </button>
                                <span className="tooltip-text">Project creators cannot invest in their own projects</span>
                            </div>
                        ) : !auctionStarted ? (
                            <div className="disabled-button-container">
                                <button
                                    className="invest-button auction-not-started"
                                    disabled={true}
                                >
                                    Auction has not started yet
                                </button>
                                <span className="tooltip-text">Investment will be available when the auction starts on {new Date(project.auction_start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                        ) : (
                            <button
                                className="invest-button"
                                onClick={handleInvestClick}
                            >
                                Invest in this project
                            </button>
                        )}

                        <p className="c-text">This project will receive funding only if it meets its goal by {new Date(project.auction_end_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', timeZoneName: 'short' })}</p>
                        <div className="buttons-container">
                            <button
                                className="action-buttons"
                                onClick={handleToggleFavorite}
                                disabled={savingToFavorites}
                            >
                                {isFavorite ? (
                                    <RxBookmark className="icon-button text-blue-500" />
                                ) : (
                                    <FaRegBookmark className="icon-button" />
                                )}
                                <span>{isFavorite ? "Saved to favorites" : "Save for later"}</span>
                            </button>
                            <button className="action-buttons">
                                <PiShareFat className="icon-button" />
                                <span>Share</span>
                            </button>
                        </div>
                    </div>
                </div>
                <hr className="hr1" />
                <div className="tab-button flex border-gray-300">
                    {["story", "faq", "comment"].map(tab => (
                        <button
                            key={tab}
                            className={`tab-item ${activeTab === tab ? "active-tab" : ""}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab.toUpperCase()}
                            
                        </button>
                    ))}
                </div>
                <div ref={tabRef}>
                    {activeTab === "story" && (
                        <div className="tab-content flex min-h-screen flex-col">
                            <div className="max-w-2xl text-left">
                                <div dangerouslySetInnerHTML={{ __html: projectStory }} />
                            </div>

                            <div className="flex flex-col items-start mt-8">
                                <p className="mb-2">
                                    Questions about this project?{' '}
                                    <a href="/faq" className="text-black-900 font-semibold underline">Check out the FAQ</a>
                                </p>
                                <button className="report-btn">
                                    Report this project to JOMNOUY
                                </button>
                                <hr className="hr2" />
                            </div>
                            <RelatedProjects projects={projects} loading={loading} />
                        </div>
                    )}

                    {activeTab === "faq" && (
                        <div className="tab-content">
                            <FAQAccordion />
                            <RelatedProjects projects={projects} loading={loading} />
                        </div>
                    )}

                    {activeTab === "comment" && (
                        <div className="tab-content">
                            <CommentSection comments={comments} onCommentsUpdate={handleCommentsUpdate} />
                            <RelatedProjects projects={projects} loading={loading} />
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Overlay */}
            {(showTermsModal || showKYCForm || showInvestmentForm || showPaymentPage) && (
                <div className="modal-overlay">
                    <div className="modal-backdrop" onClick={resetInvestmentFlow}></div>
                    <div className="modal-container">
                        {showTermsModal && (
                            <TermsAndConditions
                                onAccept={handleTermsAccept}
                                onCancel={resetInvestmentFlow}
                            />
                        )}

                        {showKYCForm && (
                            <KYCForm
                                onComplete={handleKYCComplete}
                                onCancel={resetInvestmentFlow}
                            />
                        )}

                        {showInvestmentForm && (
                            <div className="investment-form-wrapper">
                                <button
                                    className="modal-close-button"
                                    onClick={resetInvestmentFlow}
                                >
                                    &times;
                                </button>
                                <InvestmentForm
                                    projectId={project.project_id}
                                    fundingGoal={project.funding_goal}
                                    currentTotalInvested={totalInvested}
                                    kycData={kycData}
                                    onInvestmentSuccess={handleInvestmentSubmit}
                                />
                            </div>
                        )}

                        {showPaymentPage && investmentData && (
                            <div className="modal-overlay">
                                <div className="modal-backdrop"></div>
                                <div className="modal-container" style={{ marginTop: '50px', alignSelf: 'flex-start' }}>
                                    <PaymentPage
                                        amount={investmentData.amount}
                                        investmentData={investmentData}
                                        onSuccess={() => {
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default ProjectDetails;