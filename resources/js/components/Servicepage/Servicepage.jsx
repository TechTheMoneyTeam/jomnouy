import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import "./Service.css";

const Service = () => {
    // Initialize AOS
    useEffect(() => {
        AOS.init({
            duration: 1000,
            easing: "ease-in-out",
            once: false,
            mirror: false,
        });
    }, []);

    const Hero = () => (
        <>
            <hr className="service-line1" />
            <div id="services" className="hero-service">
                <img
                    src="/img/serviceimg.png"
                    alt="Hero Background"
                    data-aos="fade-down"
                    data-aos-duration="500"
                />
                <div className="hero-content-service">
                    <h1
                        className="hero-title1"
                        data-aos="fade-up"
                        data-aos-duration="600"
                    >
                        Opportunities don't happen.
                    </h1>
                    <h1
                        className="hero-title2"
                        data-aos="fade-up"
                        data-aos-duration="700"
                    >
                        You create them.
                    </h1>
                    <p
                        className="hero-text1"
                        data-aos="fade-up"
                        data-aos-duration="800"
                    >
                        Connecting creators with the companies looking to
                        sponsor them.
                    </p>
                    <div className="hero-buttons">
                        <Link
                            to="/signup"
                            className="hero-btn-primary1"
                            data-aos="fade-up-left"
                            data-aos-duration="900"
                        >
                            <button>
                                <span>Become a member</span>
                            </button>
                        </Link>
                        <Link
                            to="/about"
                            className="hero-btn-secondary1"
                            data-aos="fade-up-left"
                            data-aos-duration="1000"
                        >
                            <button>
                                <span>Learn More</span>
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );

    const Services = () => (
        <div className="services-section">
            <hr className="service-line3" data-aos="fade-up-left" />
            <h2
                className="services-title"
                data-aos="fade-down"
                data-aos-duration="500"
            >
                Our Services
            </h2>
            <div className="services-container">
                <div
                    className="service-card1"
                    data-aos="fade-up"
                    data-aos-duration="1000"
                >
                    <img
                        src="https://img.freepik.com/free-photo/manager-secretary-discussing-working-thumb-up-white-background_554837-713.jpg?t=st=1741882697~exp=1741886297~hmac=3d455bf148a98d1019000f542ba2a62b976a64e5f27c7b975065bb671901ff98&w=996"
                        className="service-image"
                        alt="Find Sponsors"
                    />
                    <h3 className="service-title">Find Sponsors</h3>
                    <p className="service-description1">
                        <span>
                            Jom<span>nouy</span>{" "}
                        </span>
                        is a dedicated platform designed to help businesses,
                        event organizers, content creators, and startups connect
                        with potential sponsors. Whether you're looking for
                        financial backing, product sponsorship, or strategic
                        partnerships, our platform makes it easy to find and
                        secure the right sponsors for your needs.
                    </p>
                </div>
                <div
                    className="service-card2"
                    data-aos="fade-down"
                    data-aos-duration="1000"
                >
                    <img
                        src="https://img.freepik.com/free-photo/happy-bearded-business-man-holding-purse-with-money_171337-4993.jpg?t=st=1741884695~exp=1741888295~hmac=296f46ed3b8a7a4c1cb87037153f73a1afc5c1bd06d690acf66657f6f80f6fcb&w=996"
                        className="service-image"
                        alt="Investor"
                    />
                    <h3 className="service-title">Investor</h3>
                    <p className="service-description2">
                        <span>
                            Jom<span>nouy</span>{" "}
                        </span>
                        is a dedicated platform designed to help entrepreneurs,
                        startups, and growing businesses connect with potential
                        investors who are looking for exciting opportunities.
                        Whether you're seeking venture capital, angel investors,
                        or private equity, our platform makes it easy to find
                        the right investors who are interested in supporting
                        innovative projects and business ideas.
                    </p>
                </div>
                <div
                    className="service-card3"
                    data-aos="fade-up"
                    data-aos-duration="1000"
                >
                    <img
                        src="https://img.freepik.com/free-photo/group-casually-dressed-business-people-discussing-ideas-office_7861-1633.jpg?t=st=1741885804~exp=1741889404~hmac=94ac0574024107f29f3a69babe91d0b46ffcc5a2b944d66a4b2e756f2336c858&w=1380"
                        className="service-image"
                        alt="Project Start-Up"
                    />
                    <h3 className="service-title">Project Start-Up</h3>
                    <p className="service-description3">
                        <span>
                            Jom<span>nouy</span>{" "}
                        </span>
                        to help entrepreneurs and innovators launch their
                        projects from the ground up. Whether you're developing a
                        new product, starting a business, or creating an
                        innovative service, we provide the tools, resources, and
                        guidance you need to get started and succeed.
                    </p>
                </div>
            </div>
            '
            <hr className="service-line2" data-aos="fade-up-left"/>
        </div>
    );

    const About = () => (
                
        <div className="about-section">
            <h2
                className="about-title"
                data-aos="fade-up"
                data-aos-duration="800"
            >
                Who Uses Looking For Sponsor?
            </h2>
            <p
                className="about-text"
                data-aos="fade-up"
                data-aos-duration="1000"
            >
                ជំនួយ-Jom<span>nouy</span> is a platform that connects creators
                with companies looking to sponsor them. We help creators find
                sponsors and investors to support their projects. Our mission is
                to empower creators to turn their ideas into reality by
                providing them with the resources they need to succeed.
            </p>
            <div className="about-container">
                <div
                    className="about-card"
                    data-aos="flip-right"
                    data-aos-duration="1000"
                >
                    <img
                        src="https://oss6.tnaot.com/tnaot/image/2022/09/03/075e2f7238f34205af4eaa8dbbee8e4c.png"
                        className="about-image"
                        alt="Levi-Pei"
                    />
                    <h3 className="about-card-title">លីវ-ប៉ី 刘备</h3>
                </div>
                <div
                    className="about-card"
                    data-aos="flip-left"
                    data-aos-duration="1000"
                >
                    <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThNtjO3yiDLPh7qc4FYnoe9qwWMkfUPLlV4Q&s"
                        className="about-image"
                        alt="Cao Cao"
                    />
                    <h3 className="about-card-title">Cao Cao</h3>
                </div>
                <div
                    className="about-card"
                    data-aos="flip-right"
                    data-aos-duration="1000"
                >
                    <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStcPEr9SzS_9_17J6DdrDn1EtHRcT9Su0EhkT5OpXyHy2GX5Iedkr5jM2u6THo0pA33Mc&usqp=CAU"
                        className="about-image"
                        alt="Zhuge Liang"
                    />
                    <h3 className="about-card-title">ស៊ឺ-ម៉ាអ៊ី</h3>
                </div>
                <div
                    className="about-card"
                    data-aos="flip-left"
                    data-aos-duration="1000"
                >
                    <img
                        src="https://i.pinimg.com/564x/d8/34/1c/d8341c070215459bb9923ffffb3e1649.jpg"
                        className="about-image"
                        alt="Zhuge Liang"
                    />
                    <h3 className="about-card-title">Zhuge Liang</h3>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <Hero />
            <Services />
            <About />
        </>
    );
};

export default Service;
