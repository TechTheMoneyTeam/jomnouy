import Router from '../routes/index';
import { NavLink } from 'react-router-dom';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      {/* Main Heading */}
      <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 animate-pulse">
        Welcome to the App
      </h1>
      
      {/* Subtitle */}
      <h2 className="mt-4 text-3xl font-semibold relative after:block after:w-16 after:h-1 after:bg-blue-500 after:absolute after:left-1/2 after:-translate-x-1/2 after:top-full">
        Explore More
      </h2>

      {/* Navigation Links */}
      <nav className="mt-6 flex gap-6">
        <NavLink 
          to="/" 
          className="text-lg font-medium text-gray-300 hover:text-white transition-all duration-300"
        >
          Home
        </NavLink>
        <NavLink 
          to="/about" 
          className="text-lg font-medium text-gray-300 hover:text-white transition-all duration-300"
        >
          About
        </NavLink>
      </nav>

      {/* Router Component */}
      <div className="mt-8 w-full">
        <Router />
      </div>
    </div>
  );
};

export default App;
