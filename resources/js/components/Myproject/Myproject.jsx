import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, DollarSign, Users, BarChart3, Award, Percent } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faMoneyBillWave, faChartLine, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import Navbars from '../Navbar/Navbarformyproject';
import styles from './MyProjects.module.css';

const Card = ({ className, children }) => (
    <div className={`${styles.card} ${className || ''}`}>
        {children}
    </div>
);

const CardContent = ({ className, children }) => (
    <div className={`${styles.cardContent} ${className || ''}`}>{children}</div>
);

const StatusBadge = ({ status }) => {
    const getStatusColor = () => {
        switch (status?.toLowerCase()) {
            case 'active':
            case 'funding':
                return styles.statusActive;
            case 'completed':
                return styles.statusCompleted;
            case 'draft':
                return styles.statusDraft;
            case 'pending':
                return styles.statusPending;
            default:
                return styles.statusDefault;
        }
    };

    return (
        <span className={`${styles.statusBadge} ${getStatusColor()}`}>
            {status || 'Unknown'}
        </span>
    );
};

const MyProjects = () => {
    const [projects, setProjects] = useState([]);
    const [projectInvestments, setProjectInvestments] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);
    const [username, setUsername] = useState('');
    const [activeTab, setActiveTab] = useState('projects');
    const [userInvestments, setUserInvestments] = useState([]);
    const [investmentStats, setInvestmentStats] = useState({
        total_investment_amount: 0,
        pending_amount: 0,
        approved_amount: 0,
        completed_amount: 0,
        project_count: 0
    });

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                console.log("User data from localStorage:", user);
                setUsername(user.username || '');
                setUserId(user.user_id);
            } catch (error) {
                console.error("Error parsing user data:", error);
                setError("Invalid user data in local storage");
            }
        }
    }, []);

    useEffect(() => {
        if (userId) {
            fetchUserProjects();
            fetchUserInvestments();
        } else {
            setLoading(false);
        }
    }, [userId]);

    const fetchUserProjects = async () => {
        try {
            console.log("Fetching projects for user ID:", userId);
            const response = await axios.get(`/api/user-projects/${userId}`);
            console.log("Projects fetched successfully:", response.data);
            const projectsData = Array.isArray(response.data) ? response.data :
                (response.data.projects || response.data.data || []);
            setProjects(projectsData);
            
            // Fetch investment details for each project
            projectsData.forEach(project => {
                fetchProjectInvestments(project.project_id || project.id);
            });
            
            setError(null);
        } catch (firstError) {
            console.error('First attempt to fetch projects failed:', firstError);
            try {
                console.log("Trying alternative endpoint with 'users' prefix");
                const altResponse = await axios.get(`/api/users/${userId}/projects`);
                const projectsData = Array.isArray(altResponse.data) ? altResponse.data :
                    (altResponse.data.projects || altResponse.data.data || []);
                setProjects(projectsData);
                
                // Fetch investment details for each project
                projectsData.forEach(project => {
                    fetchProjectInvestments(project.project_id || project.id);
                });
                
                setError(null);
            } catch (secondError) {
                console.error('Second attempt failed:', secondError);
                try {
                    console.log("Trying final alternative endpoint");
                    const finalResponse = await axios.get(`/api/projects?user_id=${userId}`);
                    const projectsData = Array.isArray(finalResponse.data) ? finalResponse.data :
                        (finalResponse.data.projects || finalResponse.data.data || []);
                    setProjects(projectsData);
                    
                    // Fetch investment details for each project
                    projectsData.forEach(project => {
                        fetchProjectInvestments(project.project_id || project.id);
                    });
                    
                    setError(null);
                } catch (finalError) {
                    console.error('All attempts to fetch projects failed:', finalError);
                    setError('Failed to load your projects. Please check your API routes configuration.');
                }
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchUserInvestments = async () => {
        try {
            const response = await axios.get(`/api/user-investments/${userId}`);
            console.log("User investments fetched:", response.data);
            
            // Check various response formats
            const investmentsData = response.data.investments || response.data;
            const stats = {
                total_investment_amount: response.data.total_investment_amount || 0,
                pending_amount: response.data.pending_amount || 0,
                approved_amount: response.data.approved_amount || 0,
                completed_amount: response.data.completed_amount || 0,
                project_count: response.data.project_count || 0
            };
            
            setUserInvestments(investmentsData);
            setInvestmentStats(stats);
        } catch (error) {
            console.error('Failed to fetch user investments:', error);
            // Don't show error for investments to keep the UI clean
        }
    };

    const fetchProjectInvestments = async (projectId) => {
        try {
            const response = await axios.get(`/api/project-investments/${projectId}`);
            console.log(`Investments for project ${projectId}:`, response.data);
            
            setProjectInvestments(prev => ({
                ...prev,
                [projectId]: response.data
            }));
        } catch (error) {
            console.error(`Failed to fetch investments for project ${projectId}:`, error);
            // Set empty data structure to avoid errors in rendering
            setProjectInvestments(prev => ({
                ...prev,
                [projectId]: { 
                    investments: [],
                    total_investment_amount: 0,
                    total_approved_amount: 0,
                    total_completed_amount: 0,
                    funding_goal: 0,
                    funding_percentage: 0
                }
            }));
        }
    };

    const deleteProject = async (projectId) => {
        if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
            return;
        }
        
        try {
            await axios.delete(`/api/projects/${projectId}`);
            setProjects(projects.filter(project => (project.project_id || project.id) !== projectId));
            // Also remove investment data for this project
            const newProjectInvestments = { ...projectInvestments };
            delete newProjectInvestments[projectId];
            setProjectInvestments(newProjectInvestments);
        } catch (error) {
            console.error('Failed to delete project:', error);
            setError('Failed to delete the project. Please try again.');
        }
    };

    const editProject = (projectId) => {
        window.location.href = `/edit-project/${projectId}`;
    };

    const viewProjectDetails = (projectId) => {
        window.location.href = `/projects/${projectId}`;
    };

    const viewInvestmentDetails = (investmentId) => {
        window.location.href = `/investment/${investmentId}`;
    };

    const viewInvestmentApprovalDashboard = (projectId) => {
        window.location.href = `/investment-approval-dashboard/${projectId}`;
    };

    const formatFunding = (amount) => {
        if (!amount) return "0";
        if (amount >= 1000000) {
            return `${(amount / 1000000).toFixed(1)}M`;
        } else if (amount >= 1000) {
            return `${(amount / 1000).toFixed(1)}K`;
        }
        return amount;
    };

    const getDaysSinceCreation = (createdAt) => {
        if (!createdAt) return "N/A";
        const created = new Date(createdAt);
        const now = new Date();
        const diffTime = Math.abs(now - created);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };
    
    const calculateProgress = (projectId) => {
        const investments = projectInvestments[projectId];
        if (!investments) return 0;
        
        const project = projects.find(p => (p.project_id || p.id) === projectId);
        if (!project || !project.funding_goal) return 0;
        
        const fundingGoal = parseFloat(project.funding_goal);
        const totalInvested = parseFloat(investments.total_approved_amount || 0) + 
                             parseFloat(investments.total_completed_amount || 0);
        
        return Math.min(Math.round((totalInvested / fundingGoal) * 100), 100);
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

    const getInvestmentStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved':
                return styles.statusApproved;
            case 'completed':
                return styles.statusCompleted;
            case 'rejected':
                return styles.statusRejected;
            case 'pending':
            default:
                return styles.statusPending;
        }
    };

    if (!userId) {
        return (
            <div className={styles.notLoggedIn}>
                <h2>Please log in to view your projects</h2>
                <button
                    onClick={() => window.location.href = '/login'}
                    className={styles.loginButton}
                >
                    Go to Login
                </button>
            </div>
        );
    }

    return (
        <>
            <Navbars />
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>My Dashboard</h1>
                    <p className={styles.welcomeText}>
                        Welcome back, <strong>{username}</strong>
                    </p>
                    <p className={styles.userIdText}>User ID: {userId}</p>
                </div>
                
                {error && (
                    <div className={styles.error}>
                        {error}
                        <button
                            onClick={fetchUserProjects}
                            className={styles.retryButton}
                        >
                            Retry
                        </button>
                    </div>
                )}
                
                <div className={styles.tabContainer}>
                    <button 
                        className={`${styles.tabButton} ${activeTab === 'projects' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('projects')}
                    >
                        My Projects ({projects.length})
                    </button>
                    <button 
                        className={`${styles.tabButton} ${activeTab === 'investments' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('investments')}
                    >
                        My Investments ({userInvestments.length})
                    </button>
                </div>
                
                {activeTab === 'projects' && (
                    <div className={styles.projectsContainer}>
                        <div className={styles.projectsHeader}>
                            <h2 className={styles.sectionTitle}>
                                You have <span className={styles.highlight}>{projects.length} projects</span>
                            </h2>
                            <button
                                onClick={() => window.location.href = '/create-project'}
                                className={styles.createButton}
                            >
                                Create New Project
                            </button>
                            {loading && (
                                <div className={styles.spinner} />
                            )}
                        </div>
                        
                        {projects.length > 0 ? (
                            <div className={styles.projectGrid}>
                                {projects.map((project) => {
                                    const projectId = project.project_id || project.id;
                                    const investmentData = projectInvestments[projectId] || {
                                        total_investment_amount: 0,
                                        total_approved_amount: 0,
                                        funding_percentage: 0
                                    };
                                    
                                    return (
                                        <Card key={projectId} className={styles.projectCard}>
                                            <div className={styles.cardHeader}>
                                                <img
                                                    src={project.project_img_url || project.image_url || "/api/placeholder/400/200"}
                                                    alt={project.title}
                                                    className={styles.projectImage}
                                                    onError={(e) => {
                                                        e.target.src = "/api/placeholder/400/200";
                                                    }}
                                                />
                                                <StatusBadge status={project.status} />
                                            </div>
                                            
                                            <CardContent>
                                                <div className={styles.projectTitleRow}>
                                                    <div className={styles.avatar} />
                                                    <span className={styles.projectTitle}>{project.title}</span>
                                                </div>
                                                
                                                <div className={styles.projectType}>
                                                    {project.project_type || project.type || "N/A"}
                                                </div>
                                                
                                                <div className={styles.projectInfo}>
                                                    <span>Project ID: {projectId}</span>
                                                </div>
                                                
                                                <div className={styles.fundingProgress}>
                                                    <div className={styles.progressLabel}>
                                                        <span>Funding Progress</span>
                                                        <span>{calculateProgress(projectId)}%</span>
                                                    </div>
                                                    <div className={styles.progressBar}>
                                                        <div 
                                                            className={styles.progressFill} 
                                                            style={{ width: `${calculateProgress(projectId)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                                
                                                <div className={styles.statsRow}>
                                                    <div className={styles.stat}>
                                                        <DollarSign size={14} />
                                                        <span className={styles.statValue}>
                                                            ${formatFunding(project.funding_goal || project.funding || 0)}
                                                        </span>
                                                        <span className={styles.statLabel}>Goal</span>
                                                    </div>
                                                    
                                                    <div className={styles.stat}>
                                                        <Users size={14} />
                                                        <span className={styles.statValue}>
                                                            {investmentData.investments?.length || 0}
                                                        </span>
                                                        <span className={styles.statLabel}>Investors</span>
                                                    </div>
                                                    
                                                    <div className={styles.stat}>
                                                        <Clock size={14} />
                                                        <span className={styles.statValue}>
                                                            {getDaysSinceCreation(project.created_at)}
                                                        </span>
                                                        <span className={styles.statLabel}>Days</span>
                                                    </div>
                                                </div>
                                                
                                                <div className={styles.actionButtons}>
                                                    <button
                                                        onClick={() => viewProjectDetails(projectId)}
                                                        className={styles.viewButton}
                                                        title="View Project Details"
                                                    >
                                                        <FontAwesomeIcon icon={faExternalLinkAlt} />
                                                    </button>
                                                    <button
                                                        onClick={() => editProject(projectId)}
                                                        className={styles.editButton}
                                                        title="Edit Project"
                                                    >
                                                        <FontAwesomeIcon icon={faEdit} />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteProject(projectId)}
                                                        className={styles.deleteButton}
                                                        title="Delete Project"
                                                        disabled={project.status === 'completed' || project.status === 'approved'}
                                                    >
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </button>
                                                    <button
                                                        onClick={() => viewInvestmentApprovalDashboard(projectId)}
                                                        className={styles.viewButton}
                                                        title="View Investment Approval Dashboard"
                                                    >
                                                        <FontAwesomeIcon icon={faChartLine} />
                                                    </button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        ) : !loading ? (
                            <div className={styles.noProjects}>
                                <p>You haven't created any projects yet.</p>
                                <button
                                    onClick={() => window.location.href = '/create-project'}
                                    className={styles.createButton}
                                >
                                    Create Your First Project
                                </button>
                            </div>
                        ) : null}
                        
                        {loading && projects.length === 0 && (
                            <div className={styles.loadingContainer}>
                                <div className={styles.largeSpinner} />
                                <p>Loading your projects...</p>
                            </div>
                        )}
                    </div>
                )}
                
                {activeTab === 'investments' && (
                    <div className={styles.investmentsContainer}>
                        <div className={styles.investmentsHeader}>
                            <h2 className={styles.sectionTitle}>
                                Your Investment Portfolio
                            </h2>
                        </div>
                        
                        <div className={styles.statsCards}>
                            <Card className={styles.statCard}>
                                <CardContent>
                                    <div className={styles.statCardIcon}><DollarSign size={24} /></div>
                                    <div className={styles.statCardValue}>${formatFunding(investmentStats.total_investment_amount)}</div>
                                    <div className={styles.statCardLabel}>Total Invested</div>
                                </CardContent>
                            </Card>
                            
                            <Card className={styles.statCard}>
                                <CardContent>
                                    <div className={styles.statCardIcon}><Award size={24} /></div>
                                    <div className={styles.statCardValue}>${formatFunding(investmentStats.approved_amount + investmentStats.completed_amount)}</div>
                                    <div className={styles.statCardLabel}>Active Investments</div>
                                </CardContent>
                            </Card>
                            
                            <Card className={styles.statCard}>
                                <CardContent>
                                    <div className={styles.statCardIcon}><BarChart3 size={24} /></div>
                                    <div className={styles.statCardValue}>{investmentStats.project_count}</div>
                                    <div className={styles.statCardLabel}>Projects</div>
                                </CardContent>
                            </Card>
                            
                            <Card className={styles.statCard}>
                                <CardContent>
                                    <div className={styles.statCardIcon}><Percent size={24} /></div>
                                    <div className={styles.statCardValue}>
                                        {userInvestments.length > 0 ? 
                                            (userInvestments.reduce((sum, inv) => sum + parseFloat(inv.equity_percentage || 0), 0) / userInvestments.length).toFixed(1) : 
                                            "0"}%
                                    </div>
                                    <div className={styles.statCardLabel}>Avg. Equity</div>
                                </CardContent>
                            </Card>
                        </div>
                        
                        {userInvestments.length > 0 ? (
                            <div className={styles.investmentsList}>
                                <div className={styles.investmentsTable}>
                                    <div className={styles.tableHeader}>
                                        <div className={styles.tableCell}>Project</div>
                                        <div className={styles.tableCell}>Amount</div>
                                        <div className={styles.tableCell}>Equity</div>
                                        <div className={styles.tableCell}>Status</div>
                                        <div className={styles.tableCell}>Date</div>
                                        <div className={styles.tableCell}>Actions</div>
                                    </div>
                                    
                                    {userInvestments.map((investment) => (
                                        <div key={investment.investment_id || investment.id} className={styles.tableRow}>
                                            <div className={styles.tableCell}>
                                                {investment.project?.title || "Unknown Project"}
                                            </div>
                                            <div className={styles.tableCell}>
                                                ${parseFloat(investment.amount).toLocaleString()}
                                            </div>
                                            <div className={styles.tableCell}>
                                                {parseFloat(investment.equity_percentage).toFixed(2)}%
                                            </div>
                                            <div className={styles.tableCell}>
                                                <span className={`${styles.investmentStatus} ${getInvestmentStatusColor(investment.status)}`}>
                                                    {investment.status}
                                                </span>
                                            </div>
                                            <div className={styles.tableCell}>
                                                {formatDate(investment.created_at)}
                                            </div>
                                            <div className={styles.tableCell}>
                                                <button
                                                    onClick={() => viewInvestmentDetails(investment.investment_id || investment.id)}
                                                    className={styles.viewButton}
                                                    title="View Investment Details"
                                                >
                                                    <FontAwesomeIcon icon={faChartLine} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className={styles.noInvestments}>
                                <p>You haven't made any investments yet.</p>
                                <button
                                    onClick={() => window.location.href = '/projects'}
                                    className={styles.browseButton}
                                >
                                    Browse Projects to Invest
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default MyProjects;