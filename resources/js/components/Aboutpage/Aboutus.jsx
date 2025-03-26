import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Facebook, Linkedin, Twitter, Phone, Mail, MapPin, Search } from 'lucide-react';
import './Aboutus.css';

const AboutPage = () => {
  // Define HeroAbout as a component with a return statement
  const HeroAbout = () => {
    return (
      <section className="about-section1">
        <h2 className="about-title1">About Us</h2>
        <p className="about-text1">
          We are a passionate team dedicated to delivering top-notch services.
          Our mission is to empower individuals and businesses by providing high-quality solutions.
        </p>
        
        <div className="about-container-about ">
          {/* About Cards */}
          <div className="about-card">
            <div className="about-image" style={{ backgroundImage: "url('http://ishtiaq.sandbox.etdevs.com/corporate/wp-content/uploads/sites/37/2021/12/Rectangle_23.jpeg')" }}></div>
          </div>

          <div className="about-card" id="odd">
            <div className="about-image" style={{ backgroundImage: "url('https://scontent.fpnh11-1.fna.fbcdn.net/v/t39.30808-6/480243015_613966387903565_2172001186587606247_n.jpg?stp=dst-jpg_p180x540_tt6&_nc_cat=107&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFxYvEnFVayxHp_tdPpovVbisjJneMh6FmKyMmd4yHoWb0w1pFfH2_xjvXg5eEWDVCBEq9cZ7hU4UIQqDwDEj4y&_nc_ohc=zvDvnixxI_gQ7kNvgHbhPYV&_nc_oc=AdmV-y0q56WTHlCnZVsY630pi5yFphTKcasp-AftH5pR-fWyEvMfaPJtj9lbIbHQ7aI&_nc_zt=23&_nc_ht=scontent.fpnh11-1.fna&_nc_gid=ctpZwth6Rs6cOJJumRZ3eQ&oh=00_AYG_MJ40tW9ETI6y-uBHL6-JGn35Fu8_G0QqPVB8yK3boQ&oe=67E7051B')" }}></div>
          </div>

          <div className="about-card">
            <div className="about-image" style={{ backgroundImage: "url('https://via.placeholder.com/250')" }}></div>
          </div>

          <div className="about-card" id="odd">
            <div className="about-image" style={{ backgroundImage: "url('https://via.placeholder.com/250')" }}></div>
          </div>
         
        </div>
        <img src="/img/about-background.png" alt="" />
      </section>
    );
  };

  // Define Partners as a component with a return statement
  const Partners = () => {
    return (
      <section className="partners-section">
        <h2 className="partners-title">Our Partners</h2>
        <div className="partners-container">
          <div className="partner-card">
            <img className="partner-logo" src="https://logowik.com/content/uploads/images/freepik-new-20237240.logowik.com.webp" alt="Partner 1" />
          </div>
          <div className="partner-card">
            <img className="partner-logo" src="https://scontent.fpnh11-2.fna.fbcdn.net/v/t39.30808-6/443819597_122095572290339375_2812049494525244776_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeFyynM_fPHQ6ideN4xUFa-owc2pxB72RyHBzanEHvZHIRLw2e3u0cjIgzptM32X0Py3A5ZrfinLkWksQv7e7LvI&_nc_ohc=Nuz8r2bWeLwQ7kNvgEIFw2D&_nc_oc=Adms0jAQ_HstAokroMMa5NgdbowjQJx2docqene9XOfpQnP8BrZ2CHdRRQXq9_B87UE&_nc_zt=23&_nc_ht=scontent.fpnh11-2.fna&_nc_gid=PeBRWAwQYiQuW8F2af7Qzw&oh=00_AYHqC2Nt2_48CmnUvRkR1kKAMW40S5Kx-bs0CIMCVXikKw&oe=67E70541" alt="Partner 2" />
          </div>
          <div className="partner-card">
            <img className="partner-logo" src="https://vueaston.com/wp-content/uploads/2024/04/Vue-Aston-Logo-GoldenFor-Menu-1.png" alt="Partner 3" />
          </div>
          <div className="partner-card">
            <img className="partner-logo" src="https://via.placeholder.com/100" alt="Partner 4" />
          </div>
        </div>
      </section>
    );
  };

  return (
    <div>
      <HeroAbout />
      <Partners />
    </div>
  );
};

export default AboutPage;



