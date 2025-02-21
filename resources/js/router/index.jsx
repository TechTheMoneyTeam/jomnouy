import { Routes, Route } from 'react-router-dom';
import Home from '../components/Homepage/Homepage';
import About from '../components/Aboutpage/Aboutus';
import Service from '../components/Servicepage/Servicepage';
import ProjectSubmitForm from '../components/Projectsubmit/Projectsubmit';
import ProjectListing from '../components/Projects/Projectlist1';
import SignupForm  from '../components/Control/ProfileForm/SignupForm';
import LoginForm  from '../components/Control/ProfileForm/LoginForm'; 


import UserType from '../components/Control/ProfileForm/SignupSelect';



const Index = () => {
    return (
        <div>
            <Routes>
                {/* Main Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Service/>} />
                
                {/* Project Related Routes */}
                <Route path="/projectlist1" element={<ProjectListing />} />
                <Route path="/projectsubmit" element={<ProjectSubmitForm />} />
                
                {/* User Related Routes */}
                <Route path="/signup" element={<SignupForm />} />
                <Route path="/login" element={<LoginForm />} />
                
               
                <Route path="/user" element={<UserType />} />
                
            </Routes>
        </div>
    );
};

export default Index;