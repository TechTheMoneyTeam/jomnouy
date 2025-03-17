import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import './projectDetails.css';
import CommentSection from '../tab_bar/comment';
import InvestmentForm from './InvestmentForm'; // Import the InvestmentForm
import { FaRegBookmark } from "react-icons/fa6";
import { RxBookmark } from "react-icons/rx";
import { PiShareFat } from "react-icons/pi";
import { FaRegClock } from "react-icons/fa";
import FAQAccordion from "../tab_bar/faq";

const getDaysSinceCreation = (createdAt) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

// New function to calculate days remaining until auction end
const getDaysRemaining = (endDate) => {
    if (!endDate) return 0;
    
    try {
        const end = new Date(endDate);
        const now = new Date();
        if (isNaN(end.getTime())) return 0;
        if (now > end) return 0;
        
        const diffTime = end - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    } catch (error) {
        console.error("Error calculating days remaining:", error);
        return 0;
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
    const [showInvestmentModal, setShowInvestmentModal] = useState(false); // State for investment modal
    const [totalInvested, setTotalInvested] = useState(0); // State for total invested
    const [investmentProgress, setInvestmentProgress] = useState(0); // State for investment progress
    const tabRef = useRef();

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
                setDaysRemaining(getDaysRemaining(projectData.auction_end_date));
                setLoading(false);

                // Fetch total amount invested from the Investment table
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

    const handleInvestmentSuccess = (investmentData) => {
        const newTotalInvested = investmentData.total_invested || 0;
        setTotalInvested(newTotalInvested);
        setInvestmentProgress(
            project.funding_goal 
            ? Math.min((newTotalInvested / project.funding_goal) * 100, 100) 
            : 0
        );
        setShowInvestmentModal(false); // Close the modal on success
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

    const RelatedProjects = ({ projects, loading }) => {
        return (
            <div className="container mx-auto px-4 py-8 ">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">Related Projects</h2>
                    <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                        See more
                    </button>
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
                                            <span className='text-black/70 font-semibold overflow-hidden whitespace-nowrap text-ellipsis'>{getDaysSinceCreation(project.created_at) }
                                                <span className='font-medium'>  days ago • </span>
                                                 {project.categories || 0}
                                                <span className='font-medium'></span>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="m-2 description text-xs text-black/80 font-normal opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        {project.project_des}
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
            <Navbar />
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
                        <p className="text-funding mt-2 text-gray-600">US$ {totalInvested.toLocaleString()}</p>
                        <p className="mt-2 text-gray-600">Pledged of US$ {project.funding_goal?.toLocaleString()} goal</p>
                        <p className="mt-2 text-gray-600 text-2xl font-medium">129</p>
                        <p className="mt-1 text-gray-600">Backers</p>
                        <p className="mt-6 text-gray-600 text-2xl font-medium">{daysRemaining}</p>
                        <p className="mt-1 text-gray-600">Days Remaining</p>
                        
                        <button 
                            className="invest-button"
                            onClick={() => setShowInvestmentModal(true)}
                        >
                            Invest in this project
                        </button>

                        {showInvestmentModal && (
  <div className=".modal-overlay">
    <div className=".modal-content">
      <button 
        className=".modal-close-button"
        onClick={() => setShowInvestmentModal(false)}
      >
        &times;
      </button>
      <InvestmentForm 
        projectId={project.project_id}
        fundingGoal={project.funding_goal}
        currentTotalInvested={totalInvested}
        onInvestmentSuccess={handleInvestmentSuccess}
      />
    </div>
  </div>
)}
                        <p className="c-text">This project will receive funding only if it meets its goal by {new Date(project.auction_end_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', timeZoneName: 'short' })}</p>
                        <div className="buttons-container">
                            <button className="action-buttons">
                                <FaRegBookmark className="icon-button" />
                                <span>Save for later</span>
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
                            {tab === "comment" && (
                                <span className="num-comment">
                                    {commentCount}
                                </span>
                            )}
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
        </>
    );
};

export default ProjectDetails;