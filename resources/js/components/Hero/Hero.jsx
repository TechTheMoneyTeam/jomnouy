import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">Find Your Next Investment Opportunity</h1>
            <p className="hero-description">Connect with innovative startups and make impactful investments in Cambodia's future</p>
            <button className="hero-button">Start Now</button>
          </div>
          <div className="hero-image-container">
            <img src="/api/placeholder/600/400" alt="Investment Concept" className="hero-image" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;