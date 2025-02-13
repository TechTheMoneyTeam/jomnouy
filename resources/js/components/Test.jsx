import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const App = () => {
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: 'Ecommerce Website',
      author: 'Hong Viray',
      daysLeft: 4,
      funded: 2,
      image: '/api/placeholder/400/300'
    },
    // Add more sample projects as needed
  ]);

  const [popularStartup] = useState({
    title: 'Smart Water Quality Monitoring System',
    description: 'A network of IoT sensors that continuously monitor water bodies for contamination, pH levels, and pollutants.',
    category: 'Technology',
    investmentGoal: 1000000,
    minInvestment: 800000,
    image: '/api/placeholder/500/300'
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-orange-500">Jom-nouy</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-orange-500 text-white px-4 py-2 rounded-md">
                Login
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Top Projects Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Top Projects</h2>
          <div className="flex space-x-2">
            <button className="p-2 rounded-full bg-gray-100">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button className="p-2 rounded-full bg-gray-100">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.map(project => (
            <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src={project.image} alt={project.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{project.title}</h3>
                <p className="text-gray-600">{project.author}</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-500">{project.daysLeft} days left</span>
                  <span className="text-sm text-gray-500">{project.funded}% Funded</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Startup Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50">
        <h2 className="text-3xl font-bold mb-8">Popular Start-Up Idea</h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <img src={popularStartup.image} alt={popularStartup.title} className="w-full h-64 object-cover rounded-lg" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">{popularStartup.title}</h3>
              <p className="text-gray-600 mb-4">{popularStartup.description}</p>
              <span className="inline-block bg-orange-500 text-white px-3 py-1 rounded-full text-sm mb-4">
                {popularStartup.category}
              </span>
              <div className="space-y-2">
                <p className="text-lg">Investment Goal: ${popularStartup.investmentGoal.toLocaleString()}</p>
                <p className="text-lg">Min Investment: ${popularStartup.minInvestment.toLocaleString()}</p>
              </div>
              <div className="mt-6 space-x-4">
                <button className="bg-orange-500 text-white px-6 py-2 rounded-md">
                  Contact Founder
                </button>
                <button className="text-orange-500 border border-orange-500 px-6 py-2 rounded-md">
                  See more
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default App;