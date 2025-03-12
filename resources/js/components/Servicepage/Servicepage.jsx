import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    Facebook,
    Linkedin,
    Twitter,
    Phone,
    Mail,
    MapPin,
    Search,
} from "lucide-react";
import "./Service.css";
import { colors } from "laravel-mix/src/Log";
import AOS from 'aos';
import 'aos/dist/aos.css';

const Service = () => {
    const [language, setLanguage] = useState("en");

    const toggleLanguage = () => {
        setLanguage((prev) => (prev === "en" ? "km" : "en"));
    };
    // Intersection Observer to detect when service cards come into view
    useEffect(() => {
        
         AOS.init({
                        duration: 1000,
                        easing: 'ease-in-out',
                        once: false,
                        mirror: false
                    });
        const heroService = document.querySelector('.hero-service');
        const heroContent = document.querySelector('.hero-content-service');
        const serviceCards = document.querySelectorAll('.service-card'); // Select all service cards

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.target === heroService) {
                    if (entry.isIntersecting) {
                        heroService.classList.add('show-hero');
                    } else {
                        heroService.classList.remove('show-hero');
                    }
                }

                if (entry.target === heroContent) {
                    if (entry.isIntersecting) {
                        heroContent.classList.add('show-hero');
                    } else {
                        heroContent.classList.remove('show-hero');
                    }
                }

                // Observe each service card for visibility
                if (entry.target.classList.contains('service-card')) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('show'); // Add the show class to animate the card
                    } else {
                        entry.target.classList.remove('show'); // Remove the show class when it's out of view
                    }
                }
            });
        }, {
            threshold: 0.5,  // Adjust threshold as needed
        });

        // Observe the elements
        if (heroService) observer.observe(heroService);
        if (heroContent) observer.observe(heroContent);
        serviceCards.forEach(card => {
            observer.observe(card); // Observe each service card
        });

        // Cleanup on unmount
        return () => {
            if (heroService) observer.unobserve(heroService);
            if (heroContent) observer.unobserve(heroContent);
            serviceCards.forEach(card => {
                observer.unobserve(card); // Unobserve each service card
            });
        };
    }, []);

    

    const Hero = () => (
        <div id ="services" className="hero-service">
            <img src="/img/serviceimg.png" alt="Hero Background" />
            <div className="hero-content-service">
                <h1 className="hero-title1" data-aos="fade-up" data-aos-duration = "600">Opportunities don't happen.</h1>
                <h1 className="hero-title2" data-aos="fade-up" data-aos-duration = "700">You create them.</h1>
                <p className="hero-text1" data-aos="fade-up" data-aos-duration = "800">
                    Connecting creators with the companies looking to sponsor them.
                </p>

                <div className="hero-buttons">

                    <Link to="/signup" className="hero-btn-primary1" data-aos="fade-up-left" data-aos-duration = "900">
                        <button><span>Become a member</span></button>
                    </Link>


                    <Link to="/about" className="hero-btn-secondary1" data-aos="fade-up-left" data-aos-duration = "1000">
                        <button><span>Learn More</span></button>
                    </Link>
                </div>
            </div>
        </div>
    );

    const Services = () => (
        <div className="services-section">
            <h2 className="services-title">Our Services</h2>
            <div className="services-container">
                <div className="service-card">
                    <img src="/img/findsponsor.png" className="service-image" />
                    <h3 className="service-title">Find Sponsors</h3>
                    <p className="service-description">
                        Explore our Sponsorship List featuring companies ready to sponsor creators.
                    </p>
                </div>
                <div className="service-card">
                    <img src="/img/investor.png" className="service-image" />
                    <h3 className="service-title">Investor</h3>
                    <p className="service-description">
                        Check out our Sponsorship List of companies seeking creators to sponsor.                    </p>
                </div>
                <div className="service-card">
                    <img src="/img/projectstartup.png" className="service-image" />
                    <h3 className="service-title">Project Start-Up</h3>
                    <p className="service-description">
                        Explore our Sponsorship List—companies eager to sponsor creators.                    </p>
                </div>
            </div>
        </div>
    );
    const About = () => (
        <div className="about-section">
            <h2 className="about-title" data-aos="fade-up" data-aos-duration="800">Who Uses Looking For Sponsor?</h2>
            <p className="about-text" data-aos="fade-up" data-aos-duration="1000">
                ជំនួយ-Jom<span>nouy</span> is a platform that connects creators with companies looking to sponsor them. We help creators find sponsors and investors to support their projects. Our mission is to empower creators to turn their ideas into reality by providing them with the resources they need to succeed.
            </p>
            <div className="about-container" >
                <div className="about-card" data-aos="flip-right" data-aos-duration="1000">
                    <img src="https://oss6.tnaot.com/tnaot/image/2022/09/03/075e2f7238f34205af4eaa8dbbee8e4c.png" className="about-image" />
                    <h3 className="about-card-title">លីវ-ប៉ី 刘备</h3>

                </div>
                <div className="about-card" data-aos="flip-left" data-aos-duration="1000">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThNtjO3yiDLPh7qc4FYnoe9qwWMkfUPLlV4Q&s" className="about-image" />
                    <h3 className="about-card-title">Cao Cao</h3>
           
                </div>
                <div className="about-card" data-aos = "flip-right" data-aos-duration="1000">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStcPEr9SzS_9_17J6DdrDn1EtHRcT9Su0EhkT5OpXyHy2GX5Iedkr5jM2u6THo0pA33Mc&usqp=CAU" className="about-image" />

                    <h3 className="about-card-title">ស៊ឺ-ម៉ាអ៊ី</h3>
               
                </div>
                <div className="about-card" data-aos = "flip-left" data-aos-duration="1000">
                    <img src="https://i.pinimg.com/564x/d8/34/1c/d8341c070215459bb9923ffffb3e1649.jpg" className="about-image" />
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
