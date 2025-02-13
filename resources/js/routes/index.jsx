// routes/index.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
// import About from '../pages/About';
// import Projects from '../pages/Projects';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* Add other routes here */}
    </Routes>
  );
};

export default AppRoutes;