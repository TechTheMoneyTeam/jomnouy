import React from 'react';
import { Route, Routes } from 'react-router-dom';
// import Homepage from '../Homepage.jsx'; // Import Home component
import Servicepage from '../components/Homepage/Servicepage.jsx'; // Import Servicepage component
import Homepage from '../components/Homepage/Homepage.jsx'; // Import Homepage component
const Index = () => {
    return (
        <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/Servicepage" element={<Servicepage />} />
            {/* Add other routes here */}
        </Routes>
    );
};

export default Index;
