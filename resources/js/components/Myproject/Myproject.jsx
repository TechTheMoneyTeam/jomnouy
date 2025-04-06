import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, DollarSign, BriefcaseBusiness, CheckCircle, AlertCircle, MoreVertical, CircleDashed, UserCheck, CheckCheck } from 'lucide-react';
import Navbar2 from '../Navbar/Navbarforsubmit';
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
            case 'approved':
                return styles.statusApproved;
            case 'pending':
                return styles.statusPending;
            default:
                return styles.statusDefault;
        }
    };

    return (
        <span className={`${styles.statusBadge} ${getStatusColor()}`}>
            {status || 'TBD'}
        </span>
    );
};

// Delete Confirmation Modal Component
const DeleteModal = ({ isOpen, onClose, onConfirm, projectTitle }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h3 className={styles.modalTitle}>Confirm Delete</h3>
                <p className={styles.modalMessage}>
                    Are you sure you want to delete the project
                    <span className={styles.highlightText}> "{projectTitle}" </span>?
                    This action cannot be undone.
                </p>
                <div className={styles.modalActions}>
                    <button
                        className={styles.cancelButton}
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className={styles.deleteButton}
                        onClick={onConfirm}
                    >
                        Delete Project
                    </button>
                </div>
            </div>
        </div>
    );
};

