import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    MapPin,
    Phone,
    Mail,
    Facebook,
    Linkedin,
    Twitter,
    Search,
} from "lucide-react";
import axios from "axios";
import { ArrowLeft, ArrowRight } from "lucide-react"; // Import arrow icons
import "./Home.css";
import ContactFounder from "../Contactfounder/Contactfounder"; // Update this path to your actual ContactFounder path

const Home = () => {
    const [language, setLanguage] = useState("en");

    const toggleLanguage = () => {
        setLanguage((prev) => (prev === "en" ? "km" : "en"));
    };

    const Header = () => {
        const location = useLocation();

        return (
            <header className="header">
                <nav className="nav-container">
                    <Link to="/" className="logo">
                        Jom<span className="nouy">nouy</span>
                    </Link>
                    <div className="nav-links">
                        {["/", "/services", "/about"].map((path) => (
                            <Link
                                key={path}
                                to={path}
                                className={`nav-link ${
                                    location.pathname === path
                                        ? "active-link"
                                        : ""
                                }`}
                            >
                                {path === "/"
                                    ? "Home"
                                    : path.slice(1).charAt(0).toUpperCase() +
                                      path.slice(2)}
                            </Link>
                        ))}
                        <Link to="/login" className="login-button">
                            <span>Login</span>
                        </Link>
                    </div>
                    <div className="button-group">
                        <button className="search-button">
                            <Search />
                        </button>
                        <button
                            onClick={toggleLanguage}
                            className="language-button"
                        >
                            <span className="flag-icon">🇰🇭</span>
                            {language === "en" ? "English" : "ខ្មែរ"}
                        </button>
                    </div>
                </nav>
            </header>
        );
    };

    const Hero = () => (
        <section className="hero">
            <div className="hero-background"></div>
            <div className="hero-content">
                <div className="hero-text-section">
                    <h1 className="hero-title">ផ្លាស់ប្តូរជីវិត</h1>
                    <p className="hero-description">របស់អ្នកជាមួយ</p>
                    <p className="hero-description2">
                        "Jom<span>nouy"</span>
                    </p>
                    <a href="/signup" className="hero-button">
                        ចាប់ផ្តើមឥឡូវនេះ ➜
                    </a>
                </div>
                <div className="hero-image-wrapper">
                    <img
                        src="/img/hero.png"
                        alt="Illustration of investment opportunities"
                        className="analytics-image"
                    />
                </div>
            </div>
        </section>
    );

    const ProjectShow = () => {
        const [projects, setProjects] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);
        const [currentIndex, setCurrentIndex] = useState(0);
        const [direction, setDirection] = useState("next"); // Track the direction of the change
        const projectsPerPage = 5; // Display 5 projects at a time

        useEffect(() => {
            const fetchProjects = async () => {
                try {
                    const response = await axios.get("/api/projects"); // Fetch projects from API
                    setProjects(response.data);
                    setError(null);
                } catch (error) {
                    console.error("Error fetching projects:", error);
                    setError("Failed to load projects");
                } finally {
                    setLoading(false);
                }
            };

            fetchProjects();
            const interval = setInterval(fetchProjects, 30000); // Refresh every 30s
            return () => clearInterval(interval);
        }, []);

        if (loading) return <p className="text-center">Loading projects...</p>;
        if (error) return <p className="text-center">{error}</p>;
        if (projects.length === 0)
            return <p className="text-center">No projects available.</p>;

        // Handle next and previous functionality
        const nextProject = () => {
            setDirection("next");
            setCurrentIndex((prevIndex) => (prevIndex + 1) % projects.length);
        };

        const prevProject = () => {
            setDirection("prev");
            setCurrentIndex((prevIndex) =>
                prevIndex === 0 ? projects.length - 1 : prevIndex - 1
            );
        };

        // Get the projects for the current page (rotating through the list)
        const visibleProjects = [];
        for (let i = 0; i < projectsPerPage; i++) {
            visibleProjects.push(
                projects[(currentIndex + i) % projects.length]
            );
        }

        return (
            <div className="project-container">
                <h2 className="project-title-section">Tops Projects</h2>

                {/* Pagination Buttons */}
                <div className="absolute top-0 right-0 flex gap-2 z-10">
                    <button onClick={prevProject} className="prev-btn">
                        <ArrowLeft />
                    </button>

                    <button onClick={nextProject} className="next-btn">
                        <ArrowRight />
                    </button>
                </div>

                {/* Project Cards - Centered and Limited to 5 */}
                <div className="project-grid">
                    {visibleProjects.map((project, index) => {
                        // Check for user data in different possible formats
                        const userName =
                            project.user?.username ||
                            project.user?.name ||
                            project.user?.full_name ||
                            "Unknown User";

                        return (
                            <div key={index} className="project-card">
                                <img
                                    src={
                                        project.project_img
                                            ? `/storage/${project.project_img}`
                                            : "/img/default-project.png"
                                    }
                                    alt={project.title}
                                    className="project-image w-full h-40 object-cover rounded-lg"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src =
                                            "/img/default-project.png";
                                    }}
                                />
                                <h3 className="project-title p-2 text-lg font-bold mt-3">
                                    Project:{" "}
                                    {project.title || "Untitled Project"}
                                </h3>
                                <p className="project-username text-gray-500">
                                    By: {userName}
                                </p>
                                <p className="project-description2">
                                    Description:{" "}
                                    {project.project_des ||
                                        "No description available"}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* Explore More Button */}
                <div className="flex justify-center mt-8">
                    <Link to="/projectlist1" className="explore-btn">
                        <span>Explore More</span>
                    </Link>
                </div>
            </div>
        );
    };

    const FeaturedProject = () => {
        const [projects, setProjects] = useState([]);
        const [currentIndex, setCurrentIndex] = useState(0);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);
        const [showContactModal, setShowContactModal] = useState(false);

        useEffect(() => {
            const fetchProjects = async () => {
                try {
                    // Fetch all projects instead of filtering by type
                    const response = await axios.get("/api/projects");

                    // Randomize the order of projects
                    const shuffledProjects = response.data.sort(
                        () => 0.5 - Math.random()
                    );
                    setProjects(shuffledProjects);
                    setError(null);
                } catch (error) {
                    console.error("Error fetching projects:", error);
                    setError("Failed to load featured project");
                } finally {
                    setLoading(false);
                }
            };

            fetchProjects();
        }, []);

        if (loading)
            return <p className="text-center">Loading featured project...</p>;
        if (error) return <p className="text-center">{error}</p>;
        if (projects.length === 0)
            return <p className="text-center">No projects available.</p>;

        const handlePrev = () => {
            setCurrentIndex((prevIndex) =>
                prevIndex === 0 ? projects.length - 1 : prevIndex - 1
            );
        };

        const handleNext = () => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % projects.length);
        };

        const currentProject = projects[currentIndex];
        // Check for user data in different possible formats
        const userName =
            currentProject.user?.username ||
            currentProject.user?.name ||
            currentProject.user?.full_name ||
            "Unknown User";

        return (
            
            <div className="startup-container">
                <div className="container-title">
                    Featured <span>Project</span>
                </div>
                <div className="content-container">
                    <button onClick={handlePrev} className="arrow-button left">
                        ←
                    </button>
                    <div className="image-container">
                        <img
                            src={
                                currentProject.project_img
                                    ? `/storage/${currentProject.project_img}`
                                    : "/img/default-project.png"
                            }
                            alt={currentProject.title}
                            className="image"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/img/default-project.png";
                            }}
                        />
                    </div>
                    <div className="text-container">
                        <h2 className="project-title">
                            {currentProject.title || "Untitled Project"}
                        </h2>
                        <p className="project-creator">By {userName}</p>
                        <p className="project-description">
                            {currentProject.project_des ||
                                "No description available"}
                        </p>
                        <p className="project-type">
                            {currentProject.categories || "Project"}
                        </p>
                        <p className="project-goal">
                            <strong>Investment Goal:</strong> $
                            {currentProject.funding_goal?.toLocaleString() ||
                                "Not specified"}
                        </p>
                        <p className="project-min">
                            <strong>Min Investment:</strong> $
                            {currentProject.reserve_price?.toLocaleString() ||
                                "Not specified"}
                        </p>

                        <div className="button-container">
                            <button
                                onClick={() => setShowContactModal(true)}
                                className="button1"
                            >
                                <span>Contact Founder</span>
                            </button>
                            <Link to="/projectlist1" className="button2">
                                <span>See More</span>
                            </Link>
                        </div>
                    </div>
                    <button onClick={handleNext} className="arrow-button right">
                        →
                    </button>
                </div>

                {/* Contact Founder Modal */}
                {showContactModal && currentProject && (
                    <ContactFounder
                        project={currentProject}
                        onClose={() => setShowContactModal(false)}
                    />
                )}
            </div>
        );
    };
    const AuctionProject= () => {
        const [projects, setProjects] = useState([]);
        const [currentIndex, setCurrentIndex] = useState(0);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);
        const [showContactModal, setShowContactModal] = useState(false);

        useEffect(() => {
            const fetchProjects = async () => {
                try {
                    // Fetch all projects instead of filtering by type
                    const response = await axios.get("/api/projects");

                    // Randomize the order of projects
                    const shuffledProjects = response.data.sort(
                        () => 0.5 - Math.random()
                    );
                    setProjects(shuffledProjects);
                    setError(null);
                } catch (error) {
                    console.error("Error fetching projects:", error);
                    setError("Failed to load featured project");
                } finally {
                    setLoading(false);
                }
            };

            fetchProjects();
        }, []);

        if (loading)
            return <p className="text-center">Loading featured project...</p>;
        if (error) return <p className="text-center">{error}</p>;
        if (projects.length === 0)
            return <p className="text-center">No projects available.</p>;

        const handlePrev = () => {
            setCurrentIndex((prevIndex) =>
                prevIndex === 0 ? projects.length - 1 : prevIndex - 1
            );
        };

        const handleNext = () => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % projects.length);
        };

        const currentProject = projects[currentIndex];
        // Check for user data in different possible formats
        const userName =
            currentProject.user?.username ||
            currentProject.user?.name ||
            currentProject.user?.full_name ||
            "Unknown User";

        return (
            
            <div className="startup-container">
                <div className="container-title">
                    <span>Hightest</span> Auction
                </div>
                <div className="content-container">
                    <button onClick={handlePrev} className="arrow-button left">
                        ←
                    </button>
                    <div className="image-container">
                        <img
                            src={
                                currentProject.project_img
                                    ? `/storage/${currentProject.project_img}`
                                    : "/img/default-project.png"
                            }
                            alt={currentProject.title}
                            className="image"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/img/default-project.png";
                            }}
                        />
                    </div>
                    <div className="text-container">
                        <h2 className="project-title">
                            {currentProject.title || "Untitled Project"}
                        </h2>
                        <p className="project-creator">By {userName}</p>
                        <p className="project-description">
                            {currentProject.project_des ||
                                "No description available"}
                        </p>
                        <p className="project-type">
                            {currentProject.categories || "Project"}
                        </p>
                        <p className="project-goal">
                            <strong>Investment Goal:</strong> $
                            {currentProject.funding_goal?.toLocaleString() ||
                                "Not specified"}
                        </p>
                        <p className="project-min">
                            <strong>Min Investment:</strong> $
                            {currentProject.reserve_price?.toLocaleString() ||
                                "Not specified"}
                        </p>

                        <div className="button-container">
                            <button
                                onClick={() => setShowContactModal(true)}
                                className="button1"
                            >
                                <span>Contact Founder</span>
                            </button>
                            <Link to="/projectlist1" className="button2">
                                <span>See More</span>
                            </Link>
                        </div>
                    </div>
                    <button onClick={handleNext} className="arrow-button right">
                        →
                    </button>
                </div>

                {/* Contact Founder Modal */}
                {showContactModal && currentProject && (
                    <ContactFounder
                        project={currentProject}
                        onClose={() => setShowContactModal(false)}
                    />
                )}
            </div>
        );
    };

    const Footer = () => (
        <footer className="footer">
            <div className="footer-grid">
                {["About Us", "Resources", "Terms", "Contact"].map(
                    (section, index) => (
                        <div key={index}>
                            <h3 className="footer-title">{section}</h3>
                            <ul className="footer-list">
                                {section === "Contact"
                                    ? [
                                          {
                                              icon: <MapPin />,
                                              text: "National Road 6a Bridge No2 IDRI Building CADT, PP",
                                          },
                                          {
                                              icon: <Phone />,
                                              text: "(+855) 12 222 333",
                                          },
                                          {
                                              icon: <Mail />,
                                              text: "support@jomnouy.com",
                                          },
                                      ].map((item, i) => (
                                          <li
                                              key={i}
                                              className="footer-contact"
                                          >
                                              {item.icon} {item.text}
                                          </li>
                                      ))
                                    : ["Link1", "Link2", "Link3"].map(
                                          (link, i) => (
                                              <li key={i}>
                                                  <Link
                                                      to="#"
                                                      className="footer-link"
                                                  >
                                                      {link}
                                                  </Link>
                                              </li>
                                          )
                                      )}
                            </ul>
                        </div>
                    )
                )}
            </div>
            <div className="footer-bottom">
                <p>© 2025 Jomnouy. All Rights Reserved.</p>
                <div className="footer-social">
                    {[Facebook, Linkedin, Twitter].map((Icon, index) => (
                        <Link key={index} to="#" className="social-icon">
                            <Icon />
                        </Link>
                    ))}
                </div>
            </div>
        </footer>
    );

    return (
        <>
            <Header />
            <Hero />
            <ProjectShow />
            <FeaturedProject />
            <AuctionProject />
            <Footer />
        </>
    );
};

export default Home;
