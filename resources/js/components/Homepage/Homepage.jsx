import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, ArrowRight } from "lucide-react"; // Import arrow icons
import "./Home.css";
import ContactFounder from "../Contactfounder/Contactfounder";
import Footer from "../footer/footer";
import AOS from "aos";
import "aos/dist/aos.css";
import Service from "../Servicepage/Servicepage";
import Header from "../Header_landingpage/header_landing";

const Home = () => {
    const [language, setLanguage] = useState("en");
    const [showContactModal, setShowContactModal] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0); // Scroll to the top of the page on mount
    }, []);

    const toggleLanguage = () => {
        setLanguage((prev) => (prev === "en" ? "km" : "en"));
    };

    const Hero = () => (
        <section className="hero">
            <div className="hero-background"></div>
            <div className="hero-content">
                <div
                    className="hero-text-section"
                    data-aos="fade-up"
                    data-aos-duration="500"
                >
                    <h1
                        className="hero-title"
                        data-aos="fade-up"
                        data-aos-duration="600"
                    >
                        Change your
                    </h1>
                    <p
                        className="hero-description"
                        data-aos="fade-up"
                        data-aos-duration="700"
                    >
                        <span>Life</span> With
                    </p>
                    <p
                        className="hero-description2"
                        data-aos="fade-up"
                        data-aos-duration="800"
                    >
                        "Jom<span>nouy"</span>
                    </p>
                    <a
                        href="/signup"
                        className="hero-button"
                        data-aos="fade-up"
                        data-aos-duration="1000"
                    >
                        Start now ➜
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
            window.scrollTo(0, 0);
            AOS.init({
                duration: 1000,
                easing: "ease-in-out",
                once: false,
                mirror: false,
            });
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
                <h2 className="project-title-section" data-aos="fade-up">
                    Tops Projects
                </h2>

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
                            <div
                                key={index}
                                className="project-card"
                                data-aos="flip-up"
                                data-aos-duration="1000"
                            >
                                <img
                                    src={
                                        project.project_img
                                            ? `/storage/${project.project_img}`
                                            : "/img/default-project.png"
                                    }
                                    alt={project.title}
                                    className="project-image "
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src =
                                            "/img/default-project.png";
                                    }}
                                />
                                <h3 className="project-title-card">
                                    {" "}
                                    {project.title || "Untitled Project"}
                                </h3>
                                <p className="project-username">
                                    Owner : <b>{userName}</b>
                                </p>
                                <p className="project-description2">
                                    {" "}
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
            <div
                className="startup-container"
                data-aos="slidefade-right"
                data-duration="500"
            >
                <div
                    className="container-title"
                    data-aos="fade-up"
                    data-aos-duration="800"
                >
                    Featured <span>Project</span>
                </div>
                <div className="content-container">
                    <button onClick={handlePrev} className="arrow-button left">
                        ←
                    </button>
                    <div
                        className="image-container"
                        data-aos="fade-down-right"
                        data-aos-duration="1000"
                    >
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
                    <div
                        className="text-container"
                        data-aos="fade-down-left"
                        data-aos-duration="1000"
                    >
                        <h2 className="project-title">
                            {currentProject.title || "Untitled Project"}
                        </h2>
                        <p className="project-creator">
                            Owner : <b>{userName}</b>
                        </p>
                        <p className="project-description">
                            {currentProject.project_des ||
                                "No description available"}
                        </p>
                        <p className="project-type">
                            Project Type :{" "}
                            <strong>
                                {currentProject.categories || "Project"}
                            </strong>
                        </p>
                        <p className="project-goal">
                            <strong>Investment Goal : </strong> $
                            {currentProject.funding_goal?.toLocaleString() ||
                                "Not specified"}
                        </p>
                        <p className="project-min">
                            <strong>Min Investment : </strong> $
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

           
                {showContactModal && currentProject && (
                    <ContactFounder
                        project={currentProject}
                        onClose={() => setShowContactModal(false)}
                    />
                )}
            </div>
        );
    };

    return (
        <div className={showContactModal ? "blur-background" : ""}>
            <Header />
            <section id="home">
                <Hero />
                <ProjectShow />
                <FeaturedProject />
            </section>
            <section id="services">
                <Service />
            </section>
            <Footer />
        </div>
    );
};

export default Home;