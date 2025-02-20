import { Routes, Route } from 'react-router-dom';
import Home from '../components/Homepage/Homepage';
import About from '../components/Aboutpage/Aboutus';
import Service from '../components/Servicepage/Servicepage';
import ProjectSubmitForm from '../components/Projectsubmit/Projectsubmit';
import ProjectListing from '../components/Projects/Projectlist1';
import SignupForm  from '../components/Control/ProfileForm/SignupForm';
import LoginForm  from '../components/Control/ProfileForm/LoginForm'; 
import Profile  from '../components/Control/ProfileForm/ProfileForm'; 
import UserType from '../components/Control/ProfileForm/SignupSelect';

const Index = () => {
    return (
        <div>
            <Routes>
            
                <Route path="/projectlist" element={<Projectlist />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Service />} />
                <Route path="/ " element={<Home />} />
                <Route path="/home" element={<Home />} />
            </Routes>
        </div>
    );
};

export default Index;