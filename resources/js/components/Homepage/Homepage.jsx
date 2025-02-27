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
                        <Link to="/projectlist" className="login-button">
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
                <h2 className="project-title-section">Popular Projects</h2>

                {/* Pagination Buttons */}
                <div className="absolute top-0 right-0 flex gap-2 z-10">
                    <button
                        onClick={prevProject}
                        className="prev-btn"
                    >
                        <ArrowLeft />
                    </button>

                    <button
                        onClick={nextProject}
                        className="next-btn"
                    >
                        <ArrowRight />
                    </button>
                </div>

                {/* Project Cards - Centered and Limited to 5 */}
                <div className="project-grid">
                    {visibleProjects.map((project, index) => (
                        <div key={index} className={"project-card"}>
                            <img
                                src={project.project_img}
                                alt={project.title}
                                className="project-image w-full h-40 object-cover rounded-lg"
                            />
                            <h3 className="project-title text-lg font-bold mt-3">
                                {project.title}
                            </h3>
                            <p className="project-username text-gray-500">
                                By {project.username}
                            </p>
                            <p className="project-description2">
                                {project.project_des}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Explore More Button */}
                <div className="flex justify-center mt-8">
                    <button className="explore-btn">Explore More</button>
                </div>
            </div>
        );
    };


   

    
    const Startup = () => {
        const projectData = {
            title: "Smart Water Quality Monitoring System",
            description: "A network of IoT sensors that continuously monitor water bodies for contamination, pH levels, and pollutants. It could be useful for both environmental agencies and households in flood-prone areas.",
            type: "Technology",
            investmentGoal: "1,000,000 $",
            minInvestment: "800,000 $",
        };
    
        const handlePrev = () => {
            console.log("Previous project");
        };
    
        const handleNext = () => {
            console.log("Next project");
        };
    
        return (
            <div className="startup-container">
                <div className="container-title">Popular <span>Start-Up</span> Project</div>
                <div className="content-container">
                    <button onClick={handlePrev} className="arrow-button left">←</button>
                    <div className="image-container">
                        <img 
                            src="https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg" 
                            alt="Smart Water Quality Monitoring System" 
                            className="image" 
                        />
                    </div>
                    <div className="text-container">
                        <h2 className="project-title">{projectData.title}</h2>
                        <p className="project-description">{projectData.description}</p>
                        <p className="project-type">{projectData.type}</p>
                        <p className="project-goal"><strong>Investment Goal:</strong> {projectData.investmentGoal}</p>
                        <p className="project-min"><strong>Min Investment:</strong> {projectData.minInvestment}</p>
                        
                        <div className="button-container">
                            <button className="button1">Contact Founder</button>
                            <button className="button2">See More</button>
                        </div>
                    </div>
                    <button onClick={handleNext} className="arrow-button right">→</button>
                </div>
            </div>
        );
    };
    ;

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
            <Startup />
            <Footer />
        </>
    );
};

export default Home;
