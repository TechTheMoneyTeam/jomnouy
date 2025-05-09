import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import "./Service.css";
// Import your service image
// Adjust path as needed

const Service = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
        AOS.init({
            duration: 1000,
            easing: "ease-in-out",
            once: false,
            mirror: false,
        });
    }, []);

    const Hero = () => (
        <div className="hero-service">
            <div className="customer-card-container">
                {/* Left: Image */}
                <div className="customer-card-image">
                    <img
                        src="/img/serviceimg.png"
                        alt="Customer Service"
                        className="img"
                        data-aos="fade-down"
                        data-aos-duration="800"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/img/default-service.png"; // Fallback image
                        }}
                    />
                </div>

                {/* Right: Text Content */}
                <div className="customer-card-content">
                    <h2
                        className="title-service"
                        data-aos="fade-left"
                        data-aos-duration="800"
                    >
                        CUSTOMER{" "}
                        <span
                            className="subtitle"
                            data-aos="fade-left"
                            data-aos-duration="800"
                        >
                            Service
                        </span>
                    </h2>
                    <p
                        className="description"
                        data-aos="fade-left"
                        data-aos-duration="800"
                    >
                        We provide 24/7 assistance to ensure a seamless
                        experience. Whether you need product guidance or
                        technical support, our expert team is always ready to
                        help!
                    </p>
                    <div
                        className="btn-container"
                        data-aos="fade-left"
                        data-aos-duration="800"
                    >
                        <button
                            className="primary-button"
                            data-aos="fade-up"
                            data-aos-duration="800"
                        >
                            Become a member{" "}
                        </button>
                    </div>

                    <p
                        className="website"
                        data-aos="fade-up"
                        data-aos-duration="800"
                    >
                        www.<span>ជំនួយ</span>-jomnouy.com
                    </p>
                </div>
            </div>
        </div>
    );

    const Services = () => (
        <div className="services-section">
            <hr className="service-line3" data-aos="fade-up-left" />
            <h2
                className="services-title"
                data-aos="fade-down"
                data-aos-duration="800"
            >
                Our Services
            </h2>
            <div className="services-container">
                {/* Service Card 1 */}
                <div
                    className="service-card1 h-auto "
                    data-aos="fade-up"
                    data-aos-duration="1000"
                >
                    <img
                        src="https://img.freepik.com/free-photo/manager-secretary-discussing-working-thumb-up-white-background_554837-713.jpg?t=st=1741882697~exp=1741886297~hmac=3d455bf148a98d1019000f542ba2a62b976a64e5f27c7b975065bb671901ff98&w=996"
                        className="service-image"
                        alt="Find Sponsors"
                    />
                    <h3 className="service-title">Project Start-Up</h3>
                    <p className="service-description">
                        <span>
                            Jom<span>nouy</span>{" "}
                        </span>
                        We support entrepreneurs and innovators in launching
                        their projects by providing essential tools, resources,
                        and guidance for product development, business startups,
                        and innovative services.
                    </p>
                </div>
                {/* Service Card 2 */}
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
                    <h3 className="service-title">Finding Sponsor</h3>
                    <p className="service-description">
                        <span>
                            Jom<span>nouy</span>{" "}
                        </span>
                        Our platform helps businesses, event organizers, content
                        creators, and startups connect with the right sponsors
                        for financial backing, product sponsorship, or strategic
                        partnerships.
                    </p>
                </div>
                {/* Service Card 3 */}
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
                    <h3 className="service-title">Investor</h3>
                    <p className="service-description">
                        <span>
                            Jom<span>nouy</span>{" "}
                        </span>
                        Our platform connects entrepreneurs, startups, and
                        businesses with investors seeking exciting
                        opportunities, including venture capital, angel
                        investors, and private equity.
                    </p>
                </div>
            </div>
            <hr className="service-line2" data-aos="fade-up-left" />
        </div>
    );

    const About = () => (
        <div
            className="about-section"
            data-aos="fade-down"
            data-aos-duration="1000"
        >
            <h2
                className="about-title"
                data-aos="fade-up"
                data-aos-duration="1000"
            >
                Who Uses Looking For Sponsor?
            </h2>
            <p
                className="about-text"
                data-aos="fade-up"
                data-aos-duration="1000"
            >
                <span> ជំនួយ-Jomnouy</span> is a dynamic platform that connects
                entrepreneurs, startups, and auction organizers with potential
                investors and sponsors, helping them secure the funding and
                resources needed to grow and succeed. Whether you're launching a
                new business, organizing an auction, or looking for financial
                backing to scale your venture, our platform streamlines the
                process of finding the right partners.
            </p>

            <div className="about-container">
                {/* About cards */}
                {[
                    {
                        img: "https://img.freepik.com/free-photo/teamwork-makes-dream-work_23-2151957105.jpg?uid=R17086187&ga=GA1.1.439651802.1741882321&semt=ais_authors_boost",
                        title: "Startups & Entrepreneurs",
                        alt: "Card1",
                    },
                    {
                        img: "https://img.freepik.com/free-photo/female-wedding-planner-working-ceremony_23-2150167258.jpg?t=st=1741940688~exp=1741944288~hmac=208d9477a2a8d69b685fa997a0326b1d996addb38423e0c96f2392d09ba00264&w=996",
                        title: "Event Organizers",
                        alt: "Card2",
                    },
                    {
                        img: "https://blog.happioteam.com/wp-content/uploads/2023/03/MMegamind-1024x1024.jpg",
                        title: "Content Creators & Influencers",
                        alt: "Card3",
                    },
                    {
                        img: "https://img.freepik.com/free-photo/person-using-ar-technology-their-daily-occupation_23-2151137526.jpg?t=st=1741940765~exp=1741944365~hmac=5bcc36a4444538e182ac5b37797c22f4d068f6a7edf437d1d0bf43735f1676d9&w=996",
                        title: "Tech & Innovation Projects",
                        alt: "Card4",
                    },
                ].map((card, index) => (
                    <div
                        key={index}
                        className="about-card-service"
                        data-aos={index % 2 === 0 ? "flip-right" : "flip-left"}
                        data-aos-duration="1000"
                    >
                        <img
                            src={card.img}
                            className="about-image-service"
                            alt={card.alt}
                        />
                        <h3 className="about-card-title-service">
                            {card.title}
                        </h3>
                    </div>
                ))}
            </div>
        </div>
    );

    const FeatureSection = () => {
        return (
            <div className="feature-section">
                <hr className="feature-line" data-aos="fade-right" />
                <h2
                    className="feature-title"
                    data-aos="fade-up"
                    data-aos-duration="700"
                >
                    Our Service Features
                </h2>

                {/* Container 1 - Image on left */}
                <div className="feature-container">
                    <div
                        className="feature-image-wrapper"
                        data-aos="fade-up-right"
                        data-aos-duration="1000"
                    >
                        <ImageSlider
                            images={[
                                "https://midias-blog-mkt.s3.amazonaws.com/uploads/2022/03/ESM-scaled.jpg",
                                "https://media.istockphoto.com/id/1366023601/photo/cropped-shot-of-an-attractive-young-female-call-center-agent-working-in-her-office.jpg?s=612x612&w=0&k=20&c=qvv5Fnh0eE5S0n8ARf0ZTqfFPGSs-nX41xnGsABfOZg=",
                                "https://img.freepik.com/free-vector/service-24-7-concept-illustration_114360-7380.jpg?t=st=1742802041~exp=1742805641~hmac=66f4a812c175522997a48f09669f4f5cf9b390fe77d3b79e57347c9522ec8069&w=826",
                                "https://st2.depositphotos.com/3591429/7699/i/450/depositphotos_76994273-stock-photo-customer-service-support-concept.jpg",
                            ]}
                        />
                    </div>
                    <div
                        className="feature-content"
                        data-aos="fade-up-left"
                        data-aos-duration="1000"
                    >
                        <h3 className="feature-content-title">
                            All in One service to make it Better
                        </h3>
                        <p className="feature-content-text">Take control of your financial future with All in One - the comprehensive investment platform designed for investors at every level. Our intuitive web app consolidates everything you need to build, manage, and grow your portfolio in a single, powerful interface.</p>
                    </div>
                </div>

                {/* Container 2 - Image on right */}
                <div className="feature-container reverse">
                    <div
                        className="feature-content"
                        data-aos="fade-up-right"
                        data-aos-duration="1000"
                    >
                        <h3 className="feature-content-title">
                            Seamless Connection Experience
                        </h3>
                        <p className="feature-content-text">
                            Our platform ensures entrepreneurs and investors can
                            connect effortlessly with advanced matching
                            algorithms, secure messaging, and comprehensive
                            profile management to help you find the perfect
                            partnership opportunities.
                        </p>
                    </div>
                    <div
                        className="feature-image-wrapper"
                        data-aos="fade-up-left"
                        data-aos-duration="1000"
                    >
                        <ImageSlider
                            images={[
                                "https://img.freepik.com/free-photo/man-with-his-mobile-phone-working-network-connection_1134-50.jpg?t=st=1741941556~exp=1741945156~hmac=84e889d9910cd3c232df25713fff93d841fca30a5150a8b4cbbe0d219b84761b&w=996",
                                "https://img.freepik.com/free-photo/security-system-locks-data-computer-safety-generated-by-ai_188544-26239.jpg?t=st=1741941595~exp=1741945195~hmac=250fa675f2f19f4985c22cfb3714113ef7829e66b2fae66f4e68ca9935308807&w=1060",
                                "https://img.freepik.com/free-photo/female-scientist-white_53876-89029.jpg?t=st=1741941610~exp=1741945210~hmac=62cc968c62f08e9212a561308895b519447f2f35ab330f4235757c7ff2399da0&w=900",
                            ]}
                        />
                    </div>
                </div>

                {/* Container 3 - Image on left */}
                <div className="feature-container">
                    <div
                        className="feature-image-wrapper"
                        data-aos="fade-up-right"
                        data-aos-duration="1000"
                    >
                        <ImageSlider
                            images={[
                                "https://img.freepik.com/free-photo/hand-workplace-working-analysis-note_1150-1686.jpg?t=st=1741941428~exp=1741945028~hmac=1d7feab4ac811d40024bfcfa5f2735c8797eb35d2cf50be8b1f47103445e2890&w=900",
                                "https://img.freepik.com/free-photo/businesswoman-having-online-conference-office_1098-20005.jpg?t=st=1741941458~exp=1741945058~hmac=254a0f33cfe9bfe7263505a12cc09d86f1755643dd2adfbe73000f473deb9270&w=996",
                                "https://img.freepik.com/free-photo/financial-graph-stock-market-tablet_53876-95807.jpg?t=st=1741941509~exp=1741945109~hmac=ad20937805987ad67f7856aa5026928642f4344d5afee300e0c4066d94951a6a&w=996",
                            ]}
                        />
                    </div>
                    <div
                        className="feature-content"
                        data-aos="fade-up-left"
                        data-aos-duration="1000"
                    >
                        <h3 className="feature-content-title">
                            Growth Analytics & Reporting
                        </h3>
                        <p className="feature-content-text">
                            Track your progress with our comprehensive analytics
                            suite. Monitor engagement metrics, investment
                            opportunities, and partnership results with detailed
                            reports designed to help you optimize your
                            strategies for maximum success.
                        </p>
                    </div>
                </div>

                {/* Container 4 - Image on right */}
                <div className="feature-container reverse">
                    <div
                        className="feature-content"
                        data-aos="fade-up-right"
                        data-aos-duration="1000"
                    >
                        <h3 className="feature-content-title">
                            Secure & Trusted Partnerships
                        </h3>
                        <p className="feature-content-text">
                            We prioritize security and trust in every
                            interaction. Our verification system ensures all
                            participants are legitimate, while our secure
                            communication channels protect your sensitive
                            information throughout the sponsorship and
                            investment process.
                        </p>
                    </div>
                    <div
                        className="feature-image-wrapper"
                        data-aos="fade-up-left"
                        data-aos-duration="1000"
                    >
                        <ImageSlider
                            images={[
                                "https://img.freepik.com/free-photo/people-with-icons-theme-security_53876-46861.jpg?t=st=1742802175~exp=1742805775~hmac=5b2e586a2df43ba50ca9e8d7622861f0dbcef21ff6e48f404b5093aa6d81f674&w=996",
                                "https://img.freepik.com/free-photo/people-with-icons-theme-security_53876-46861.jpg?t=st=1742802175~exp=1742805775~hmac=5b2e586a2df43ba50ca9e8d7622861f0dbcef21ff6e48f404b5093aa6d81f674&w=996",
                                "https://img.freepik.com/free-photo/people-with-icons-theme-security_53876-46861.jpg?t=st=1742802175~exp=1742805775~hmac=5b2e586a2df43ba50ca9e8d7622861f0dbcef21ff6e48f404b5093aa6d81f674&w=996",
                            ]}
                        />
                    </div>
                </div>
            </div>
        );
    };

    // ImageSlider component for auto-animating images
    const ImageSlider = ({ images }) => {
        const [currentIndex, setCurrentIndex] = useState(0);

        useEffect(() => {
            // Auto-rotate images every 3 seconds
            const interval = setInterval(() => {
                setCurrentIndex((prevIndex) =>
                    prevIndex === images.length - 1 ? 0 : prevIndex + 1
                );
            }, 3000);

            return () => clearInterval(interval);
        }, [images.length]);

        return (
            <div className="image-slider">
                {images.map((image, index) => (
                    <img
                        key={index}
                        src={image}
                        alt={`Feature slide ${index + 1}`}
                        className={`slider-image ${
                            index === currentIndex ? "active" : ""
                        }`}
                    />
                ))}
                <div className="slider-dots">
                    {images.map((_, index) => (
                        <span
                            key={index}
                            className={`slider-dot ${
                                index === currentIndex ? "active" : ""
                            }`}
                            onClick={() => setCurrentIndex(index)}
                        />
                    ))}
                </div>
            </div>
        );
    };

    return (
        <>
            <Hero />
            <Services />
            <About />
            <FeatureSection />
        </>
    );
};

export default Service;
