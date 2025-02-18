import { Routes, Route } from 'react-router-dom'
import Home from '../components/Homepage/Homepage'
import Projectlist from '../components/Projectlist/Projectlist'
import About from '../components/Aboutpage/Aboutus'
import Service from '../components/Servicepage/Servicepage'
import ProjectSubmitForm from '../components/Projectsubmit/Projectsubmit'
import ProjectListing from '../components/Projects/Projectlist1'

const Index = () => {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/projectlist1" element={<ProjectListing />} />
                <Route path="/projectsubmit" element={<ProjectSubmitForm />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Service/>} />
                <Route path="/home" element={<Home />} />
            </Routes>
        </div>
    )
}

export default Index
