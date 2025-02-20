import { Routes, Route } from 'react-router-dom'
// import Home from '../components/Homepage/Homepage.jsx'
// import Projectlist from '../components/Projectlist/Projectlist'
// import About from '../components/Aboutpage/Aboutus'
import SignUpPage from '../components/Signup/SignupPage.jsx'
import Loginpage from '../components/Login/Loginpage.jsx'
import Navbar from '../components/Navbar/Navbar.jsx'
import SignUpCard from '../components/Signup/SignupPage.jsx'
const Index = () => {
    return (
        <div>
            <Routes>
                {/* <Route path="/" element={<Navbar />} /> */}
                <Route path="/" element={<SignUpCard />} />
                <Route path="/signup" element={<SignUpCard />} />
                <Route path="/login" element={<Loginpage />} />
                {/* <Route path="/home" element={<Home />} /> */}
                {/* <Route path="/projectlist" element={<Projectlist />} /> */}
                {/* <Route path="/about" element={<About />} /> */}
                {/* <Route path="/projectsubmit" element={<ProjectSubmit />} /> */}

            </Routes>
        </div>
    )
}
export default Index
