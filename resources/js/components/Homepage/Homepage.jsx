import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';
import { Facebook, Linkedin, Twitter, Search } from 'lucide-react';
import './Home.css';

const Home = () => {
  const [language, setLanguage] = useState('en');
  
  // Language Toggle Handler
  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'km' : 'en'));
  };

  const Header = () => {
    const location = useLocation();
    
    return (
      <header className="header">
        <nav className="nav-container">
          <Link to="/" className="logo">Jom<span className="nouy">nouy</span></Link>
          <div className="nav-links">
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active-link' : ''}`}>Home</Link>
            <Link to="/services" className={`nav-link ${location.pathname === '/services' ? 'active-link' : ''}`}>Services</Link>
            <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active-link' : ''}`}>About</Link>
            <button className="login-button"><span>Login</span></button>
          </div>
          <div className="button-group">
            <button className="search-button"><Search /></button>
            <button onClick={toggleLanguage} className="language-button">
              <span className="flag-icon">🇰🇭</span>{language === 'en' ? 'English' : 'ខ្មែរ'}
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
          <p className="hero-description2">"Jom<span>nouy"</span></p>
          <a href="/projectlist" className="hero-button">ចាប់ផ្តើមឥឡូវនេះ ➜ </a>
        </div>
        <div className="hero-image-wrapper">
          <img src="/img/hero.png" alt="Illustration of investment opportunities" className="analytics-image" />
        </div>
      </div>
    </section>
  );

const ProjectShow = () => {
  const [projectsQueue, setProjectsQueue] = useState([
    { id: 1, title: "Project One", username: "user123", image: "https://upload.wikimedia.org/wikipedia/commons/a/a4/2019_Toyota_Corolla_Icon_Tech_VVT-i_Hybrid_1.8.jpg", description: "This is the first project description." },
    { id: 2, title: "Project Two", username: "devMaster", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqHjC9bfyBdUdGWH6nUjjh2hqZCCH-ykVd_A&s", description: "Another amazing project by a top developer." },
    { id: 3, title: "Project Three", username: "coderX", image: "https://i5.walmartimages.com/seo/Disney-Pixar-Cars-Track-Talkers-Lightning-McQueen-Talking-Toy-Car-5-5-inch-Collectible_39dc9e8e-46db-4c94-901b-169561d879a6.96d0b1baad1d973200ac2517b9d4411f.jpeg", description: "Yet another cool project." },
    { id: 4, title: "Project Four", username: "builder99", image: "https://via.placeholder.com/150", description: "A fascinating build." },
    { id: 5, title: "Project Five", username: "alphaDev", image: "https://www.autoshippers.co.uk/blog/wp-content/uploads/bugatti-centodieci.jpg", description: "An innovative approach." },
    { id: 6, title: "Project Six", username: "developer6", image: "https://via.placeholder.com/150", description: "A creative new project." },
    { id: 7, title: "Project Seven", username: "user777", image: "https://via.placeholder.com/150", description: "Exciting new ideas." },
  ]);

  const itemsPerRow = 5;
  const [currentIndex, setCurrentIndex] = useState(0);

  // Handle Next: Move the first item to the end and shift the items
  const handleNext = () => {
    setProjectsQueue((prevQueue) => {
      const updatedQueue = [...prevQueue];
      updatedQueue.push(updatedQueue.shift()); // Move the first item to the end
      return updatedQueue;
    });
    setCurrentIndex((prevIndex) => (prevIndex + 1) % projectsQueue.length); // Adjust index for transition
  };

  // Handle Prev: Move the last item to the front and shift the items
  const handlePrev = () => {
    setProjectsQueue((prevQueue) => {
      const updatedQueue = [...prevQueue];
      updatedQueue.unshift(updatedQueue.pop()); // Move the last item to the front
      return updatedQueue;
    });
    setCurrentIndex((prevIndex) => (prevIndex - 1 + projectsQueue.length) % projectsQueue.length); // Adjust index for transition
  };

  return (
    <div className="project-container">
      {/* Title for the project section */}
      <h2 className="project-title-section">Popular Projects</h2>

      {/* Navigation buttons */}
      <div className="project-nav">
        <button onClick={handlePrev} className="nav-button">Prev</button>
        <button onClick={handleNext} className="nav-button">Next</button>
      </div>

      {/* Project Slider */}
      <div className="project-slider">
        <div className="project-grid">
          {/* Display only the first 5 items at a time */}
          {projectsQueue.slice(0, itemsPerRow).map((project) => (
            <div key={project.id} className="project-card">
              <img src={project.image} alt={project.title} className="project-image" />
              <h3 className="project-title">{project.title}</h3>
              <p className="project-username">By {project.username}</p>
              <p className="project-description">{project.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
  const Footer = () => (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <h3 className="footer-title">About Us</h3>
          <ul className="footer-list">
            <li><Link to="#" className="footer-link">How It Works</Link></li>
            <li><Link to="#" className="footer-link">Why Jomnouy</Link></li>
            <li><Link to="#" className="footer-link">Success Stories</Link></li>
            <li><Link to="#" className="footer-link">Contact</Link></li>
            <li><Link to="#" className="footer-link">Partners</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="footer-title">Resources</h3>
          <ul className="footer-list">
            <li><Link to="#" className="footer-link">Pricing</Link></li>
            <li><Link to="#" className="footer-link">Request Demo</Link></li>
            <li><Link to="#" className="footer-link">Customers</Link></li>
            <li><Link to="#" className="footer-link">Press</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="footer-title">Terms</h3>
          <ul className="footer-list">
            <li><Link to="#" className="footer-link">Terms of Service</Link></li>
            <li><Link to="#" className="footer-link">Privacy Policy</Link></li>
            <li><Link to="#" className="footer-link">Intellectual Property Policy</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="footer-title">Contact</h3>
          <ul className="footer-list">
            <li className="footer-contact"><MapPin /> National Road 6a Bridge No2 IDRI Building CADT, PP</li>
            <li className="footer-contact"><Phone /> (+855) 12 222 333</li>
            <li className="footer-contact"><Mail /> support@jomnouy.com</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 Jomnouy. All Rights Reserved.</p>
        <div className="footer-social">
          <Link to="#" className="social-icon"><Facebook /></Link>
          <Link to="#" className="social-icon"><Linkedin /></Link>
          <Link to="#" className="social-icon"><Twitter /></Link>
        </div>
      </div>
    </footer>
  );

  return (
    <>
      <Header />
      <Hero />
      <ProjectShow />
      <Footer />
    </>
  );
};

export default Home;
