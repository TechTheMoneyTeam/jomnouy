import { Routes, Route } from 'react-router-dom'
import Home from '../components/Homepage/Homepage'
import Projectlist from '../components/Projectlist/Projectlist'
import About from '../components/Aboutpage/Aboutus'
import Service from '../components/Servicepage/Servicepage'
import ProjectSubmitForm from '../components/Projectsubmit/Projectsubmit'

const Index = () => {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/projectlist" element={<Projectlist />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<ProjectSubmitForm />} />
                <Route path="/home" element={<Home />} />
            </Routes>
        </div>
    )
}

export default Index
