
// pages/Home.jsx
import React from 'react';
import Header from '../components/Header/Header';
import Hero from '../components/Hero/Hero';
import ProjectCard from '../components/ProjectCard/ProjectCard';
import Footer from '../components/Footer/Footer';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Hero />
      <ProjectCard />
      <Footer />
    </div>
  );
};

export default Home;