const MyProjects = () => {
    const [projects, setProjects] = useState([]);
    const [projectInvestments, setProjectInvestments] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);
    const [username, setUsername] = useState('');
    const [openDropdown, setOpenDropdown] = useState(null);
    // State for delete confirmation modal
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        projectId: null,
        projectTitle: ''
    });
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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
        } else {
            setLoading(false);
        }
    }, [userId]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(`.${styles.menuContainer}`)) {
                setOpenDropdown(null);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

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

    const fetchProjectInvestments = async (projectId) => {
        try {
            const response = await axios.get(`/api/project-investments/${projectId}`);
            console.log(`Investments for project ${projectId}:`, response.data);

            // Get investments array
            const investments = response.data.investments ||
                (Array.isArray(response.data) ? response.data : []);

            // Calculate investment stats from actual investment data
            const pendingInvestments = investments.filter(inv => inv.status === 'pending');
            const approvedInvestments = investments.filter(inv => inv.status === 'approved');
            const completedInvestments = investments.filter(inv => inv.status === 'completed');

            // Calculate investment amounts
            const totalPendingAmount = pendingInvestments.reduce((sum, inv) => sum + parseFloat(inv.amount || 0), 0);
            const totalApprovedAmount = approvedInvestments.reduce((sum, inv) => sum + parseFloat(inv.amount || 0), 0);
            const totalCompletedAmount = completedInvestments.reduce((sum, inv) => sum + parseFloat(inv.amount || 0), 0);
            const totalRaisedAmount = totalApprovedAmount + totalCompletedAmount;

            // Get project to calculate funding percentage
            const project = projects.find(p => (p.project_id || p.id) === projectId);
            const fundingGoal = project ? parseFloat(project.funding_goal || 0) : 0;
            const fundingPercentage = fundingGoal > 0
                ? Math.min(Math.round((totalRaisedAmount / fundingGoal) * 100), 100)
                : 0;

            setProjectInvestments(prev => ({
                ...prev,
                [projectId]: {
                    investments: investments,
                    total_investment_count: investments.length,
                    pending_count: pendingInvestments.length,
                    approved_count: approvedInvestments.length,
                    completed_count: completedInvestments.length,
                    total_pending_amount: totalPendingAmount,
                    total_approved_amount: totalApprovedAmount,
                    total_completed_amount: totalCompletedAmount,
                    total_raised_amount: totalRaisedAmount,
                    funding_goal: fundingGoal,
                    funding_percentage: fundingPercentage
                }
            }));
        } catch (error) {
            console.error(`Failed to fetch investments for project ${projectId}:`, error);
            // Set empty data structure to avoid errors in rendering
            setProjectInvestments(prev => ({
                ...prev,
                [projectId]: {
                    investments: [],
                    total_investment_count: 0,
                    pending_count: 0,
                    approved_count: 0,
                    completed_count: 0,
                    total_pending_amount: 0,
                    total_approved_amount: 0,
                    total_completed_amount: 0,
                    total_raised_amount: 0,
                    funding_goal: 0,
                    funding_percentage: 0
                }
            }));
        }
    };

    // Open delete confirmation modal
    const openDeleteConfirmation = (projectId) => {
        const project = projects.find(p => (p.project_id || p.id) === projectId);
        setDeleteModal({
            isOpen: true,
            projectId: projectId,
            projectTitle: project.title || 'this project'
        });
    };

    // Close delete confirmation modal
    const closeDeleteModal = () => {
        setDeleteModal({
            isOpen: false,
            projectId: null,
            projectTitle: ''
        });
    };

    // Actual delete project function
    const deleteProject = async () => {
        const projectId = deleteModal.projectId;
        if (!projectId) return;

        try {
            await axios.delete(`/api/projects/${projectId}`);
            setProjects(projects.filter(project => (project.project_id || project.id) !== projectId));
            // Also remove investment data for this project
            const newProjectInvestments = { ...projectInvestments };
            delete newProjectInvestments[projectId];
            setProjectInvestments(newProjectInvestments);
            closeDeleteModal();
        } catch (error) {
            console.error('Failed to delete project:', error);
            setError('Failed to delete the project. Please try again.');
            closeDeleteModal();
        }
    };

    const editProject = (projectId) => {
        window.location.href = `/edit-project/${projectId}`;
    };

    const viewProjectDetails = (projectId) => {
        window.location.href = `/projects/${projectId}`;
    };

    const viewInvestmentApprovalDashboard = (projectId) => {
        window.location.href = `/investment-approval-dashboard/${projectId}`;
    };

    const toggleDropdown = (e, projectId) => {
        e.stopPropagation();
        setOpenDropdown(openDropdown === projectId ? null : projectId);
    };

    const formatFunding = (amount) => {
        if (!amount) return "$0";
        if (amount >= 1000000) {
            return `$${(amount / 1000000).toFixed(1)}M`;
        } else if (amount >= 1000) {
            return `$${(amount / 1000).toFixed(1)}K`;
        }
        return `$${amount}`;
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
        const investmentData = projectInvestments[projectId];
        if (!investmentData) return 0;
        return investmentData.funding_percentage || 0;
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
            <Navbar2 />
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>My Projects</h1>
                    <p className={styles.welcomeText}>
                        Welcome back, <span className={styles.username}>{username}</span>
                    </p>
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

                <div className={styles.projectsContainer}>
                    <div className={styles.projectsHeader}>
                        <h2 className={styles.sectionTitle}>
                            Total :  <span className={styles.highlight}>{projects.length} projects</span>
                        </h2>

                        <div className={styles.buttonGroup}>
                            {/* <button
                                onClick={() => window.location.href = '/create'}
                                className={styles.createButton}
                            >
                                Create New Project
                            </button> */}
                            <button
                                onClick={() => window.location.href = '/investment-approval-dashboard/1'}
                                className={styles.dashboardButton}
                            >
                                Dashboard
                            </button>
                        </div>
                    </div>
                </div>

                {projects.length > 0 ? (
                    <div className={styles.projectGrid}>
                        {projects.map((project) => {
                            const projectId = project.project_id || project.id;
                            const investmentData = projectInvestments[projectId] || {
                                pending_count: 0,
                                approved_count: 0,
                                completed_count: 0,
                                total_pending_amount: 0,
                                total_approved_amount: 0,
                                total_completed_amount: 0,
                                total_raised_amount: 0
                            };

                            const investmentStatus = investmentData.pending_count > 0 ? 'pending' :
                                investmentData.approved_count > 0 ? 'approved' :
                                    investmentData.completed_count > 0 ? 'completed' : 'TBD';

                            const isCompleted = investmentStatus === 'completed' || investmentStatus === 'approved';

                            return (
                                <Card key={projectId} className={styles.projectCard}>
                                    <div className={styles.cardHeader}>
                                        <StatusBadge status={investmentStatus} />
                                        <img
                                            src={project.project_img_url || project.image_url || "/api/placeholder/400/200"}
                                            alt={project.title}
                                            className={styles.projectImage}
                                            onError={(e) => {
                                                e.target.src = "/api/placeholder/400/200";
                                            }}
                                            onClick={() => viewProjectDetails(projectId)}
                                        />
                                        <div className={styles.menuContainer}>
                                            <button
                                                className={styles.menuButton}
                                                onClick={(e) => toggleDropdown(e, projectId)}
                                            >
                                                <MoreVertical size={20} />
                                            </button>
                                            {openDropdown === projectId && (
                                                <div className={styles.verticalMenu}>
                                                    <div
                                                        className={styles.menuItem}
                                                        onClick={() => viewProjectDetails(projectId)}
                                                    >
                                                        View Details
                                                    </div>
                                                    <div
                                                        className={styles.menuItem}
                                                        onClick={() => editProject(projectId)}
                                                    >
                                                        Edit Project
                                                    </div>
                                                    <div
                                                        className={`${styles.menuItem} ${isCompleted ? styles.disabled : ''}`}
                                                        onClick={() => !isCompleted && openDeleteConfirmation(projectId)}
                                                    >
                                                        Delete Project
                                                    </div>
                                                    <div
                                                        className={styles.menuItem}
                                                        onClick={() => viewInvestmentApprovalDashboard(projectId)}
                                                    >
                                                        Investment Dashboard
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <CardContent>
                                        <div className={styles.projectTitleRow}>
                                            <span className={styles.projectTitle}>{project.title}</span>
                                        </div>
                                        <div className={styles.projectType}>
                                            {project.project_type || project.type || "N/A"}
                                        </div>
                                        <div className={styles.projectDescription}>
                                            {project.description?.slice(0, 100)}
                                            {project.description?.length > 100 ? '...' : ''}
                                        </div>



                                        {/* <div className={styles.investmentStatus}> */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                            <div className="p-4 text-center rounded-xl flex flex-col items-center justify-center bg-[#f9e79f]/50">
                                                {/* <CircleDashed size={22} /> */}
                                                <span className="font-medium">{investmentData.pending_count}</span>
                                                <span className="font-medium text-md">Pending</span>
                                                <span className="font-medium text-sm">
                                                    {formatFunding(investmentData.total_pending_amount)}
                                                </span>
                                            </div>
                                        

                                            <div className="p-4 text-center rounded-xl flex flex-col bg-[#66BB6A]/40">
                                                {/* <CircleDashed size={16} className={styles.statusIcon} /> */}
                                                <span className={styles.statusCount}>{investmentData.pending_count}</span>
                                                <span className={styles.statusLabel}>Approved</span>
                                                <span className={styles.statusAmount}>
                                                    {formatFunding(investmentData.total_pending_amount)}
                                                </span>
                                            </div>
                                            <div className="p-4 text-center rounded-xl flex flex-col bg-[#27ae60]/30">
                                                {/* <CircleDashed size={16} className={styles.statusIcon} /> */}
                                                <span className={styles.statusCount}>{investmentData.pending_count}</span>
                                                <span className={styles.statusLabel}>Completed</span>
                                                <span className={styles.statusAmount}>
                                                    {formatFunding(investmentData.total_pending_amount)}
                                                </span>
                                            </div>
                                        </div>
                                        {/* <div className="table-cell p-4 text-center align-middle  bg-[#8e44ad]/20">
                                                <CircleDashed size={16} className={styles.statusIcon} />
                                                <span className={styles.statusCount}>{investmentData.pending_count}</span>
                                                <span className={styles.statusLabel}>Pending</span>
                                                <span className={styles.statusAmount}>
                                                    {formatFunding(investmentData.total_pending_amount)}
                                                </span>
                                            </div> */}
                                        {/* <div className={styles.investmentItem}>
                                                <UserCheck size={16} className={styles.statusIcon} />
                                                <span className={styles.statusCount}>
                                                    {investmentData.approved_count > 0
                                                        ? `${investmentData.approved_count} x`
                                                        : '0'}
                                                </span>
                                                <span className={styles.statusLabel}>Approved</span>
                                                <span className={styles.statusAmount}>
                                                    {formatFunding(investmentData.total_approved_amount)}
                                                </span>
                                            </div>
                                            <div className={styles.investmentItem}>
                                                <CheckCheck size={16} className={styles.statusIcon} />
                                                <span className={styles.statusCount}>
                                                    {investmentData.completed_count > 0
                                                        ? `Done`
                                                        : '0'}
                                                </span>
                                                <span className={styles.statusLabel}>Completed</span>
                                                <span className={styles.statusAmount}>
                                                    {formatFunding(investmentData.total_completed_amount)}
                                                </span>
                                            </div> */}
                                        {/* </div> */}
                                        <div className={styles.statsRow}>
                                            <div className={styles.stat}>
                                                <DollarSign
                                                    size={26}
                                                    className="rounded-full  p-1 border-gray-400 bg-[#f7dc6f]/50 text-[#f4d03f] "
                                                />

                                                <span className={styles.statValue}>
                                                    {formatFunding(project.funding_goal || project.funding || 0)}
                                                </span>
                                                <span className={styles.statLabel}>Goal</span>
                                            </div>
                                            <div className={styles.stat}>
                                                <BriefcaseBusiness
                                                    size={26}
                                                    className="rounded-full  p-1 border-gray-400 bg-[#2ecc71]/40 text-[#2ecc71]"
                                                />
                                                <span className={styles.statValue}>
                                                    {investmentData.total_investment_count || 0}
                                                </span>
                                                <span className={styles.statLabel}>Investments</span>
                                            </div>
                                            <div className={styles.stat}>
                                                <Clock size={24}
                                                    className="rounded-full  p-1 border-gray-400 bg-[#2e86c1]/40 text-[#2e86c1]" />
                                                <span className={styles.statValue}>
                                                    {getDaysSinceCreation(project.created_at)}
                                                </span>
                                                <span className={styles.statLabel}>Days</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                ) : !loading ? (
                    <div className={styles.noProjects}>
                        <div className={styles.emptyStateIcon}></div>
                        <p>You haven't created any projects yet.</p>
                        <button
                            onClick={() => window.location.href = '/create-project'}
                            className={styles.createButton}
                        >
                            Create Your First Project
                        </button>
                    </div>
                ) : null}

                {loading && (
                    <div className={styles.loadingContainer}>
                        <div className={styles.spinner}></div>
                        <p>Loading your projects...</p>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                <DeleteModal
                    isOpen={deleteModal.isOpen}
                    onClose={closeDeleteModal}
                    onConfirm={deleteProject}
                    projectTitle={deleteModal.projectTitle}
                />
            </div>
        </>
    );
};

export default MyProjects;