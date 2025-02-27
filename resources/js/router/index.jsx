import { Routes, Route } from 'react-router-dom';
import Home from '../components/Homepage/Homepage';
import About from '../components/Aboutpage/Aboutus';
import Service from '../components/Servicepage/Servicepage';
import ProjectExisting from '../components/Projectsubmit/Projectexisting';
import ProjectListing from '../components/Projects/Projectlist1';
import SignupForm  from '../components/Control/ProfileForm/SignupForm';
import LoginForm  from '../components/Control/ProfileForm/LoginForm'; 
import Logout from '../components/Control/ProfileForm/Logout';
import Settings from '../components/Settings/Setting';
import ProfileDisplay from '../components/Profile/Profile';
import UserType from '../components/Control/ProfileForm/SignupSelect';
import EditProfile from '../components/Settings/EditProfile';
import ResetPassword from '../components/Control/ProfileForm/Resetpassword';
import Notification from '../components/Settings/Notification';
import Following from '../components/Settings/Following';
import ProjectSelectionForm from '../components/Projectsubmit/Projectselect';
import MyProjects from '../components/Myproject/Myproject';




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
                <Route path="/existing" element={<ProjectExisting />} />
                <Route path="/create" element={<ProjectSelectionForm />} />
                <Route path="/my-project" element={<MyProjects />} />
                {/* User Related Routes */}
                <Route path="/signup" element={<SignupForm />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/logout" element={<Logout />} />

              

                
               
                <Route path="/user" element={<UserType />} />
                <Route path="/profile" element={<ProfileDisplay />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/profile/edit" element={<EditProfile />} />
                <Route path="/reset" element={<ResetPassword />} />
            
                <Route path="/followings" element={<Following />} />
                <Route path="/noti" element={<Notification />} />

               
                
                
            </Routes>
        </div>
    );
};

export default Index;