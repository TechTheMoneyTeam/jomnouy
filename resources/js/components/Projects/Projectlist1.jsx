import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Clock } from 'lucide-react';
import { RxBookmark } from "react-icons/rx";
import { Link } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import { FaRegClock } from "react-icons/fa";
import Footer1 from '../footer/footer1';
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
const Card = ({ className, children }) => (
    <div className={`bg-white rounded-lg overflow-hidden ${className || ''}`}>
        {children}
    </div>
);

const CardContent = ({ className, children }) => (
    <div className={`p-4 ${className || ''}`}>{children}</div>
);
const ProjectListing = () => {
    const [visibleCount, setVisibleCount] = useState(8); // Show first 18 projects
    const [visibleCount2, setVisibleCount2] = useState(4); // Show first 18 projects
    const [userId, setUserId] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [savingToFavorites, setSavingToFavorites] = useState(false);
      useEffect(() => {
            window.scrollTo(0, 0); 
        }, []);

    const loadMore = () => {
        setVisibleCount((prevCount) => prevCount + 8); // Load 18 more projects on each click
    };
    const carouselContainerRef = useRef(null);
    const [currentScrollPosition, setCurrentScrollPosition] = useState(0);
    const scrollStep = 400; // Amount to scroll in pixels
    // const [scrollPosition, setScrollPosition] = useState(0);
    // Function to scroll left
    const scrollLeftHandler = () => {
        if (carouselContainerRef.current) {
            const newScrollPosition = Math.max(0, currentScrollPosition - scrollStep);
            carouselContainerRef.current.scrollTo({
                left: newScrollPosition,
                behavior: 'smooth'
            });
            setCurrentScrollPosition(newScrollPosition);
        }
    };

    // Function to scroll right
    const scrollRightHandler = () => {
        if (carouselContainerRef.current) {
            const maxScrollPosition = carouselContainerRef.current.scrollWidth - carouselContainerRef.current.clientWidth;
            const newScrollPosition = Math.min(maxScrollPosition, currentScrollPosition + scrollStep);
            carouselContainerRef.current.scrollTo({
                left: newScrollPosition,
                behavior: 'smooth'
            });
            setCurrentScrollPosition(newScrollPosition);
        }
    };

    const scrollEndingSoonRef = useRef(null);
    const scrollNearYouRef = useRef(null);
    const scrollLeft = (ref) => {
        if (ref.current) {
            ref.current.scrollBy({
                left: -320,
                behavior: "smooth",
            });
        }
    };
    const scrollRight = (ref) => {
        if (ref.current) {
            ref.current.scrollBy({
                left: 320,
                behavior: "smooth",
            });
        }
    };
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);



    const fetchProjects = async () => {
        try {
            const response = await axios.get('/api/projects');
            setProjects(response.data);
            setError(null);
        } catch (error) {
            console.error('Error fetching projects:', error);
            setError('Failed to load projects');
        } finally {
            setLoading(false);
        }
    };
    // Initial fetch
    useEffect(() => {
        fetchProjects();
    }, []);
    // Set up polling for live updates every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            fetchProjects();
        }, 30000); // 30 seconds
        return () => clearInterval(interval);
    }, []);
    const formatFunding = (amount) => {
        if (amount >= 1000000) {
            return `${(amount / 1000000).toFixed(1)}M`;
        } else if (amount >= 1000) {
            return `${(amount / 1000).toFixed(1)}K`;
        }
        return amount;
    };

    const getDaysLeft = (endDate) => {
        const today = new Date();
        const end = new Date(endDate);
        const timeDiff = end - today;
        return Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
    };

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                setUserId(user.user_id);
                if (user.user_id) {
                    axios.get(`/api/users/${user.user_id}/favorites`)
                        .then(response => {
                            setFavorites(response.data);
                        })
                        .catch(error => {
                            console.error('Error fetching favorites:', error);
                        });
                }
            } catch (error) {
                console.error("Error parsing user data:", error);
            }
        }
    }, []);

    const handleToggleFavorite = (projectId) => {
        if (!userId) {
            alert("Please log in to save projects to your favorites.");
            return;
        }

        setSavingToFavorites(true);

        const isFavorite = favorites.some(fav => fav.project_id === projectId);

        if (isFavorite) {
            axios.delete(`/api/users/${userId}/favorites/${projectId}`)
                .then(() => {
                    setFavorites(favorites.filter(fav => fav.project_id !== projectId));
                })
                .catch(error => {
                    console.error('Error removing from favorites:', error);
                })
                .finally(() => {
                    setSavingToFavorites(false);
                });
        } else {
            axios.post(`/api/users/${userId}/favorites`, { project_id: projectId })
                .then(() => {
                    setFavorites([...favorites, { project_id: projectId }]);
                })
                .catch(error => {
                    console.error('Error adding to favorites:', error);
                })
                .finally(() => {
                    setSavingToFavorites(false);
                });
        }
    };

    if (error) {
        return (
            <div className="text-center py-8 text-red-600">
                {error}
                <button
                    onClick={fetchProjects}
                    className="ml-4 px-4 py-2 bg-orange-500 text-white rounded-lg"
                >
                    Retry
                </button>
            </div>
        );
    }
    return (
        <>
            <Navbar className="Navbar position:fixed" />

            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        <h2 className="text-sm font-semibold text-gray-600 mb-4">FEATURED PROJECT</h2>
                        <div className="bg-white rounded-lg overflow-hidden mb-4 py-2">
                            {projects.length > 0 && (() => {
                                const featuredProject = projects[0]; // Retrieve the first project

                                return (
                                    <>
                                        <div className="flex justify-center items-center">
                                            <div className="relative w-full h-full overflow-hidden rounded-sm">
                                                <img
                                                    src={featuredProject.project_img ? `/storage/${featuredProject.project_img}` : "/api/placeholder/400/200"}
                                                    alt={featuredProject.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center">
                                                    {/* <div className="h-10 w-10 bg-gray-200 rounded-full overflow-hidden mr-4">
                                                                                                                                                                                                                  <img src={featuredProject.logo} alt="Company logo" className="h-full w-full object-cover" />
                                                                                                                                                                                                   </div> */}
                                                    <div className="profile-avatar">
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z" />
                                                        </svg>
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-semibold">{featuredProject.title}</h3>
                                                        {featuredProject.user?.username || featuredProject.user?.name || featuredProject.user?.full_name || "Unknown Creator"}
                                                    </div>
                                                </div>
                                                <button className="text-gray-500">
                                                    <RxBookmark size={24} />
                                                </button>
                                            </div>
                                            <div className="flex items-center text-sm text-gray-500 mb-2 ml-md">
                                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                                    <Clock size={16} />
                                                    <span>{getDaysLeft(featuredProject.auction_end_date)} days ago</span>
                                                    <span>•</span>
                                                    <span>{formatFunding(featuredProject.funding_goal)} Funded</span>
                                                </div>
                                            </div>
                                            <div className="m-2 description text-sm text-black font-normal">
                                                {featuredProject.project_des}
                                            </div>
                                            <p className="text-gray-800 mb-4">{featuredProject.description}</p>
                                            <div className="flex flex-wrap gap-2">
                                                <span className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 text-sm">
                                                    {featuredProject.project_location}
                                                </span>
                                                <span className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 text-sm">
                                                    {featuredProject.categories}
                                                </span>
                                            </div>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-gray-600 mb-4">RECOMMENDED FOR YOU</h2>
                        <div className="relative">
                            {/* Left navigation button */}

                            {/* Projects container with horizontal scrolling */}
                            <div
                                ref={carouselContainerRef}
                                className="flex overflow-x-hidden scroll-smooth gap-6 py-2"
                                style={{ scrollBehavior: 'smooth' }}
                            >
                                {projects.map((project) => (
                                    <Link
                                        to={`/projects/${project.project_id}`}
                                        key={project.project_id}
                                        className="min-w-[300px] max-w-[300px] flex-shrink-0"
                                    >
                                        <Card className="rounded-sm overflow-hidden group relative mb-4 transition-shadow duration-300 hover:shadow-lg h-full">
                                            <img
                                                src={project.project_img ? `/storage/${project.project_img}` : "/api/placeholder/400/200"}
                                                alt={project.title}
                                                className="w-full h-36 object-cover"
                                                onError={(e) => {
                                                    e.target.src = "/api/placeholder/400/200";
                                                }}
                                            />
                                            <CardContent>
                                                <div className="flex items-center mb-3">
                                                    <div className="profile-avatar">
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z" />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-1 flex flex-col flex-grow">
                                                        <h3 className="font-medium text-md">{project.title}</h3>
                                                        <div className="text-gray-500 text-xs">
                                                            {project.user?.username || project.user?.name || project.user?.full_name || "Unknown Creator"}
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-end">
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                handleToggleFavorite(project.project_id);
                                                            }}
                                                            disabled={savingToFavorites}
                                                        >
                                                            {favorites.some(fav => fav.project_id === project.project_id) ? (
                                                                <RxBookmark className="text-blue-500" />
                                                            ) : (
                                                                <RxBookmark />
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="flex items-center text-sm text-gray-500 mb-2 ml-2">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Clock size={16} />
                                                        <span>{getDaysLeft(project.auction_end_date)} days ago</span>
                                                        <span>•</span>
                                                        <span>{formatFunding(project.funding_goal)} Funded</span>
                                                    </div>
                                                </div>
                                                {/* Hidden description, shown on hover */}
                                                <div className="opacity-0 max-h-0 overflow-hidden group-hover:opacity-100 group-hover:max-h-[100px] transition-all duration-300">
                                                    <p className="text-xs text-black/80 font-normal">{project.project_des}</p>
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        <button className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 text-xs bg-white hover:bg-gray-100 transition-all duration-300">
                                                            {project.project_location}
                                                        </button>
                                                        <button className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 text-xs bg-white hover:bg-gray-100 transition-all duration-300">
                                                            {project.categories}
                                                        </button>

                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-center mt-8">
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={scrollLeftHandler}
                                    className="bg-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 disabled:opacity-50"
                                    disabled={currentScrollPosition <= 0}
                                >
                                    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current text-gray-700">
                                        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                                    </svg>
                                </button>

                                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-500 text-white font-medium">1</button>
                                <button className="w-8 h-8 flex items-center justify-center rounded-full text-black font-medium">2</button>
                                <button className="w-8 h-8 flex items-center justify-center rounded-full text-black font-medium">3</button>

                                <button
                                    onClick={scrollRightHandler}
                                    className="bg-whitew-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 disabled:opacity-50"
                                // disabled={carouselContainerRef.current && currentScrollPosition >= carouselContainerRef.current.scrollWidth - carouselContainerRef.current.clientWidth}
                                >
                                    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current text-gray-700">
                                        <path d="M10.59 7.41L12 6l6 6-6 6-1.41-1.41L15.17 12z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="py-8">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-semibold">
                                Explore <span className="text-orange-500"> {projects.length} Projects</span>
                            </h2>
                            {loading && (
                                <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
                        {projects.slice(0, visibleCount).map((project) => (
                            <div key={project.project_id} className="relative group">
                                <Link to={`/projects/${project.project_id}`}>
                                    <Card className="rounded-lg overflow-hidden relative h-auto mb-2 transition-all duration-300 hover:shadow-lg hover:scale-105 w-full">
                                        <div className="relative">
                                            <img
                                                src={project.project_img ? `/storage/${project.project_img}` : "/api/placeholder/400/200"}
                                                alt={project.title}
                                                className="pro-image w-full h-48 object-cover transition-transform duration-300 group-hover:h-56"
                                                onError={(e) => {
                                                    e.target.src = "/api/placeholder/400/200";
                                                }}
                                            />
                                        </div>
                                        <CardContent className="p-4 transition-all duration-300">
                                            <div className="flex items-center mb-3">
                                                <div className="profile-avatar">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z" />
                                                    </svg>
                                                </div>
                                                <div className="ml-2 flex flex-col flex-grow">
                                                    <h3 className="font-medium text-md">{project.title}</h3>
                                                    <div className="text-gray-500 text-xs">
                                                        {project.user?.username || project.user?.name || project.user?.full_name || "Unknown Creator"}
                                                    </div>
                                                </div>
                                                <div className="flex justify-end">
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleToggleFavorite(project.project_id);
                                                        }}
                                                        disabled={savingToFavorites}
                                                    >
                                                        {favorites.some(fav => fav.project_id === project.project_id) ? (
                                                            <RxBookmark className="text-blue-500" />
                                                        ) : (
                                                            <RxBookmark />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex items-center text-sm text-gray-500 mb-2">
                                                <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                                                    <Clock size={16} />
                                                    <span>{getDaysLeft(project.auction_end_date)} days ago</span>
                                                    <span>•</span>
                                                    <span>{formatFunding(project.funding_goal)} Funded</span>
                                                </div>
                                            </div>

                                            {/* Hidden description, shown on hover */}
                                            <div className="opacity-0 max-h-0 overflow-hidden group-hover:opacity-100 group-hover:max-h-[100px] transition-all duration-300">
                                                <p className="text-xs text-black/80 font-normal">{project.project_des}</p>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    <button className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 text-xs bg-white hover:bg-gray-100 transition-all duration-300">
                                                        {project.project_location}
                                                    </button>
                                                    <button className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 text-xs bg-white hover:bg-gray-100 transition-all duration-300">
                                                        {project.categories}
                                                    </button>

                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </div>
                        ))}
                    </div>
                    {visibleCount < projects.length && (
                        <div className="flex justify-center mt-6">
                            <button
                                onClick={loadMore}
                                className="px-4 py-2 bg-orange-500 text-white rounded-md shadow-md hover:bg-orange-500/80 transition"
                            >
                                Load More
                            </button>
                        </div>
                    )}
                    {projects.length === 0 && !loading && (
                        <div className="text-center py-12 text-gray-500">No projects found</div>
                    )}
                    {loading && projects.length === 0 && (
                        <div className="flex justify-center items-center py-12">
                            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}
                </div>
                <hr className='hr-pro' />
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <h2 className="text-base font-normal flex items-center gap-2">
                                ENDING SOON
                                <span className="near-span">
                                    <Link to="/project-ending-soon" className='underline'>Discover more</Link>
                                    <MdOutlineKeyboardArrowRight size={20} className='pt-1' />
                                </span>
                            </h2>
                        </div>
                        <div className="flex items-center gap-2 space-x-8">
                            <button className="p-2 rounded-full border border-transparent hover:border-orange-500 text-gray-500 hover:text-orange-500 transition"
                                onClick={() => scrollLeft(scrollEndingSoonRef)}
                            >
                                <MdOutlineKeyboardArrowLeft size={22} />
                            </button>
                            <button className="p-2 rounded-full border border-transparent hover:border-orange-500 text-gray-500 hover:text-orange-500 transition"
                                onClick={() => scrollRight(scrollEndingSoonRef)}
                            >
                                <MdOutlineKeyboardArrowRight size={22} />
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto" ref={scrollEndingSoonRef}>
                        <div className="flex gap-6">
                            {projects.map((project, index) => (
                                <Link to={`/projects/${project.project_id}`} key={project.project_id}>
                                    <Card
                                        className={`w-80 flex-shrink-0 transform transition-transform hover:scale-105}`}
                                    >
                                        <img

                                            src={project.project_img ? `/storage/${project.project_img}` : "/api/placeholder/400/200"}
                                            alt={project.title}
                                            className="pro-image w-full h-48 object-cover"
                                            onError={(e) => {
                                                e.target.src = "/api/placeholder/400/200";
                                            }}
                                        />
                                        <CardContent>
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-6 h-6 bg-gray-200 rounded-full" />
                                                <span className="font-medium">{project.title}</span>
                                            </div>
                                            <div className="text-sm text-gray-600 mb-2">
                                                Type: {project.project_type}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Clock size={16} />
                                                <span>{getDaysLeft(project.auction_end_date)} days left</span>
                                                <span>•</span>
                                                <span>{formatFunding(project.funding_goal)} Funded</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
                <hr className='hr-pro' />
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <h2 className="text-base font-normal flex items-center gap-2">
                                NEAR YOU
                                <span className="near-span">
                                    <Link to="/project-near-you" className="underline">Discover more</Link>
                                    <MdOutlineKeyboardArrowRight size={20} className='pt-1' />
                                </span>
                            </h2>
                        </div>
                        <div className="flex items-center gap-2 space-x-8">
                            <button className="p-2 rounded-full border border-transparent hover:border-orange-500 text-gray-500 hover:text-orange-500 transition"
                                onClick={() => scrollLeft(scrollNearYouRef)}
                            >
                                <MdOutlineKeyboardArrowLeft size={22} />

                            </button>
                            <button className="p-2 rounded-full border border-transparent hover:border-orange-500 text-gray-500 hover:text-orange-500 transition"
                                onClick={() => scrollRight(scrollNearYouRef)}
                            >
                                <MdOutlineKeyboardArrowRight size={22} />
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto" ref={scrollNearYouRef}>
                        <div className="flex gap-6">
                            {projects.map((project, index) => (
                                <Link to={`/projects/${project.project_id}`} key={project.project_id}>
                                    <Card
                                        className={`w-80 flex-shrink-0 transform transition-transform hover:scale-105`}
                                    >
                                        <img
                                            src={project.project_img ? `/storage/${project.project_img}` : "/api/placeholder/400/200"}
                                            alt={project.title}
                                            className="pro-image w-full h-48 object-cover"
                                            onError={(e) => {
                                                e.target.src = "/api/placeholder/400/200";
                                            }}
                                        />
                                        <CardContent>
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-6 h-6 bg-gray-200 rounded-full" />
                                                <span className="font-medium">{project.title}</span>
                                            </div>
                                            <div className="text-sm text-gray-600 mb-2">
                                                Type: {project.project_type}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Clock size={16} />
                                                <span>{getDaysLeft(project.auction_end_date)} days ago</span>
                                                <span>•</span>
                                                <span>{formatFunding(project.funding_goal)} Funded</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Footer1 />
        </>
    );
};
export default ProjectListing;
