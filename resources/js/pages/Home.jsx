import React from 'react';
import Header from '../components/Header/Header';
import Hero from '../components/Hero/Hero';
import Projectcard from '../components/Projectcard/Projectcard';
import Footer from '../components/Footer/Footer';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Hero />
      <Projectcard />
      <Footer />
    </div>
  );
};

export default Home;