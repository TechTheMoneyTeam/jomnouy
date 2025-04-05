import React, { useState, useEffect } from 'react';
import { Bell, Grid, Settings, HelpCircle, Package, Users, File, Lock, Inbox, ChevronDown, ChevronRight } from 'lucide-react';
import { BriefcaseBusiness } from 'lucide-react';
import Dashboard1 from './dashboard';
import TaskManagementTable from './myInvestmentTab'; // Import the component
import InvestorProjects from "./myInvestmentTab";
import InvestorUpdates from './updateAndReport';
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [username, setUsername] = useState('');

  const mainNavItems = [
    { id: 'Dashboard', icon: <Bell size={20} />, label: 'Dashboard' }, // Renamed 'Overview' to 'Dashboard'
    { id: 'My investment', icon: <BriefcaseBusiness size={20} />, label: 'My investment' },
    { id: 'Milestone', icon: <Inbox size={20} />, label: 'Milestone' },
    { id: 'Update & Report', icon: <Package size={20} />, label: 'Update & Report', hasChildren: true },
    { id: 'Transaction', icon: <Users size={20} />, label: 'Transaction', hasChildren: true },
    
  ];
  const secondaryNavItems = [
    { id: 'docs', icon: <File size={20} />, label: 'Docs' },
    { id: 'components', icon: <Package size={20} />, label: 'Components' },
    { id: 'help', icon: <HelpCircle size={20} />, label: 'Help' }
  ];

  // Handle tab click
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUsername(user.username); // Assuming 'user_id' is in the user object
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const tabComponents = {
    dashboard: <Dashboard1 />,
    'My investment': <InvestorProjects />,
    'Milestone': <InvestorProjects />,
    'Update & Report': <InvestorUpdates />,
  };

  const renderNavItem = (item) => {
    const isActive = activeTab === item.id;
    return (
        <div
            key={item.id}
            className={`flex items-center justify-between py-4 px-3 rounded-lg cursor-pointer transition-colors ${
                isActive ? 'bg-orange-500 text-white' : 'hover:bg-gray-200 text-gray-700'
            } mt-1`}
            onClick={() => handleTabClick(item.id)}
        >
            <div className="flex items-center">
                <div className={`mr-3 ${isActive ? 'text-white' : 'text-gray-400'}`}>
                    {React.cloneElement(item.icon, { color: isActive ? 'white' : 'gray' })}
                </div>
                <span>{item.label}</span>
            </div>
            {item.hasChildren && <ChevronDown size={16} className={`${isActive ? 'text-white' : 'text-gray-400'}`} />}
        </div>
    );
};

  return (
    <div className="flex h-screen bg-white text-black">
      {/* Sidebar */}
      <div className="w-64 border-r">
        <div className="flex items-center p-4 cursor-pointer" onClick={() => (window.location.href = '/projectlist1')}>
          <span className="text-3xl font-bold">
            <span className="text-black">JOM</span>
            <span className="text-orange-500">-NOUY</span>
          </span>
        </div>

        {/* Navigation */}
        <nav className="mt-4">
          <div className="px-4 py-6 text-sm font-medium">
            {mainNavItems.map(renderNavItem)}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="border-b flex justify-between items-center p-4">
          <h1 className="text-2xl font-medium capitalize">{activeTab}</h1>

          <div className="flex items-center space-x-4">
            <div>{username}</div>
            <button className="bg-orange-500 rounded-full h-8 w-8 flex items-center justify-center">
              <span className="text-xs">US</span>
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-4">
          

          {tabComponents[activeTab] || (
            <div className="bg-gray-800 rounded-lg p-6 flex items-center justify-center">
              <h2 className="text-xl text-gray-400">
                {activeTab} content will be displayed here
              </h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;