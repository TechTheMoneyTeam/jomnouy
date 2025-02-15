import { Routes, Route } from 'react-router-dom'
import Home from '../components/Homepage/Homepage'
import Projectlist from '../components/Projectlist/Projectlist'
import About from '../components/Aboutpage/Aboutus'
import Login from '../components/login'
import ProjectSubmit from '../components/Projectsubmit/Projectsubmit'

const Index = () => {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/projectlist" element={<Projectlist />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/projectsubmit" element={<ProjectSubmit />} />
                
            </Routes>
        </div>
    )
}

export default Index
